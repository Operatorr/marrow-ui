#!/usr/bin/env node

/**
 * Generate llms-full.txt from all documentation content.
 * This creates a single comprehensive file with all documentation
 * formatted as clean Markdown for AI agents.
 */

const fs = require("fs");
const path = require("path");

const COMPONENTS_DIR = path.join(__dirname, "..", "packages", "ui", "templates", "components");
const CONFIG_FILE = path.join(__dirname, "..", "packages", "ui", "templates", "marrow.config.js");
const CSS_FILE = path.join(__dirname, "..", "packages", "ui", "src", "css", "marrow.css");
const JS_FILE = path.join(__dirname, "..", "packages", "ui", "src", "js", "marrow.js");
const OUTPUT = path.join(__dirname, "..", "apps", "docs", "public", "llms-full.txt");

function readFile(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, "utf-8") : "";
}

const components = fs.readdirSync(COMPONENTS_DIR)
  .filter(f => f.endsWith(".html"))
  .sort()
  .map(f => ({
    name: f.replace(".html", ""),
    label: f.replace(".html", "").split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    content: readFile(path.join(COMPONENTS_DIR, f)),
  }));

const output = `# Marrow UI – Complete Documentation

> A sleek, opinionated UI kit built with Tailwind CSS and Alpine.js.
> No React, no build step required. 59 copy-paste components with a single config file for complete theme control.

## Overview

Marrow UI is a UI component library that works with any HTML-based project. It uses:
- **Tailwind CSS** for utility-based styling
- **Alpine.js** for lightweight interactivity (no virtual DOM)
- **CSS custom properties** for theming (generated from marrow.config.js)

All component classes use the \`mw-\` prefix (e.g., \`mw-btn\`, \`mw-card\`, \`mw-input\`).
Interactive components use Alpine.js \`x-data\` directives with registered data components (e.g., \`x-data="mwDialog()"\`).

### Installation

**CDN (quickest):**
\`\`\`html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/marrow-ui@latest/src/css/marrow.css">
<script src="https://cdn.jsdelivr.net/npm/marrow-ui@latest/src/js/marrow.js"></script>
<script src="https://cdn.tailwindcss.com"></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
\`\`\`

**CLI:**
\`\`\`bash
npx marrow-ui init          # Creates marrow.config.js, marrow.css, marrow.js, marrow-theme.css
npx marrow-ui add button    # Copies button template to components/ui/button.html
npx marrow-ui add --all     # Copies all 59 component templates
npx marrow-ui build         # Regenerates marrow-theme.css from marrow.config.js
npx marrow-ui list          # Lists all available components
\`\`\`

## Configuration Reference

The \`marrow.config.js\` file controls all theme settings:

\`\`\`javascript
${readFile(CONFIG_FILE)}
\`\`\`

### Configuration Options

| Setting | Options | Default |
|---------|---------|---------|
| theme | "light", "dark" | "light" |
| radius | "none", "sm", "md", "lg", "xl", "2xl", "full" | "lg" |
| compactness | "minimal", "compact", "normal", "relaxed", "spacious" | "normal" |
| menuAccent | "subtle", "bold", "border" | "subtle" |
| iconLibrary | "lucide", "heroicons", "phosphor", "tabler", etc. | "lucide" |
| transitionDuration | "none", "fast", "base", "slow", "lazy" | "base" |
| shadow | "none", "sm", "md", "lg", "xl" | "sm" |

### Compactness Levels

| Level | Font Size | Button Padding | Card Padding | Best For |
|-------|-----------|---------------|-------------|----------|
| minimal | 0.75rem | 0.25rem 0.5rem | 0.75rem | Data-dense dashboards |
| compact | 0.875rem | 0.375rem 0.75rem | 1rem | Admin panels |
| normal | 1rem | 0.5rem 1rem | 1.5rem | General purpose |
| relaxed | 1.125rem | 0.625rem 1.25rem | 2rem | Marketing sites |
| spacious | 1.25rem | 0.75rem 1.5rem | 2.5rem | Hero sections |

### CSS Custom Properties

All theme values are exposed as CSS custom properties:

| Property | Description |
|----------|-------------|
| --marrow-primary | Primary brand color (HSL) |
| --marrow-background | Page background (HSL) |
| --marrow-foreground | Default text color (HSL) |
| --marrow-muted | Muted/disabled color (HSL) |
| --marrow-border | Border color (HSL) |
| --marrow-radius | Border radius |
| --marrow-text | Base font size |
| --marrow-duration | Transition duration |
| --marrow-shadow | Box shadow |
| --marrow-font-heading | Heading font family |
| --marrow-font-body | Body font family |
| --marrow-btn-py / --marrow-btn-px | Button padding |
| --marrow-input-py / --marrow-input-px | Input padding |
| --marrow-card-p | Card padding |

## Alpine.js Components

Interactive components are registered as Alpine.js data components. Include \`marrow.js\` before Alpine.js in your HTML.

### Available Data Components

| Component | Usage | Description |
|-----------|-------|-------------|
| mwAccordion | \`x-data="mwAccordion()"\` | Single-open accordion |
| mwAccordionMulti | \`x-data="mwAccordionMulti()"\` | Multi-open accordion |
| mwTabs | \`x-data="mwTabs('tab1')"\` | Tab navigation |
| mwDialog | \`x-data="mwDialog()"\` | Modal dialog |
| mwSheet | \`x-data="mwSheet()"\` | Side panel |
| mwDropdown | \`x-data="mwDropdown()"\` | Dropdown menu |
| mwPopover | \`x-data="mwPopover()"\` | Popover panel |
| mwCollapsible | \`x-data="mwCollapsible()"\` | Collapsible section |
| mwSwitch | \`x-data="mwSwitch()"\` | Toggle switch |
| mwCheckbox | \`x-data="mwCheckbox()"\` | Checkbox |
| mwRadioGroup | \`x-data="mwRadioGroup()"\` | Radio button group |
| mwTooltip | \`x-data="mwTooltip()"\` | Tooltip |
| mwHoverCard | \`x-data="mwHoverCard()"\` | Hover card |
| mwCommand | \`x-data="mwCommand()"\` | Command palette |
| mwSlider | \`x-data="mwSlider(0, 100, 50)"\` | Range slider |
| mwPagination | \`x-data="mwPagination(10, 1)"\` | Pagination |
| mwToggle | \`x-data="mwToggle()"\` | Toggle button |
| mwToggleGroup | \`x-data="mwToggleGroup('single')"\` | Toggle group |
| mwAlertDialog | \`x-data="mwAlertDialog()"\` | Alert dialog |
| mwContextMenu | \`x-data="mwContextMenu()"\` | Context menu |
| mwCombobox | \`x-data="mwCombobox(items)"\` | Combobox |
| mwCarousel | \`x-data="mwCarousel(count)"\` | Carousel |
| mwResizable | \`x-data="mwResizable(50)"\` | Resizable panels |
| mwInputOTP | \`x-data="mwInputOTP(6)"\` | OTP input |
| mwProgress | \`x-data="mwProgress(0)"\` | Progress bar |
| mwDatePicker | \`x-data="mwDatePicker()"\` | Date picker |
| mwCalendar | \`x-data="mwCalendar()"\` | Calendar |
| mwSidebar | \`x-data="mwSidebar()"\` | Sidebar |

### Toast Store

Toasts use an Alpine.js store:
\`\`\`javascript
Alpine.store('toasts').add({ title: 'Success', description: 'Done!', variant: 'default', duration: 4000 });
\`\`\`

## Component Reference

${components.map(c => `### ${c.label}

