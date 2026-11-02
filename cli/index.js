#!/usr/bin/env node

import fs from "node:fs/promises";
import { collectNpmNames, validatePackage } from "../src/index.js";

const packageJson = JSON.parse(
  await fs.readFile(new URL("../package.json", import.meta.url), "utf8")
);
const VERSION = packageJson.version;

function help() {
  console.log(`npm-repo-resolver-names v${VERSION}

Recursively walk npm dependencies and output pure array of package names.

Usage:
  npx npm-repo-resolver-names <package-name> [flags]

Flags:
  --guard       Validate package spec only (YES/NO)
  --count       Output only total package count
  --one-line    Output names space-separated on one line
  --lines       Output one package name per line
  -v, --version Show version
  -h, --help    Show help

Examples:
  npx npm-repo-resolver-names express
  npx npm-repo-resolver-names json-renderers-build-table
  npx npm-repo-resolver-names react --lines
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

  if (flags.includes("--guard")) {
    try {
      const target = validatePackage(packageSpec);
      console.log(`Valid: YES`);
      console.log(`Package: ${target.name}`);
      console.log(`Version: ${target.version || "latest"}`);
      console.log(`Scope: ${target.scope || "none"}`);
    } catch (err) {
      console.log(`Valid: NO`);
      console.error(`Error: ${err.message}`);
      process.exitCode = 1;
    }
    return;
  }

  const isCount = flags.includes("--count");
  const isOneLine = flags.includes("--one-line");
  const isLines = flags.includes("--lines");

  if (!isCount) {
    console.error(`\n🔍 Collecting recursive npm package names for "${packageSpec}"...`);
  }

  const names = await collectNpmNames(packageSpec);

  if (isCount) {
    console.log(names.length);
    return;
  }

  if (isOneLine) {
    console.log(names.join(" "));
    return;
  }

  if (isLines) {
    console.log(names.join("\n"));
    return;
  }

  // Default: JSON array of strings
  console.error(`📦 Discovered ${names.length} npm dependency packages:\n`);
  console.log(JSON.stringify(names, null, 2));
}

main().catch((err) => {
  console.error(`\nnpm-repo-resolver-names error: ${err.message}\n`);
  process.exitCode = 1;
});
