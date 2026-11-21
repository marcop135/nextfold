/**
 * Section style options, named after the custom properties in src/styles/tokens.css.
 * Studio offers exactly these values, and the CSS has one rule per value.
 */
export const SECTION_THEMES = [
  { value: "bg", title: "Page (--color-bg)" },
  { value: "surface", title: "Surface (--color-surface)" },
  { value: "band", title: "Band (--color-band)" },
] as const;

export const SECTION_SPACINGS = [
  { value: "space-3", title: "Tight (--space-3)" },
  { value: "space-4", title: "Medium (--space-4)" },
  { value: "space-5", title: "Default (--space-5)" },
] as const;
