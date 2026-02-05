#!/usr/bin/env node

/**
 * Marrow UI – Theme CSS Generator
 *
 * Reads marrow.config.js from the current working directory
 * and generates marrow-theme.css with CSS custom properties.
 *
 * Usage:
 *   node build-theme.js                          # outputs to ./marrow-theme.css
 *   node build-theme.js --config ./my.config.js  # custom config path
 *   node build-theme.js --output ./src/theme.css # custom output path
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

// ── Config Maps ──────────────────────────────────────────────────────

const RADIUS_MAP = {
  none: "0px",
  sm: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  full: "9999px",
};

const COMPACTNESS_MAP = {
  minimal:  { text: "0.75rem",  textLabel: "0.625rem", space: "0.7",  btnPy: "0.25rem", btnPx: "0.5rem",   inputPy: "0.25rem", inputPx: "0.5rem",   cardP: "0.75rem" },
  compact:  { text: "0.875rem", textLabel: "0.75rem",  space: "0.85", btnPy: "0.375rem",btnPx: "0.75rem",  inputPy: "0.375rem",inputPx: "0.75rem",  cardP: "1rem" },
  normal:   { text: "1rem",     textLabel: "0.875rem", space: "1",    btnPy: "0.5rem",  btnPx: "1rem",     inputPy: "0.5rem",  inputPx: "0.75rem",  cardP: "1.5rem" },
  relaxed:  { text: "1.125rem", textLabel: "1rem",     space: "1.2",  btnPy: "0.625rem",btnPx: "1.25rem",  inputPy: "0.625rem",inputPx: "1rem",     cardP: "2rem" },
  spacious: { text: "1.25rem",  textLabel: "1.125rem", space: "1.5",  btnPy: "0.75rem", btnPx: "1.5rem",   inputPy: "0.75rem", inputPx: "1.25rem",  cardP: "2.5rem" },
};

const DURATION_MAP = {
  none: "0ms",
  fast: "100ms",
  base: "150ms",
  slow: "300ms",
  lazy: "500ms",
};

const SHADOW_MAP = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
};

// ── Generators ───────────────────────────────────────────────────────

function buildCSSVariables(colorSet) {
  const lines = [];
  for (const [key, val] of Object.entries(colorSet)) {
    const cssName = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    lines.push(`  --marrow-${cssName}: ${val};`);
  }
  return lines.join("\n");
}

export function generateCSS(config) {
  const c = config;
  const radius = RADIUS_MAP[c.radius] || c.radius;
  const comp = COMPACTNESS_MAP[c.compactness] || COMPACTNESS_MAP.normal;
  const duration = DURATION_MAP[c.transitionDuration] || c.transitionDuration;
  const shadow = SHADOW_MAP[c.shadow] || c.shadow;

  return `/* Marrow UI – Generated Theme CSS */
/* Do not edit directly. Modify marrow.config.js and rebuild. */

:root {
${buildCSSVariables(c.colors.light)}
  --marrow-radius: ${radius};
  --marrow-text: ${comp.text};
  --marrow-text-label: ${comp.textLabel};
  --marrow-space-unit: ${comp.space};
  --marrow-btn-py: ${comp.btnPy};
  --marrow-btn-px: ${comp.btnPx};
  --marrow-input-py: ${comp.inputPy};
  --marrow-input-px: ${comp.inputPx};
  --marrow-card-p: ${comp.cardP};
  --marrow-duration: ${duration};
  --marrow-shadow: ${shadow};
  --marrow-font-heading: "${c.fonts.heading}", ui-sans-serif, system-ui, sans-serif;
  --marrow-font-body: "${c.fonts.body}", ui-sans-serif, system-ui, sans-serif;
}

.dark {
${buildCSSVariables(c.colors.dark)}
}
`;
}

// ── CLI entry ────────────────────────────────────────────────────────

async function main() {
  const { values } = parseArgs({
    options: {
      config: { type: "string", short: "c", default: "./marrow.config.js" },
      output: { type: "string", short: "o", default: "./marrow-theme.css" },
    },
    strict: false,
  });

  const configPath = resolve(process.cwd(), values.config);
  const outputPath = resolve(process.cwd(), values.output);

  if (!existsSync(configPath)) {
    console.error(`Config not found: ${configPath}`);
    console.error('Run "npx marrow-ui init" to create one.');
    process.exit(1);
  }

  // Dynamic import for both ESM and CJS configs
  let config;
  try {
    const mod = await import(pathToFileURL(configPath).href);
    config = mod.default || mod;
  } catch {
    // Fallback for CJS
    const { createRequire } = await import("node:module");
    const require = createRequire(import.meta.url);
    config = require(configPath);
  }

  const css = generateCSS(config);

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, css, "utf-8");
  console.log(`Generated theme CSS → ${outputPath}`);
}

// Run if executed directly
const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname);
if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
