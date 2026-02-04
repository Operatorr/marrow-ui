#!/usr/bin/env node

/**
 * Convert old src/pages/*.html files to Astro format in apps/docs/src/pages/.
 *
 * - Landing page (index.html) → gets BaseLayout + Navbar imports
 * - Doc pages (docs/*.html) → get DocsLayout wrapper
 * - Component pages (docs/components/*.html) → get DocsLayout with activeComponent
 *
 * Handles:
 *   - Front matter extraction
 *   - .html link references → Astro /docs/xxx/ trailing-slash format
 *   - Layout wrapping
 */

const fs = require("fs");
const path = require("path");

const OLD_PAGES = path.join(__dirname, "..", "src", "pages");
const NEW_PAGES = path.join(__dirname, "..", "apps", "docs", "src", "pages");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function parseFrontMatter(content) {
  const meta = {};
  const lines = content.split("\n");
  const body = [];
  let inFront = false;
  let pastFront = false;
  for (const line of lines) {
    if (line.trim() === "---" && !inFront && !pastFront) { inFront = true; continue; }
    if (line.trim() === "---" && inFront) { inFront = false; pastFront = true; continue; }
    if (inFront) {
      const m = line.match(/^(\w+):\s*(.+)$/);
      if (m) meta[m[1].trim()] = m[2].trim();
    } else if (pastFront || !inFront) {
      body.push(line);
    }
  }
  return { meta, body: body.join("\n") };
}

/**
 * Fix links: /docs/foo.html → /docs/foo/
 * Also /docs/components/foo.html → /docs/components/foo/
 */
function fixLinks(html) {
  return html
    .replace(/href="\/docs\/index\.html"/g, 'href="/docs/"')
    .replace(/href="\/docs\/components\/([^"]+)\.html"/g, 'href="/docs/components/$1/"')
    .replace(/href="\/docs\/([^"]+)\.html"/g, 'href="/docs/$1/"');
}

// ── Convert Landing Page ─────────────────────────────────────────────

function convertLanding() {
  const src = path.join(OLD_PAGES, "index.html");
  if (!fs.existsSync(src)) return;

  const raw = fs.readFileSync(src, "utf-8");
  const { meta, body } = parseFrontMatter(raw);
  const fixedBody = fixLinks(body);

  const astro = `---
import BaseLayout from "../layouts/BaseLayout.astro";
import Navbar from "../components/Navbar.astro";
---

<BaseLayout title="${meta.title || "Marrow UI"}" description="${meta.description || ""}">
${fixedBody}
</BaseLayout>
`;

  ensureDir(NEW_PAGES);
  fs.writeFileSync(path.join(NEW_PAGES, "index.astro"), astro, "utf-8");
  console.log("  Converted: index.astro (landing page)");
}

// ── Convert Doc Pages ────────────────────────────────────────────────

function convertDocPage(filename) {
  const src = path.join(OLD_PAGES, "docs", filename);
  if (!fs.existsSync(src)) return;

  const raw = fs.readFileSync(src, "utf-8");
  const { meta, body } = parseFrontMatter(raw);
  const fixedBody = fixLinks(body);

  const name = filename.replace(".html", "");
  const activeSection = name === "index" ? "home" : name;

  const astro = `---
import DocsLayout from "../../layouts/DocsLayout.astro";
---

<DocsLayout title="${meta.title || name}" description="${meta.description || ""}" activeSection="${activeSection}">
${fixedBody}
</DocsLayout>
`;

  ensureDir(path.join(NEW_PAGES, "docs"));
  fs.writeFileSync(path.join(NEW_PAGES, "docs", `${name}.astro`), astro, "utf-8");
  console.log(`  Converted: docs/${name}.astro`);
}

// ── Convert Component Pages ──────────────────────────────────────────

function convertComponentPage(filename) {
  const src = path.join(OLD_PAGES, "docs", "components", filename);
  if (!fs.existsSync(src)) return;

  const raw = fs.readFileSync(src, "utf-8");
  const { meta, body } = parseFrontMatter(raw);
  const fixedBody = fixLinks(body);

  const name = filename.replace(".html", "");

  const astro = `---
import DocsLayout from "../../../layouts/DocsLayout.astro";
---

<DocsLayout title="${meta.title || name}" description="${meta.description || ""}" activeComponent="${name}">
${fixedBody}
</DocsLayout>
`;

  ensureDir(path.join(NEW_PAGES, "docs", "components"));
  fs.writeFileSync(path.join(NEW_PAGES, "docs", "components", `${name}.astro`), astro, "utf-8");
  console.log(`  Converted: docs/components/${name}.astro`);
}

// ── Main ─────────────────────────────────────────────────────────────

function main() {
  console.log("\nConverting pages to Astro format...\n");

  // Landing page
  convertLanding();

  // Doc pages
  const docPages = ["index.html", "introduction.html", "installation.html", "customization.html"];
  for (const page of docPages) {
    convertDocPage(page);
  }

  // Component pages
  const compDir = path.join(OLD_PAGES, "docs", "components");
  if (fs.existsSync(compDir)) {
    const compFiles = fs.readdirSync(compDir).filter(f => f.endsWith(".html"));
    for (const file of compFiles) {
      convertComponentPage(file);
    }
    console.log(`\n  Total: 1 landing + ${docPages.length} docs + ${compFiles.length} components = ${1 + docPages.length + compFiles.length} pages\n`);
  }
}

main();
