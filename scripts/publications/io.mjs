import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

export const metadataDir = "src/data/publications/metadata";
export const presentationDir = "src/data/publications/presentation";
export const embeddingsDir = "src/data/publications/embeddings";
export const clustersDir = "src/data/publications/clusters";

export const readJson = async (filePath) => JSON.parse(await readFile(filePath, "utf8"));

export const writeJson = async (filePath, value) => {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
};

export const listFilesRecursive = async (directory, predicate = () => true) => {
  const files = [];

  const visit = async (currentDirectory) => {
    let entries = [];
    try {
      entries = await readdir(currentDirectory, { withFileTypes: true });
    } catch (error) {
      if (error.code === "ENOENT") return;
      throw error;
    }

    for (const entry of entries) {
      const entryPath = path.join(currentDirectory, entry.name);
      if (entry.isDirectory()) {
        await visit(entryPath);
      } else if (entry.isFile() && predicate(entryPath)) {
        files.push(entryPath);
      }
    }
  };

  await visit(directory);
  return files.sort((a, b) => a.localeCompare(b));
};

export const findPdfFiles = async (inputs) => {
  if (inputs.length > 0) {
    const expanded = [];
    for (const input of inputs) {
      const inputStat = await stat(input);
      if (inputStat.isDirectory()) {
        expanded.push(...(await listFilesRecursive(input, (filePath) => filePath.toLowerCase().endsWith(".pdf"))));
      } else if (input.toLowerCase().endsWith(".pdf")) {
        expanded.push(input);
      }
    }
    return [...new Set(expanded)].sort((a, b) => a.localeCompare(b));
  }

  return listFilesRecursive("public/papers", (filePath) => filePath.toLowerCase().endsWith(".pdf"));
};

export const findMetadataFiles = async () => listFilesRecursive(metadataDir, (filePath) => filePath.endsWith(".json"));
