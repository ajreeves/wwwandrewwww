#!/usr/bin/env node
import { findMetadataFiles, readJson } from "./io.mjs";
import { validatePublicationMetadata } from "./schema.mjs";

const main = async () => {
  const files = await findMetadataFiles();
  if (files.length === 0) {
    console.log("No metadata files found.");
    return;
  }

  let failed = 0;
  for (const file of files) {
    const metadata = await readJson(file);
    const result = validatePublicationMetadata(metadata);
    if (result.valid) {
      console.log(`ok ${file}`);
    } else {
      failed += 1;
      console.error(`invalid ${file}`);
      for (const error of result.errors) console.error(`  - ${error}`);
    }
  }

  if (failed > 0) {
    throw new Error(`${failed} metadata file(s) failed validation.`);
  }
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
