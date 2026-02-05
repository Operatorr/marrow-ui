# Marrow UI

A sleek, opinionated UI kit built with **Tailwind CSS** and **Alpine.js**. No React, no build step required.

Copy and paste 59 beautiful components into your project. One config file controls your entire theme.

[Documentation](https://marrow-ui.dev) · [Components](https://marrow-ui.dev/docs/components/button) · [GitHub](https://github.com/Operatorr/marrow-ui)

---

## Why Marrow UI?

Most modern UI kits are built for React. If you're using Laravel, Django, Rails, Go, PHP, Astro, Hugo, or any server-rendered framework, you're often left with limited options.

Marrow UI is different:

- **No framework lock-in** — Pure HTML and Tailwind CSS. Works everywhere.
- **Alpine.js for interactivity** — Lightweight, declarative, no virtual DOM.
- **One config file** — Colors, radius, spacing, fonts, compactness. All in one place.
- **Copy and paste** — Each component is self-contained. No npm install required.
- **5 compactness levels** — From data-dense dashboards to spacious marketing sites.

## Quick Start

### Option 1: CDN (Zero Install)

Add these to your HTML `<head>`:

```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Alpine.js -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

<!-- Marrow UI -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/marrow-ui@latest/src/css/marrow.css">
<script src="https://cdn.jsdelivr.net/npm/marrow-ui@latest/src/js/marrow.js"></script>
```

Then use any component:

```html
<button class="mw-btn mw-btn-primary">Click me</button>
```

### Option 2: CLI

```bash
# Initialize Marrow UI in your project
npx marrow-ui init

# Add specific components
npx marrow-ui add button card dialog tabs

# Add all 59 components
npx marrow-ui add --all

# Regenerate theme CSS after editing config
npx marrow-ui build

# List available components
npx marrow-ui list
```

The `init` command creates:
- `marrow.config.js` — Your theme configuration
- `marrow.css` — Component base styles
- `marrow.js` — Alpine.js data components
- `marrow-theme.css` — Generated CSS custom properties

## Configuration

Everything is controlled from `marrow.config.js`:

```javascript
module.exports = {
  theme: "light",                    // "light" | "dark"

  colors: {
    light: {
      primary: "220 90% 56%",        // HSL format for Tailwind opacity support
      background: "0 0% 100%",
      foreground: "222 47% 11%",
      // ... full palette
    },
    dark: { /* ... */ }
  },

  radius: "lg",                      // none | sm | md | lg | xl | 2xl | full
  compactness: "normal",             // minimal | compact | normal | relaxed | spacious

  fonts: {
    heading: "Inter",
    body: "Inter",
  },

  menuAccent: "subtle",              // subtle | bold | border
  iconLibrary: "lucide",             // lucide | heroicons | phosphor | tabler | ...
  transitionDuration: "base",        // none | fast | base | slow | lazy
  shadow: "sm",                      // none | sm | md | lg | xl
};
```

After editing, run `npx marrow-ui build` to regenerate the theme CSS.

### Compactness Levels

| Level | Font Size | Best For |
|-------|-----------|----------|
| `minimal` | 12px | Data-dense dashboards, admin panels |
| `compact` | 14px | Productivity tools, settings pages |
| `normal` | 16px | General purpose (default) |
| `relaxed` | 18px | Marketing sites, blogs |
| `spacious` | 20px | Hero sections, editorial layouts |

## Components

59 components, all with variants and sizes:

| Category | Components |
|----------|------------|
| **Buttons** | Button, Button Group, Toggle, Toggle Group |
| **Forms** | Input, Textarea, Select, Native Select, Checkbox, Radio Group, Switch, Slider, Label, Field, Input OTP, Combobox, Date Picker |
| **Layout** | Card, Separator, Aspect Ratio, Resizable, Scroll Area |
| **Navigation** | Tabs, Breadcrumb, Pagination, Menubar, Navigation Menu, Sidebar |
| **Feedback** | Alert, Badge, Progress, Skeleton, Spinner, Toast, Sonner |
| **Overlays** | Dialog, Alert Dialog, Sheet, Drawer, Dropdown Menu, Context Menu, Popover, Hover Card, Tooltip, Command |
| **Data** | Table, Data Table, Calendar |
| **Other** | Accordion, Avatar, Carousel, Chart, Collapsible, Direction, Empty, Item, Kbd, Typography |

## Usage Examples

### Button

```html
<button class="mw-btn mw-btn-primary">Primary</button>
<button class="mw-btn mw-btn-secondary">Secondary</button>
<button class="mw-btn mw-btn-outline">Outline</button>
<button class="mw-btn mw-btn-ghost">Ghost</button>
<button class="mw-btn mw-btn-destructive">Delete</button>

<!-- Sizes -->
<button class="mw-btn mw-btn-primary mw-btn-sm">Small</button>
<button class="mw-btn mw-btn-primary mw-btn-lg">Large</button>
```

### Dialog (with Alpine.js)

```html
<div x-data="mwDialog()">
  <button @click="show()" class="mw-btn mw-btn-primary">Open Dialog</button>

  <template x-if="open">
    <div>
      <div class="mw-overlay" @click="close()"></div>
      <div class="mw-dialog">
        <h2 class="font-heading text-lg font-semibold">Dialog Title</h2>
        <p class="text-muted-foreground mt-2">Dialog content goes here.</p>
        <div class="flex justify-end gap-2 mt-4">
          <button @click="close()" class="mw-btn mw-btn-outline">Cancel</button>
          <button @click="close()" class="mw-btn mw-btn-primary">Confirm</button>
        </div>
      </div>
    </div>
  </template>
</div>
```

### Tabs

```html
<div x-data="mwTabs('account')">
  <div class="mw-tabs-list">
    <button class="mw-tab-trigger" :data-state="isActive('account') ? 'active' : ''" @click="setActive('account')">Account</button>
    <button class="mw-tab-trigger" :data-state="isActive('password') ? 'active' : ''" @click="setActive('password')">Password</button>
  </div>
  <div x-show="isActive('account')" class="mt-4">Account settings content</div>
  <div x-show="isActive('password')" class="mt-4">Password settings content</div>
</div>
```

### Toast Notifications

```html
<!-- Toast container (add once to your layout) -->
<div x-data class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
  <template x-for="toast in $store.toasts.items" :key="toast.id">
    <div class="mw-card p-4 shadow-lg min-w-[300px]">
      <div class="font-semibold" x-text="toast.title"></div>
      <div class="text-sm text-muted-foreground" x-text="toast.description"></div>
    </div>
  </template>
</div>

<!-- Trigger a toast from anywhere -->
<button
  @click="$store.toasts.add({ title: 'Success', description: 'Your changes have been saved.' })"
  class="mw-btn mw-btn-primary"
>
  Save Changes
</button>
```

## CSS Classes Reference

### Core Pattern

All Marrow UI classes use the `mw-` prefix:

```
mw-{component}                    → Base component (mw-btn, mw-card, mw-input)
mw-{component}-{variant}          → Variant (mw-btn-primary, mw-badge-destructive)
mw-{component}-{size}             → Size (mw-btn-sm, mw-btn-lg, mw-avatar-lg)
```

### State Attributes

Interactive components use `data-state` attributes for styling:

```html
<button class="mw-checkbox" data-state="checked">     <!-- checked | unchecked -->
<button class="mw-switch" data-state="checked">       <!-- checked | unchecked -->
<button class="mw-tab-trigger" data-state="active">   <!-- active | inactive -->
<button class="mw-toggle" data-state="on">            <!-- on | off -->
```

### CSS Custom Properties

Theme values are available as CSS variables:

```css
--marrow-primary              /* Primary color (HSL) */
--marrow-background           /* Background color */
--marrow-foreground           /* Text color */
--marrow-radius               /* Border radius */
--marrow-duration             /* Transition duration */
--marrow-shadow               /* Box shadow */
```

## Project Structure

```
marrow-ui/
├── apps/docs/                 # Astro documentation site
├── packages/ui/               # npm package
│   ├── bin/cli.js             # CLI tool
│   ├── src/css/marrow.css     # Component styles
│   ├── src/js/marrow.js       # Alpine.js components
│   └── templates/             # Component HTML templates
├── CLAUDE.md                  # AI agent instructions
└── context7.json              # Context7 MCP config
```

## Development

```bash
# Install dependencies
pnpm install

# Start docs dev server
pnpm dev

# Build everything
pnpm build
```

## AI Integration

Marrow UI is optimized for AI coding assistants:

- **`/llms.txt`** — Structured documentation index for AI agents
- **`/llms-full.txt`** — Complete documentation in one file (97KB)
- **`CLAUDE.md`** — Instructions for Claude Code and similar tools
- **`context7.json`** — Registration config for [Context7 MCP](https://context7.com)

When using Cursor, Claude Code, or Copilot, the AI can reference these files to understand how to use Marrow UI correctly.

## Comparison with shadcn/ui

| Feature | shadcn/ui | Marrow UI |
|---------|-----------|-----------|
| Framework | React | HTML + Alpine.js |
| Styling | Tailwind CSS | Tailwind CSS |
| Theming | CSS Variables | CSS Variables + Config File |
| Installation | CLI (copies JSX) | CLI (copies HTML) or CDN |
| Build Step | Required (JSX) | Optional |
| Bundle Size | React + deps | Alpine.js (~15KB) |
| Server Rendering | Next.js/Remix | Any (Laravel, Django, Rails, Go, etc.) |

## Browser Support

- Chrome, Edge, Firefox, Safari (latest 2 versions)
- Alpine.js requires ES6+ support

## License

MIT License. See [LICENSE](LICENSE) for details.

---

Built with Tailwind CSS and Alpine.js.
