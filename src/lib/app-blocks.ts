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
} as const;

export type AppBlockKind = keyof typeof APP_BLOCKS;

export const APP_BLOCK_KINDS = Object.keys(APP_BLOCKS) as AppBlockKind[];

export function isAppBlockKind(value: string | null | undefined): value is AppBlockKind {
  return !!value && value in APP_BLOCKS;
}
