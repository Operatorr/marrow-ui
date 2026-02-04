#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const config = require("./marrow.config.js");

const SRC = path.join(__dirname, "src");
const DIST = path.join(__dirname, "dist");

// ── Helpers ───────────────────────────────────────────────────────────

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readFile(p) {
  return fs.readFileSync(p, "utf-8");
}

function writeFile(p, content) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, content, "utf-8");
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

// ── Config → CSS Custom Properties ───────────────────────────────────

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

function buildCSSVariables(colorSet) {
  const lines = [];
  for (const [key, val] of Object.entries(colorSet)) {
    const cssName = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    lines.push(`  --marrow-${cssName}: ${val};`);
  }
  return lines.join("\n");
}

function generateCSS() {
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

// ── Page Build ────────────────────────────────────────────────────────

function parseFrontMatter(content) {
  const meta = {};
  const lines = content.split("\n");
  const body = [];
  let inFront = false;
  for (const line of lines) {
    if (line.trim() === "---" && !inFront) { inFront = true; continue; }
    if (line.trim() === "---" && inFront) { inFront = false; continue; }
    if (inFront) {
      const m = line.match(/^(\w+):\s*(.+)$/);
      if (m) meta[m[1].trim()] = m[2].trim();
    } else {
      body.push(line);
    }
  }
  return { meta, body: body.join("\n") };
}

function buildPage(pagePath) {
  const raw = readFile(pagePath);
  const { meta, body } = parseFrontMatter(raw);
  const layoutName = meta.layout || "base";
  const layoutPath = path.join(SRC, "layouts", `${layoutName}.html`);
  let layout = readFile(layoutPath);

  // Replace slots
  layout = layout.replace(/\{\{slot\}\}/g, body);
  layout = layout.replace(/\{\{title\}\}/g, meta.title || "Marrow UI");
  layout = layout.replace(/\{\{description\}\}/g, meta.description || "A sleek UI kit built with Tailwind CSS and Alpine.js");
  layout = layout.replace(/\{\{activeSection\}\}/g, meta.section || "");
  layout = layout.replace(/\{\{activeComponent\}\}/g, meta.component || "");

  return layout;
}

function walkPages(dir, base) {
  base = base || dir;
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkPages(full, base));
    } else if (entry.name.endsWith(".html")) {
      const rel = path.relative(base, full);
      results.push({ full, rel });
    }
  }
  return results;
}

// ── Main ──────────────────────────────────────────────────────────────

function build() {
  console.log("Building Marrow UI...");

  // Clean dist
  if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });
  ensureDir(DIST);

  // Generate theme CSS
  const css = generateCSS();
  writeFile(path.join(DIST, "css", "marrow-theme.css"), css);

  // Copy static CSS
  if (fs.existsSync(path.join(SRC, "css"))) {
    for (const f of fs.readdirSync(path.join(SRC, "css"))) {
      fs.copyFileSync(path.join(SRC, "css", f), path.join(DIST, "css", f));
    }
  }

  // Copy static JS
  if (fs.existsSync(path.join(SRC, "js"))) {
    ensureDir(path.join(DIST, "js"));
    for (const f of fs.readdirSync(path.join(SRC, "js"))) {
      fs.copyFileSync(path.join(SRC, "js", f), path.join(DIST, "js", f));
    }
  }

  // Build pages
  const pagesDir = path.join(SRC, "pages");
  const pages = walkPages(pagesDir);
  for (const page of pages) {
    const html = buildPage(page.full);
    writeFile(path.join(DIST, page.rel), html);
  }

  console.log(`Built ${pages.length} pages.`);
}

build();
