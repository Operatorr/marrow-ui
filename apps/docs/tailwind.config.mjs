/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--marrow-primary) / <alpha-value>)",
        "primary-foreground": "hsl(var(--marrow-primary-foreground) / <alpha-value>)",
        secondary: "hsl(var(--marrow-secondary) / <alpha-value>)",
        "secondary-foreground": "hsl(var(--marrow-secondary-foreground) / <alpha-value>)",
        accent: "hsl(var(--marrow-accent) / <alpha-value>)",
        "accent-foreground": "hsl(var(--marrow-accent-foreground) / <alpha-value>)",
        background: "hsl(var(--marrow-background) / <alpha-value>)",
        foreground: "hsl(var(--marrow-foreground) / <alpha-value>)",
        muted: "hsl(var(--marrow-muted) / <alpha-value>)",
        "muted-foreground": "hsl(var(--marrow-muted-foreground) / <alpha-value>)",
        card: "hsl(var(--marrow-card) / <alpha-value>)",
        "card-foreground": "hsl(var(--marrow-card-foreground) / <alpha-value>)",
        popover: "hsl(var(--marrow-popover) / <alpha-value>)",
        "popover-foreground": "hsl(var(--marrow-popover-foreground) / <alpha-value>)",
        destructive: "hsl(var(--marrow-destructive) / <alpha-value>)",
        "destructive-foreground": "hsl(var(--marrow-destructive-foreground) / <alpha-value>)",
        border: "hsl(var(--marrow-border) / <alpha-value>)",
        input: "hsl(var(--marrow-input) / <alpha-value>)",
        ring: "hsl(var(--marrow-ring) / <alpha-value>)",
      },
      borderRadius: {
        marrow: "var(--marrow-radius)",
      },
      fontFamily: {
        heading: "var(--marrow-font-heading)",
        body: "var(--marrow-font-body)",
      },
    },
  },
  plugins: [],
};
