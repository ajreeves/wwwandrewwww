#!/usr/bin/env node
import { access, mkdir } from "node:fs/promises";
import path from "node:path";
import { emptyPublicationMetadata, publicationMetadataJsonSchema, slugify, validatePublicationMetadata } from "./schema.mjs";
import { findPdfFiles, metadataDir, writeJson } from "./io.mjs";
import { extractPdfText, pagesToPromptText } from "./pdf-text.mjs";
import { loadLocalEnv } from "./env.mjs";

const usage = `
Usage:
  OPENAI_API_KEY=... OPENAI_MODEL=... node scripts/publications/extract.mjs [pdf-or-directory ...]

Options:
  --out <dir>       Output directory. Default: ${metadataDir}
  --overwrite       Replace existing metadata files.
  --dry-run         Extract text and validate configuration without calling GPT.

If no PDF paths are supplied, the script recursively scans public/papers.
`;

const parseArgs = (argv) => {
  const options = {
    outDir: metadataDir,
    overwrite: false,
    dryRun: false,
    inputs: []
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      console.log(usage.trim());
      process.exit(0);
    } else if (arg === "--out") {
      options.outDir = argv[index + 1];
      index += 1;
    } else if (arg === "--overwrite") {
      options.overwrite = true;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      options.inputs.push(arg);
    }
  }

  return options;
};

const buildExtractionPrompt = ({ pdfPath, pagesText, extraction }) => `
You are a conservative publication metadata extraction engine for an academic website.

Return one JSON object that exactly matches the supplied JSON Schema. Do not include markdown.

Rules:
- Extract only information that appears in the document text below.
- Use null for absent information. Do not guess.
- Do not infer journal information, DOI, replication materials, datasets, causal identification strategies, or policy implications unless explicitly stated or clearly described in the document.
- Every top-level field must be an object with value, evidence_pages, and confidence.
- evidence_pages must cite the PDF pages where the value appears or where the derived statement is directly supported.
- one_sentence_summary and plain_english_summary may synthesize the document's stated abstract, question, findings, and conclusion, but must not add claims beyond those pages.
- pull_quote must be a short verbatim passage from the document, or null if no suitable passage appears.
- links.value.pdf should be null unless the document itself states a public PDF URL.
- Prefer high confidence only when the cited pages directly support the field.
- If the document is a news clipping, syllabus, CV, or other non-publication artifact, fill publication_type accordingly when stated or use null, and keep unsupported publication fields null.

Source file: ${pdfPath}
Text extraction method: ${extraction}

PDF text with page markers:
${pagesText}
`;

const callOpenAi = async ({ model, prompt }) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "You extract conservative, evidence-cited publication metadata. Return strict JSON only, with null for absent information."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "publication_metadata",
          strict: true,
          schema: publicationMetadataJsonSchema
        }
      }
    })
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(`OpenAI request failed (${response.status}): ${JSON.stringify(body)}`);
  }

  const content = body?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error(`OpenAI response did not include message content: ${JSON.stringify(body)}`);
  }

  return JSON.parse(content);
};

const outputPathFor = (outDir, pdfPath, metadata) => {
  const title = metadata?.title?.value;
  const slug = slugify(title) || slugify(path.basename(pdfPath, path.extname(pdfPath)));
  return path.join(outDir, `${slug}.json`);
};

const publicationPdfUrl = (pdfPath) => {
  const normalized = pdfPath.split(path.sep).join("/");
  if (!normalized.startsWith("public/")) return null;
  return `/${normalized.slice("public/".length)}`;
};

const main = async () => {
  await loadLocalEnv();
  const options = parseArgs(process.argv.slice(2));
  const model = process.env.OPENAI_MODEL;
  const maxChars = Number.parseInt(process.env.PUBLICATION_EXTRACT_MAX_CHARS || "140000", 10);
  const pdfFiles = await findPdfFiles(options.inputs);

  if (pdfFiles.length === 0) {
    throw new Error("No PDF files found.");
  }
  if (!options.dryRun && !process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required unless --dry-run is set.");
  }
  if (!options.dryRun && !model) {
    throw new Error("OPENAI_MODEL is required so the extraction model is explicit.");
  }

  await mkdir(options.outDir, { recursive: true });
  console.log(`Found ${pdfFiles.length} PDF(s).`);

  for (const pdfPath of pdfFiles) {
    console.log(`Extracting text: ${pdfPath}`);
    const textResult = await extractPdfText(pdfPath);
    if (textResult.characterCount === 0) {
      throw new Error(`No text could be extracted from ${pdfPath}. Notes: ${textResult.notes.join("; ")}`);
    }

    const pagesText = pagesToPromptText(textResult.pages).slice(0, maxChars);
    if (options.dryRun) {
      const metadata = emptyPublicationMetadata();
      metadata.links.value.pdf = publicationPdfUrl(pdfPath);
      const result = validatePublicationMetadata(metadata);
      console.log(`${pdfPath}: ${textResult.characterCount} chars via ${textResult.extraction}; schema valid=${result.valid}`);
      continue;
    }

    const prompt = buildExtractionPrompt({
      pdfPath,
      pagesText,
      extraction: textResult.extraction
    });
    const metadata = await callOpenAi({ model, prompt });
    const pdfUrl = publicationPdfUrl(pdfPath);
    if (pdfUrl && metadata.links?.value && metadata.links.value.pdf === null) {
      metadata.links.value.pdf = pdfUrl;
    }

    const validation = validatePublicationMetadata(metadata);
    if (!validation.valid) {
      throw new Error(`Invalid metadata for ${pdfPath}:\n${validation.errors.join("\n")}`);
    }

    const outputPath = outputPathFor(options.outDir, pdfPath, metadata);
    if (!options.overwrite) {
      try {
        await access(outputPath);
        throw new Error(`Refusing to overwrite ${outputPath}. Pass --overwrite to replace it.`);
      } catch (error) {
        if (error.code !== "ENOENT") {
          throw error;
        }
      }
    }

    await writeJson(outputPath, metadata);
    console.log(`Wrote ${outputPath}`);
  }
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
