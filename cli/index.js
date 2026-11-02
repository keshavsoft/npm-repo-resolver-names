#!/usr/bin/env node

import fs from "node:fs/promises";
import { collectNpmNames } from "../src/index.js";

const packageJson = JSON.parse(
  await fs.readFile(new URL("../package.json", import.meta.url), "utf8")
);
const VERSION = packageJson.version;

function help() {
  console.log(`npm-repo-resolver-names v${VERSION}

Recursively walk npm dependencies and output pure array of package names.

Usage:
  npx npm-repo-resolver-names <package-name>

Examples:
  npx npm-repo-resolver-names express
  npx npm-repo-resolver-names json-renderers-build-table
`);
}

async function main() {
  const rawArgs = process.argv.slice(2);
  const flags = rawArgs.filter((arg) => arg.startsWith("-"));
  const positional = rawArgs.filter((arg) => !arg.startsWith("-"));

  if (flags.includes("--version") || flags.includes("-v")) {
    console.log(VERSION);
    return;
  }

  if (flags.includes("--help") || flags.includes("-h") || positional.length === 0) {
    help();
    return;
  }

  const packageSpec = positional[0];
  console.error(`\n🔍 Collecting recursive npm package names for "${packageSpec}"...`);

  const names = await collectNpmNames(packageSpec);

  console.error(`📦 Discovered ${names.length} npm dependency packages:\n`);
  console.log(JSON.stringify(names, null, 2));
}

main().catch((err) => {
  console.error(`\nnpm-repo-resolver-names error: ${err.message}\n`);
  process.exitCode = 1;
});
