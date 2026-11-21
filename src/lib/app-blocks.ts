/**
 * Interactive widgets an editor can place as a section. The editor picks one by name;
 * the code behind each lives in src/components/app-blocks. The fallback is what Markdown readers get.
 */
export const APP_BLOCKS = {
  guardrailsPlayground: {
    title: "Guardrails playground",
    fallback:
      "An interactive form with the hero's fields and the rules the Studio checks: required heading, length limits, and link format. It runs in the browser on the HTML page.",
  },
  pageAnatomy: {
    title: "Page anatomy",
    fallback:
      "On the HTML page: this page's sections as a sketch. Pick one to see each field an editor filled in, with its length against the Studio's limit.",
  },
  cacheInspector: {
    title: "Cache inspector",
    fallback:
      "On the HTML page: when this copy of the page entered the cache, the cache tags that can expire it, and the cache headers of a fresh request for the same URL.",
  },
} as const;

export type AppBlockKind = keyof typeof APP_BLOCKS;

export const APP_BLOCK_KINDS = Object.keys(APP_BLOCKS) as AppBlockKind[];

export function isAppBlockKind(value: string | null | undefined): value is AppBlockKind {
  return !!value && value in APP_BLOCKS;
}
