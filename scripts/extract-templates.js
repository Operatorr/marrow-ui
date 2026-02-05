#!/usr/bin/env node

/**
 * Extract component templates from documentation code blocks.
 * The code blocks in each component page contain the copy-paste ready HTML.
 */

const fs = require("fs");
const path = require("path");

const COMPONENTS_SRC = path.join(__dirname, "..", "src", "pages", "docs", "components");
const TEMPLATES_DEST = path.join(__dirname, "..", "packages", "ui", "templates", "components");

fs.mkdirSync(TEMPLATES_DEST, { recursive: true });

function unescapeHTML(str) {
  return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

const files = fs.readdirSync(COMPONENTS_SRC).filter(f => f.endsWith(".html"));

let count = 0;
for (const file of files) {
  const name = file.replace(".html", "");
  const content = fs.readFileSync(path.join(COMPONENTS_SRC, file), "utf-8");

  // Extract title from front matter
  let title = name;
  let description = "";
  const titleMatch = content.match(/^title:\s*(.+)$/m);
  const descMatch = content.match(/^description:\s*(.+)$/m);
  if (titleMatch) title = titleMatch[1].trim();
  if (descMatch) description = descMatch[1].trim();

  // Find the first code block: <pre><code>...</code></pre>
  const codeMatch = content.match(/<pre><code>([\s\S]*?)<\/code><\/pre>/);

  let code = "";
  if (codeMatch) {
    code = unescapeHTML(codeMatch[1]).trim();
  }

  const header = `<!-- Marrow UI: ${title} -->\n<!-- ${description || title + " component"} -->\n<!-- Requires: Tailwind CSS, Alpine.js, marrow.css, marrow.js -->\n`;

  if (code) {
    fs.writeFileSync(
      path.join(TEMPLATES_DEST, file),
      `${header}\n${code}\n`,
      "utf-8"
    );
  } else {
    // Fallback: write a placeholder pointing to docs
    fs.writeFileSync(
      path.join(TEMPLATES_DEST, file),
      `${header}\n<!-- See documentation: https://marrow-ui.dev/docs/components/${name} -->\n`,
      "utf-8"
    );
  }
  count++;
}

console.log(`Extracted ${count} component templates to packages/ui/templates/components/`);
