import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.resolve(
  __dirname,
  "../../../../packages/ui/templates/components"
);

interface TemplateResult {
  sections: Map<string, string>;
  full: string;
}

/**
 * Reads a component template, strips the 3-line header, and splits on
 * `<!-- @section: Name -->` markers.
 */
export function loadTemplate(name: string): TemplateResult {
  const raw = fs.readFileSync(
    path.join(TEMPLATES_DIR, `${name}.html`),
    "utf-8"
  );

  // Strip the 3-line header (title, description, requires) + blank line
  const lines = raw.split("\n");
  let bodyStart = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("<!-- ")) {
      continue;
    }
    // First non-comment line (usually blank) — skip it too
    bodyStart = i + (lines[i].trim() === "" ? 1 : 0);
    break;
  }
  const body = lines.slice(bodyStart).join("\n");

  // Split on @section markers
  const sections = new Map<string, string>();
  const sectionRegex = /^<!-- @section:\s*(.+?)\s*-->$/gm;
  const markers: { name: string; index: number }[] = [];
  let match: RegExpExecArray | null;

  while ((match = sectionRegex.exec(body)) !== null) {
    markers.push({ name: match[1], index: match.index + match[0].length });
  }

  if (markers.length > 0) {
    for (let i = 0; i < markers.length; i++) {
      const start = markers[i].index;
      const end = i + 1 < markers.length
        ? body.lastIndexOf("<!-- @section:", markers[i + 1].index)
        : body.length;
      const content = body.slice(start, end).trim();
      sections.set(markers[i].name, content);
    }
  }

  // Full = everything after the header, with @section markers stripped
  const full = body.replace(/<!-- @section:\s*.+?\s*-->\n?/g, "").trim();

  return { sections, full };
}

/** Convenience: get a single named section from a template. */
export function loadSection(name: string, section: string): string {
  const t = loadTemplate(name);
  const s = t.sections.get(section);
  if (!s) {
    throw new Error(
      `Section "${section}" not found in template "${name}". Available: ${[...t.sections.keys()].join(", ")}`
    );
  }
  return s;
}

/** Convenience: get the full template body (header stripped, no sections). */
export function loadFull(name: string): string {
  return loadTemplate(name).full;
}
