import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { galleryPhotos } from "../src/data/about-gallery.ts";
import { doctoralStudents, undergraduateHonorsTheses } from "../src/data/doctoralStudents.ts";
import { events, eventPhotos } from "../src/data/talks.ts";

const root = new URL("../", import.meta.url);
const figures = JSON.parse(await readFile(new URL("src/data/publication-figures.json", root), "utf8"));
const students = [...doctoralStudents, ...undergraduateHonorsTheses];
const portraits = new Map(students.filter((student) => student.photo_url).map((student) => [student.photo_url, student]));
const sources = new Set([
  ...galleryPhotos.map((photo) => photo.src),
  ...Object.values(eventPhotos).map((photo) => photo.src),
  ...Object.values(figures).map((figure) => figure.src),
  ...students.flatMap((student) => [student.image_url, student.photo_url]),
  ...events.map((event) => new URL(event.watch).searchParams.get("v"))
    .filter((id) => !eventPhotos[id]).map((id) => `/images/recordings/${id}.jpg`),
  "/images/andrew-reeves-portrait-editorial.jpg",
  "/images/andrew-fed-page.jpg",
  "/images/andrew-harvard-page.jpg",
  "/images/andrew-teaching-page.jpg",
  "/images/editorial/andrew-reeves-portrait.jpg",
  "/images/editorial/harvard-panel.jpg",
  "/images/editorial/classroom.jpg",
  "/images/editorial/adriana-kugler-conversation.jpg",
  "/images/citizenship-course.jpg",
  "/images/intro-course.jpg",
  "/images/business-of-elections-course.jpg",
  "/images/federal-resource-allocation-map-1200.jpg"
].filter((src) => src?.startsWith("/images/")));

const manifest = {};
let generated = 0;
for (const src of [...sources].sort()) {
  const input = await readFile(new URL(`public${src}`, root));
  const metadata = await sharp(input).metadata();
  const { width, height } = metadata.autoOrient ?? metadata;
  if (!width || !height) throw new Error(`Missing image dimensions: ${src}`);
  const portrait = portraits.get(src);
  let crop;
  if (portrait) {
    const zoom = portrait.photo_zoom ?? 1;
    if (!Number.isFinite(zoom) || zoom < 1) {
      throw new Error(`Invalid portrait zoom: ${src}`);
    }
    const [x, y] = (portrait.photo_position ?? "50% 35%").split(/\s+/).map(parseFloat);
    if (![x, y].every((value) => Number.isFinite(value) && value >= 0 && value <= 100)) {
      throw new Error(`Invalid portrait crop position: ${src}`);
    }
    const cropWidth = Math.floor(Math.min(width, height * 4 / 5) / zoom);
    const cropHeight = Math.floor(cropWidth * 5 / 4);
    if (cropWidth < 1 || cropHeight < 1) throw new Error(`Portrait crop is too small: ${src}`);
    crop = { left: Math.round((width - cropWidth) * x / 100), top: Math.round((height - cropHeight) * y / 100), width: cropWidth, height: cropHeight };
  }
  // Crop portrait derivatives before resizing so landscape originals stay sharp
  // in the 4:5 thumbnail. Per-person zoom and position keep heads consistently
  // framed; source photographs are retained without this crop.
  const outputWidth = crop?.width ?? width;
  const outputHeight = crop?.height ?? height;
  const sizes = portrait ? [64, 88, 128, 176, 264] : [320, 640, 960, 1440];
  const widths = [...new Set(sizes.map((size) => Math.min(size, outputWidth)))];
  // Content-addressed names also invalidate immutable CDN/browser caches.
  const recipe = crop ? `webp-q80-portrait-v1-${JSON.stringify(crop)}` : "webp-q80-v1";
  const hash = createHash("sha256").update(input).update(recipe).digest("hex").slice(0, 12);
  const stem = src.slice("/images/".length).replace(/\.[^.]+$/, "");
  const variants = [];
  for (const size of widths) {
    const url = `/images/optimized/${stem}-${size}-${hash}.webp`;
    const output = new URL(`public${url}`, root);
    const outputPath = fileURLToPath(output);
    await mkdir(path.dirname(outputPath), { recursive: true });
    const exists = await access(output).then(() => true, () => false);
    if (!exists) {
      const pipeline = sharp(input).autoOrient();
      if (crop) pipeline.extract(crop);
      await pipeline.resize({ width: size, withoutEnlargement: true }).webp({ quality: 80 }).toFile(outputPath);
      generated++;
    }
    variants.push({ src: url, width: size });
  }
  manifest[src] = {
    src: variants.find((variant) => variant.width >= 640)?.src ?? variants.at(-1).src,
    srcset: variants.map((variant) => `${variant.src} ${variant.width}w`).join(", "),
    width: outputWidth,
    height: outputHeight
  };
}
const destination = new URL("src/data/responsive-images.json", root);
const json = JSON.stringify(manifest, null, 2) + "\n";
if (await readFile(destination, "utf8").catch(() => "") !== json) await writeFile(destination, json);
console.log(`Responsive images: ${sources.size} sources; ${generated} new WebP variants.`);
