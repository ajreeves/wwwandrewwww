import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const run = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { ...options, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`${command} ${args.join(" ")} failed with exit code ${code}: ${stderr}`));
      }
    });
  });

const splitPages = (text) =>
  text
    .split("\f")
    .map((pageText, index) => ({
      page: index + 1,
      text: pageText.replace(/\s+\n/g, "\n").trim()
    }))
    .filter((page) => page.text.length > 0);

const textLength = (pages) => pages.reduce((total, page) => total + page.text.length, 0);

const extractWithPdftotext = async (pdfPath) => {
  const { stdout } = await run("pdftotext", ["-layout", "-enc", "UTF-8", pdfPath, "-"]);
  return splitPages(stdout);
};

const extractWithOcr = async (pdfPath) => {
    const tempDirectory = await mkdtemp(path.join(tmpdir(), "publication-ocr-"));
  try {
    const prefix = path.join(tempDirectory, "page");
    await run("pdftoppm", ["-png", "-r", "200", pdfPath, prefix]);
    const imagePaths = (await readdir(tempDirectory))
      .filter((fileName) => fileName.endsWith(".png"))
      .map((fileName) => path.join(tempDirectory, fileName))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const pages = [];
    for (let index = 0; index < imagePaths.length; index += 1) {
      const result = await run("tesseract", [imagePaths[index], "stdout"]);
      pages.push({
        page: index + 1,
        text: result.stdout.trim()
      });
    }
    return pages.filter((page) => page.text.length > 0);
  } finally {
    await rm(tempDirectory, { recursive: true, force: true });
  }
};

export const extractPdfText = async (pdfPath, { minCharacters = 1200 } = {}) => {
  let pages = [];
  let extraction = "pdftotext";
  const notes = [];

  try {
    pages = await extractWithPdftotext(pdfPath);
  } catch (error) {
    notes.push(`pdftotext failed: ${error.message}`);
  }

  if (textLength(pages) < minCharacters) {
    extraction = "ocr";
    try {
      pages = await extractWithOcr(pdfPath);
    } catch (error) {
      notes.push(`ocr failed: ${error.message}`);
    }
  }

  return {
    pages,
    extraction,
    notes,
    characterCount: textLength(pages)
  };
};

export const pagesToPromptText = (pages) =>
  pages.map((page) => `[[PAGE ${page.page}]]\n${page.text}`).join("\n\n");
