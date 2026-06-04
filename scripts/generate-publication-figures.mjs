import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const publicationDir = path.join(root, "src/content/publications");
const metadataIndex = JSON.parse(readFileSync(path.join(root, "src/data/publications/presentation/index.json"), "utf8"));
const outputDir = path.join(root, "public/images/publication-figures");
const manifestPath = path.join(root, "src/data/publication-figures.json");

mkdirSync(outputDir, { recursive: true });

const metadataAliases = {
  "all-presidents-senators": "all-the-president-s-senators-presidential-copartisans-and-the-allocation-of-federal-grants",
  "disunion-review": "the-state-of-disunion-regional-sources-of-modern-american-partisanship",
  "municipal-administration": "elections-and-representation-in-american-municipal-administration"
};

const normalize = (value = "") =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const titleCaseType = (value = "Publication") =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const parseFrontmatter = (file) => {
  const text = readFileSync(file, "utf8");
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  const frontmatter = match?.[1] ?? "";
  const title = frontmatter.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1] ?? "";
  const type = frontmatter.match(/^type:\s*["']?(.+?)["']?\s*$/m)?.[1] ?? "Publication";
  const linkUrls = Array.from(frontmatter.matchAll(/url:\s*["'](.+?)["']/g)).map((item) => item[1]);
  return { title, type, linkUrls };
};

const basename = (value) => {
  try {
    return new URL(value, "https://andrewreeves.org").pathname.split("/").pop()?.toLowerCase() ?? "";
  } catch {
    return value.split("/").pop()?.toLowerCase() ?? "";
  }
};

const localPdfPath = (url) => {
  const file = basename(url);
  if (!file.endsWith(".pdf")) return null;
  const local = path.join(root, "public/papers", file);
  return existsSync(local) ? local : null;
};

const metadataFor = (slug, title) =>
  metadataIndex.find((item) => {
    const aliasMatches = metadataAliases[slug] === item.slug;
    const titleMatches = normalize(item.title) === normalize(title);
    return aliasMatches || titleMatches;
  });

const pdfPageCount = (pdf) => {
  try {
    const info = execFileSync("pdfinfo", [pdf], { encoding: "utf8" });
    return Number(info.match(/^Pages:\s+(\d+)/m)?.[1] ?? 1);
  } catch {
    return 1;
  }
};

const textPages = (pdf) => {
  try {
    return execFileSync("pdftotext", ["-layout", pdf, "-"], {
      encoding: "utf8",
      maxBuffer: 80 * 1024 * 1024
    }).split("\f");
  } catch {
    return [];
  }
};

const imageScores = (pdf) => {
  const scores = new Map();
  try {
    const list = execFileSync("pdfimages", ["-list", pdf], { encoding: "utf8" });
    for (const line of list.split("\n")) {
      const parts = line.trim().split(/\s+/);
      if (!/^\d+$/.test(parts[0])) continue;
      const page = Number(parts[0]);
      const width = Number(parts[3] ?? 0);
      const height = Number(parts[4] ?? 0);
      const area = width * height;
      scores.set(page, (scores.get(page) ?? 0) + 5 + Math.min(area / 120000, 18));
    }
  } catch {
    // Vector figures often do not appear in pdfimages output; text scoring handles those.
  }
  return scores;
};

const hasVisualMarkerText = (lineText) => {
  const compact = lineText.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return /^(SI)?(FIGURE|FIG|TABLE|TAB)\d+/.test(compact);
};

const visualMarkerKind = (lineText) => {
  const compact = lineText.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (/^(SI)?(FIGURE|FIG)\d+/.test(compact)) return "figure";
  if (/^(SI)?(TABLE|TAB)\d+/.test(compact)) return "table";
  return null;
};

const visualMarkerScore = (pdf, page) => {
  const { words } = pageWords(pdf, page);
  const lines = pageLines(words);
  const markerLine = lines.find((line) => hasVisualMarkerText(line.text));
  if (!markerLine) return 0;

  // Prefer captions that begin near the visual/table body, rather than a table of contents.
  const text = markerLine.text.toLowerCase();
  if (text.includes("contents") || text.includes("list of")) return 0;
  return 42;
};

const scorePage = (text, page, imageScore, markerScore = 0) => {
  const lower = text.toLowerCase();
  let score = (imageScore.get(page) ?? 0) + markerScore;
  if (markerScore > 0) score += 10;
  if (/\b(fig\.|figure)\s*\d+/i.test(text)) score += markerScore > 0 ? 8 : 2;
  if (/\bmap(s)?\b|county|counties|geograph|spatial|place\b/i.test(text)) score += 8;
  if (/\btable\s*\d+/i.test(text)) score += markerScore > 0 ? 9 : 2;
  if (/\bgraph|plot|coefficient|estimate|distribution|trend\b/i.test(text)) score += 6;
  if (/^\s*(figure|fig\.|table|tab\.)\s*\d+/im.test(text)) score += 18;
  if (lower.includes("references") || lower.includes("bibliography")) score -= 14;
  if (lower.includes("table of contents")) score -= 28;
  if (page === 1) score -= 4;
  return score;
};

const selectPage = (pdf) => {
  const total = pdfPageCount(pdf);
  const pages = textPages(pdf);
  const images = imageScores(pdf);
  let best = { page: 1, score: 0 };
  for (let page = 1; page <= total; page += 1) {
    const markerScore = visualMarkerScore(pdf, page);
    const score = scorePage(pages[page - 1] ?? "", page, images, markerScore);
    if (score > best.score) best = { page, score };
  }
  return best.score >= 10 ? { ...best, fallback: false } : { page: 1, score: best.score, fallback: true };
};

const pageWords = (pdf, page) => {
  try {
    const html = execFileSync("pdftotext", ["-bbox", "-f", String(page), "-l", String(page), pdf, "-"], {
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024
    });
    const pageMatch = html.match(/<page width="([^"]+)" height="([^"]+)">/);
    const geometry = {
      width: Number(pageMatch?.[1] ?? 612),
      height: Number(pageMatch?.[2] ?? 792)
    };
    const words = Array.from(
      html.matchAll(/<word xMin="([^"]+)" yMin="([^"]+)" xMax="([^"]+)" yMax="([^"]+)">([^<]+)<\/word>/g)
    ).map((match) => ({
      x: Number(match[1]),
      y: Number(match[2]),
      x2: Number(match[3]),
      y2: Number(match[4]),
      text: match[5]
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
    }));
    return { geometry, words };
  } catch {
    return { geometry: { width: 612, height: 792 }, words: [] };
  }
};

const pageLines = (words) => {
  const sorted = [...words].sort((a, b) => a.y - b.y || a.x - b.x);
  const lines = [];
  for (const word of sorted) {
    let line = lines.find((candidate) => Math.abs(candidate.y - word.y) < 3);
    if (!line) {
      line = { y: word.y, y2: word.y2, words: [] };
      lines.push(line);
    }
    line.words.push(word);
    line.y = Math.min(line.y, word.y);
    line.y2 = Math.max(line.y2, word.y2);
  }
  return lines.map((line) => {
    const words = line.words.sort((a, b) => a.x - b.x);
    return {
      ...line,
      x: Math.min(...words.map((word) => word.x)),
      x2: Math.max(...words.map((word) => word.x2)),
      text: words.map((word) => word.text).join(" ")
    };
  });
};

const findVisualBlock = (pdf, page) => {
  const { geometry, words } = pageWords(pdf, page);
  const lines = pageLines(words);
  const markerIndex = lines.findIndex((line) => hasVisualMarkerText(line.text));
  if (markerIndex === -1) return null;

  const marker = lines[markerIndex];
  const kind = visualMarkerKind(marker.text);

  if (kind === "figure") {
    let captionEndIndex = Math.min(lines.length - 1, markerIndex + 3);
    for (let index = markerIndex; index < Math.min(lines.length, markerIndex + 5); index += 1) {
      if (/[.!?]\s*$/.test(lines[index].text.trim())) {
        captionEndIndex = index;
        break;
      }
    }

    let startY = Math.max(geometry.height * 0.1, marker.y - geometry.height * 0.46);
    for (let index = markerIndex - 1; index > 0; index -= 1) {
      const previous = lines[index - 1];
      const current = lines[index];
      const gap = current.y - previous.y2;
      const distanceFromMarker = marker.y - current.y;
      if (gap > 28 && distanceFromMarker > 80) {
        startY = Math.max(geometry.height * 0.1, current.y - 12);
        break;
      }
    }

    return {
      geometry,
      box: {
        x: Math.max(0, 42),
        y: startY,
        x2: Math.min(geometry.width, geometry.width - 42),
        y2: Math.min(geometry.height, lines[captionEndIndex].y2 + 10)
      }
    };
  }

  let startY = Math.max(0, marker.y - 8);
  let endY = Math.min(geometry.height, marker.y + geometry.height * 0.62);

  for (let index = markerIndex + 1; index < lines.length; index += 1) {
    const previous = lines[index - 1];
    const current = lines[index];
    const gap = current.y - previous.y2;
    if (gap > 22 && previous.y2 - startY > 80) {
      endY = Math.min(geometry.height, previous.y2 + 8);
      break;
    }
  }

  if (endY - startY < 110) {
    endY = Math.min(geometry.height, startY + geometry.height * 0.5);
  }

  return {
    geometry,
    box: {
      x: Math.max(0, 42),
      y: startY,
      x2: Math.min(geometry.width, geometry.width - 42),
      y2: endY
    }
  };
};

const cropToDarkPixels = async (imageFile, pdf, page, fallback) => {
  if (fallback) return false;
  const block = findVisualBlock(pdf, page);
  if (!block) return false;

  const image = sharp(imageFile);
  const metadata = await image.metadata();
  const scaleX = metadata.width / block.geometry.width;
  const scaleY = metadata.height / block.geometry.height;
  const rough = {
    left: Math.max(0, Math.floor(block.box.x * scaleX)),
    top: Math.max(0, Math.floor(block.box.y * scaleY)),
    width: Math.min(metadata.width, Math.ceil((block.box.x2 - block.box.x) * scaleX)),
    height: Math.min(metadata.height, Math.ceil((block.box.y2 - block.box.y) * scaleY))
  };
  rough.width = Math.min(rough.width, metadata.width - rough.left);
  rough.height = Math.min(rough.height, metadata.height - rough.top);
  if (rough.width < 80 || rough.height < 80) return false;

  const { data, info } = await sharp(imageFile)
    .extract(rough)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let minX = info.width;
  let minY = info.height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const index = (y * info.width + x) * info.channels;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      if (r < 245 || g < 245 || b < 245) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX <= minX || maxY <= minY) return false;
  const padding = 18;
  const finalCrop = {
    left: Math.max(0, rough.left + minX - padding),
    top: Math.max(0, rough.top + minY - padding),
    width: Math.min(metadata.width, maxX - minX + padding * 2),
    height: Math.min(metadata.height, maxY - minY + padding * 2)
  };
  finalCrop.width = Math.min(finalCrop.width, metadata.width - finalCrop.left);
  finalCrop.height = Math.min(finalCrop.height, metadata.height - finalCrop.top);
  if (finalCrop.width < 120 || finalCrop.height < 120) return false;

  const tempFile = `${imageFile}.tmp.jpg`;
  await sharp(imageFile).extract(finalCrop).jpeg({ quality: 84 }).toFile(tempFile);
  execFileSync("mv", [tempFile, imageFile]);
  return true;
};

const renderPage = (pdf, slug, page) => {
  const outputBase = path.join(outputDir, slug);
  const outputFile = `${outputBase}.jpg`;
  execFileSync("pdftoppm", [
    "-jpeg",
    "-jpegopt",
    "quality=82",
    "-r",
    "118",
    "-f",
    String(page),
    "-singlefile",
    pdf,
    outputBase
  ]);
  return outputFile;
};

const main = async () => {
  const manifest = {};
  const files = readdirSync(publicationDir).filter((file) => file.endsWith(".mdx")).sort();

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const frontmatter = parseFrontmatter(path.join(publicationDir, file));
    const metadata = metadataFor(slug, frontmatter.title);
    const candidates = [
      ...frontmatter.linkUrls.map(localPdfPath),
      metadata?.links?.pdf ? path.join(root, "public", metadata.links.pdf.replace(/^\//, "")) : null
    ].filter(Boolean);
    const pdf = candidates.find((candidate, index, array) => existsSync(candidate) && array.indexOf(candidate) === index);
    if (!pdf) continue;

    try {
      const selected = selectPage(pdf);
      const imageFile = renderPage(pdf, slug, selected.page);
      const cropped = await cropToDarkPixels(imageFile, pdf, selected.page, selected.fallback);
      manifest[slug] = {
        src: `/images/publication-figures/${slug}.jpg`,
        alt: selected.fallback
          ? `First page preview of ${frontmatter.title}`
          : `Featured visual from ${frontmatter.title}`,
        caption: selected.fallback ? `${titleCaseType(frontmatter.type)} preview` : "Featured visual from the publication",
        source_pdf: `/papers/${path.basename(pdf)}`,
        selected_page: selected.page,
        cropped,
        fallback: selected.fallback
      };
      console.log(`${slug}: page ${selected.page}${selected.fallback ? " fallback" : ""}${cropped ? " cropped" : ""}`);
    } catch (error) {
      console.warn(`${slug}: skipped (${error.message})`);
    }
  }

  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Wrote ${Object.keys(manifest).length} publication images`);
};

await main();
