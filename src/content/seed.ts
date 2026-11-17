import type { Page } from "@/sanity/types";

/** Shown until the Sanity dataset publishes a page with the same slug. */
export const seedPages: Page[] = [
  {
    title: "Next Fold: Next.js and Sanity section library",
    slug: "home",
    description:
      "Next Fold is a Next.js and Sanity demo in progress: marketing pages built from typed sections, with Visual Editing and migrations to come.",
    sections: [
      {
        _type: "hero",
        _key: "hero",
        eyebrow: "Work in progress",
        heading: "Marketing pages built from Sanity sections",
        body: "Editors compose each page from typed sections in Sanity Studio. Developers own the schema, the queries, and the components. The site grows in public, one release at a time.",
        cta: { label: "See the Storyblok version", href: "https://nextstory.marcopontili.com" },
      },
      {
        _type: "featureGrid",
        _key: "next",
        heading: "What ships next",
        items: [
          { _key: "schema", title: "Schema ownership", body: "Validation, Studio previews, a custom desk, and generated TypeScript types." },
          { _key: "editing", title: "Visual Editing", body: "Click-to-edit overlays, draft previews, and live content from Sanity." },
          { _key: "migrations", title: "Content migrations", body: "Schema changes shipped with a migration script, tried on a dry run first." },
        ],
      },
      {
        _type: "callToAction",
        _key: "agents",
        heading: "Read this site as Markdown",
        body: "Every page has a Markdown version for agents and text readers.",
        link: { label: "Markdown and discovery files", href: "/for-agents" },
      },
    ],
  },
];