\`\`\`html
${c.content.trim()}
\`\`\`
`).join("\n")}

## CSS Classes Reference

### Buttons
| Class | Description |
|-------|-------------|
| .mw-btn | Base button |
| .mw-btn-primary | Primary variant |
| .mw-btn-secondary | Secondary variant |
| .mw-btn-outline | Outline variant |
| .mw-btn-ghost | Ghost variant |
| .mw-btn-destructive | Destructive/danger variant |
| .mw-btn-link | Link-style variant |
| .mw-btn-sm | Small size |
| .mw-btn-lg | Large size |
| .mw-btn-icon | Icon-only square button |

### Form Controls
| Class | Description |
|-------|-------------|
| .mw-input | Text input |
| .mw-textarea | Multi-line input |
| .mw-select | Custom select |
| .mw-label | Form label |
| .mw-checkbox | Checkbox |
| .mw-radio | Radio button |
| .mw-switch | Toggle switch |
| .mw-switch-thumb | Switch thumb element |
| .mw-slider-track | Slider track |
| .mw-slider-range | Slider filled range |
| .mw-slider-thumb | Slider thumb |

### Layout
| Class | Description |
|-------|-------------|
| .mw-card | Card container |
| .mw-separator | Horizontal divider |
| .mw-separator-vertical | Vertical divider |
| .mw-scroll-area | Custom scrollbar container |
| .mw-resizable-handle | Panel resize handle |

### Feedback
| Class | Description |
|-------|-------------|
| .mw-badge | Status badge |
| .mw-badge-default | Default badge variant |
| .mw-badge-secondary | Secondary badge variant |
| .mw-badge-outline | Outline badge variant |
| .mw-badge-destructive | Destructive badge variant |
| .mw-alert | Alert message |
| .mw-progress | Progress bar container |
| .mw-progress-bar | Progress bar fill |
| .mw-skeleton | Loading skeleton |
| .mw-spinner | Loading spinner |

### Overlays
| Class | Description |
|-------|-------------|
| .mw-overlay | Modal backdrop |
| .mw-dialog | Dialog container |
| .mw-sheet | Sheet panel |
| .mw-popover | Popover container |
| .mw-tooltip | Tooltip container |

### Navigation
| Class | Description |
|-------|-------------|
| .mw-tabs-list | Tab list container |
| .mw-tab-trigger | Tab button |
| .mw-breadcrumb | Breadcrumb nav |
| .mw-pagination-item | Pagination button |
| .mw-menu-item | Dropdown menu item |

### Other
| Class | Description |
|-------|-------------|
| .mw-avatar | Avatar container |
| .mw-avatar-sm | Small avatar |
| .mw-avatar-lg | Large avatar |
| .mw-kbd | Keyboard shortcut |
| .mw-toggle | Toggle button |
| .mw-empty | Empty state |
| .mw-code-block | Code block container |

### Data Attributes
| Attribute | Usage |
|-----------|-------|
| data-state="checked" | Checked state for checkbox, switch |
| data-state="unchecked" | Unchecked state for checkbox, switch |
| data-state="active" | Active tab trigger |
| data-state="on" | Toggle pressed state |
`;

fs.writeFileSync(OUTPUT, output, "utf-8");
console.log(`Generated llms-full.txt (${(output.length / 1024).toFixed(1)} KB)`);
