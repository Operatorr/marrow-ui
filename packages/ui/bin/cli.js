#!/usr/bin/env node

/**
 * Marrow UI CLI
 *
 * Usage:
 *   npx marrow-ui init                  # Scaffold Marrow UI in current project
 *   npx marrow-ui add button            # Add a component
 *   npx marrow-ui add button card tabs  # Add multiple components
 *   npx marrow-ui add --all             # Add all components
 *   npx marrow-ui build                 # Generate theme CSS from config
 *   npx marrow-ui list                  # List all available components
 */

import { parseArgs } from "node:util";
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, copyFileSync } from "node:fs";
import { resolve, join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PKG_ROOT = resolve(__dirname, "..");

// ── Helpers ──────────────────────────────────────────────────────────

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function fileExists(p) {
  return existsSync(p);
}

function copyFile(src, dest) {
  ensureDir(dirname(dest));
  copyFileSync(src, dest);
}

function writeFileSafe(dest, content, overwrite = false) {
  if (!overwrite && fileExists(dest)) {
    console.log(`  Skipped (exists): ${dest}`);
    return false;
  }
  ensureDir(dirname(dest));
  writeFileSync(dest, content, "utf-8");
  return true;
}

// ── Component Registry ───────────────────────────────────────────────

function getAvailableComponents() {
  const templatesDir = join(PKG_ROOT, "templates", "components");
  if (!existsSync(templatesDir)) return [];
  return readdirSync(templatesDir)
    .filter((f) => f.endsWith(".html"))
    .map((f) => f.replace(".html", ""))
    .sort();
}

// ── Commands ─────────────────────────────────────────────────────────

async function cmdInit() {
  const cwd = process.cwd();
  console.log("\n  Initializing Marrow UI...\n");

  // 1. Copy config file
  const configSrc = join(PKG_ROOT, "templates", "marrow.config.js");
  const configDest = join(cwd, "marrow.config.js");
  if (writeFileSafe(configDest, readFileSync(configSrc, "utf-8"))) {
    console.log("  Created: marrow.config.js");
  }

  // 2. Copy base CSS
  const cssSrc = join(PKG_ROOT, "src", "css", "marrow.css");
  const cssDest = join(cwd, "marrow.css");
  if (writeFileSafe(cssDest, readFileSync(cssSrc, "utf-8"))) {
    console.log("  Created: marrow.css");
  }

  // 3. Copy Alpine.js component definitions
  const jsSrc = join(PKG_ROOT, "src", "js", "marrow.js");
  const jsDest = join(cwd, "marrow.js");
  if (writeFileSafe(jsDest, readFileSync(jsSrc, "utf-8"))) {
    console.log("  Created: marrow.js");
  }

  // 4. Generate default theme CSS
  const { generateCSS } = await import("../src/build-theme.js");
  const { createRequire } = await import("node:module");
  const require = createRequire(import.meta.url);
  const config = require(configSrc);
  const themeCSS = generateCSS(config);
  const themeDest = join(cwd, "marrow-theme.css");
  if (writeFileSafe(themeDest, themeCSS)) {
    console.log("  Created: marrow-theme.css");
  }

  console.log(`
  Done! Add these to your HTML <head>:

  <!-- Marrow UI -->
  <link rel="stylesheet" href="./marrow-theme.css">
  <link rel="stylesheet" href="./marrow.css">
  <script src="./marrow.js"></script>

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Alpine.js -->
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

  Then customize marrow.config.js and run:
    npx marrow-ui build

  Add components:
    npx marrow-ui add button card dialog
`);
}

async function cmdAdd(componentNames, options = {}) {
  const cwd = process.cwd();
  const available = getAvailableComponents();

  if (available.length === 0) {
    console.error("  No component templates found in package.");
    process.exit(1);
  }

  let toAdd = componentNames;

  if (options.all) {
    toAdd = available;
  }

  if (!toAdd || toAdd.length === 0) {
    console.error("  Specify component names or use --all:");
    console.error("    npx marrow-ui add button card dialog");
    console.error("    npx marrow-ui add --all");
    process.exit(1);
  }

  const destDir = join(cwd, "components", "ui");
  ensureDir(destDir);

  console.log("\n  Adding components...\n");

  let added = 0;
  for (const name of toAdd) {
    const normalized = name.toLowerCase().trim();
    if (!available.includes(normalized)) {
      console.log(`  Unknown: ${normalized} (skipped)`);
      continue;
    }
    const src = join(PKG_ROOT, "templates", "components", `${normalized}.html`);
    const dest = join(destDir, `${normalized}.html`);
    copyFile(src, dest);
    console.log(`  Added: components/ui/${normalized}.html`);
    added++;
  }

  console.log(`\n  ${added} component(s) added to components/ui/\n`);
}

async function cmdBuild() {
  const { generateCSS } = await import("../src/build-theme.js");
  const cwd = process.cwd();
  const configPath = join(cwd, "marrow.config.js");

  if (!fileExists(configPath)) {
    console.error('  No marrow.config.js found. Run "npx marrow-ui init" first.');
    process.exit(1);
  }

  let config;
  try {
    const { pathToFileURL } = await import("node:url");
    const mod = await import(pathToFileURL(configPath).href);
    config = mod.default || mod;
  } catch {
    const { createRequire } = await import("node:module");
    const require = createRequire(import.meta.url);
    config = require(configPath);
  }

  const css = generateCSS(config);
  const outputPath = join(cwd, "marrow-theme.css");
  writeFileSync(outputPath, css, "utf-8");
  console.log(`\n  Generated theme CSS → marrow-theme.css\n`);
}

function cmdList() {
  const components = getAvailableComponents();
  console.log(`\n  Marrow UI Components (${components.length}):\n`);
  const cols = 3;
  const colWidth = 22;
  for (let i = 0; i < components.length; i += cols) {
    const row = components.slice(i, i + cols).map((c) => c.padEnd(colWidth)).join("");
    console.log(`  ${row}`);
  }
  console.log("");
}

function cmdHelp() {
  console.log(`
  Marrow UI – A sleek UI kit built with Tailwind CSS and Alpine.js

  Usage:
    npx marrow-ui <command> [options]

  Commands:
    init                     Initialize Marrow UI in the current project
    add <components...>      Add component(s) to your project
    add --all                Add all components
    build                    Generate theme CSS from marrow.config.js
    list                     List all available components
    help                     Show this help message

  Examples:
    npx marrow-ui init
    npx marrow-ui add button card dialog tabs
    npx marrow-ui add --all
    npx marrow-ui build
    npx marrow-ui list
`);
}

// ── Main ─────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const rest = args.slice(1);

  switch (command) {
    case "init":
      await cmdInit();
      break;
    case "add": {
      const hasAll = rest.includes("--all");
      const names = rest.filter((a) => !a.startsWith("--"));
      await cmdAdd(names, { all: hasAll });
      break;
    }
    case "build":
      await cmdBuild();
      break;
    case "list":
      cmdList();
      break;
    case "help":
    case "--help":
    case "-h":
      cmdHelp();
      break;
    default:
      if (!command) {
        cmdHelp();
      } else {
        console.error(`  Unknown command: ${command}`);
        cmdHelp();
        process.exit(1);
      }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
