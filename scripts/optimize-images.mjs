import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { galleryPhotos } from "../src/data/about-gallery.ts";
import { doctoralStudents, undergraduateHonorsTheses } from "../src/data/doctoralStudents.ts";

const root = new URL("../", import.meta.url);
const figures = JSON.parse(await readFile(new URL("src/data/publication-figures.json", root), "utf8"));
const sources = new Set([
  ...galleryPhotos.map((photo) => photo.src),
  ...Object.values(figures).map((figure) => figure.src),
  ...[...doctoralStudents, ...undergraduateHonorsTheses].flatMap((student) => [student.image_url, student.photo_url]),
  "/images/andrew-reeves-portrait-editorial.jpg",
  "/images/andrew-fed-page.jpg",
  "/images/andrew-teaching-page.jpg",
  "/images/federal-resource-allocation-map-1200.jpg"
].filter((src) => src?.startsWith("/images/")));

const manifest = {};
let generated = 0;
for (const src of [...sources].sort()) {
  const input = await readFile(new URL(`public${src}`, root));
  const metadata = await sharp(input).metadata();
  const { width, height } = metadata.autoOrient ?? metadata;
  if (!width || !height) throw new Error(`Missing image dimensions: ${src}`);
  const widths = [...new Set([320, 640, 960, 1440].map((size) => Math.min(size, width)))];
  // Content-addressed names also invalidate immutable CDN/browser caches.
  const hash = createHash("sha256").update(input).update("webp-q80-v1").digest("hex").slice(0, 12);
  const stem = src.slice("/images/".length).replace(/\.[^.]+$/, "");
  const variants = [];
  for (const size of widths) {
    const url = `/images/optimized/${stem}-${size}-${hash}.webp`;
    const output = new URL(`public${url}`, root);
    const outputPath = fileURLToPath(output);
    await mkdir(path.dirname(outputPath), { recursive: true });
    const exists = await access(output).then(() => true, () => false);
    if (!exists) {
      await sharp(input).autoOrient().resize({ width: size, withoutEnlargement: true }).webp({ quality: 80 }).toFile(outputPath);
      generated++;
    }
    variants.push({ src: url, width: size });
  }
  manifest[src] = {
    src: variants.find((variant) => variant.width >= 640)?.src ?? variants.at(-1).src,
    srcset: variants.map((variant) => `${variant.src} ${variant.width}w`).join(", "),
    width,
    height
  };
}
const destination = new URL("src/data/responsive-images.json", root);
const json = JSON.stringify(manifest, null, 2) + "\n";
if (await readFile(destination, "utf8").catch(() => "") !== json) await writeFile(destination, json);
console.log(`Responsive images: ${sources.size} sources; ${generated} new WebP variants.`);
