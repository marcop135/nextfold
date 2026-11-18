import type { CallToActionSection, FeatureGridSection, HeroSection, Page, SiteSettings } from "@/sanity/types";

const asData = (section: object) => JSON.stringify(section, null, 2);

const insideHero: HeroSection = {
  _type: "hero",
  _key: "hero",
  eyebrow: "Inside",
  heading: "One page, taken apart",
  body: "Each section on this page is followed by the data it was rendered from. Both come from the same object, so they always match.",
};

const insideGrid: FeatureGridSection = {
  _type: "featureGrid",
  _key: "limits",
  heading: "What a feature grid holds",
  items: [
    { _key: "heading", _type: "feature", title: "One heading", body: "Required, up to 80 characters." },
    { _key: "count", _type: "feature", title: "Two to six items", body: "The Studio rejects fewer than two items or more than six." },
    { _key: "fields", _type: "feature", title: "A title and a body", body: "Titles stop at 60 characters, bodies at 200." },
  ],
};

const insideCta: CallToActionSection = {
  _type: "callToAction",
  _key: "next",
  heading: "Where these limits come from",
  body: "Guardrails lists what the schema checks before an editor can publish.",
  link: { _type: "link", label: "See the guardrails", href: "/guardrails" },
};

/** Kept in step with the hero definition in src/sanity/schemaTypes/sections.ts. */
const heroSchema = `export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", type: "string", validation: (rule) => rule.max(40) }),
    defineField({ name: "heading", type: "string", validation: (rule) => rule.required().max(80) }),
    defineField({ name: "body", type: "text", rows: 3, validation: (rule) => rule.max(240) }),
    defineField({ name: "cta", title: "Call to action", type: "link" }),
  ],
});`;

/** Shown until the Sanity dataset publishes a page with the same slug. */
export const seedPages: Page[] = [
  {
    title: "Next Fold: marketing pages from typed Sanity sections",
    slug: "home",
    description:
      "Next Fold is a Next.js and Sanity demo: editors compose marketing pages from typed sections, developers own the schema and the components.",
    sections: [
      {
        _type: "hero",
        _key: "hero",
        eyebrow: "Next.js + Sanity",
        heading: "Marketing pages built from typed sections",
        body: "Editors build each page in Sanity Studio from a short list of sections. Developers define those sections in code, so pages can change every day and still match the design.",
        cta: { _type: "link", label: "Take a page apart", href: "/inside-a-page" },
      },
      {
        _type: "featureGrid",
        _key: "owners",
        heading: "Who owns what",
        items: [
          { _key: "editors", _type: "feature", title: "Editors", body: "Write the copy, order the sections, and publish from Sanity Studio without a deploy." },
          { _key: "developers", _type: "feature", title: "Developers", body: "Own the section types, their field rules, and the React component behind each one." },
          { _key: "readers", _type: "feature", title: "Readers and agents", body: "Get the same content as an HTML page or as Markdown, listed in llms.txt." },
        ],
      },
      {
        _type: "steps",
        _key: "flow",
        heading: "From schema to page",
        items: [
          { _key: "define", _type: "step", title: "Define", body: "Each section type is a schema in src/sanity/schemaTypes." },
          { _key: "edit", _type: "step", title: "Edit", body: "Editors add and order sections on a page in the Studio at /studio." },
          { _key: "publish", _type: "step", title: "Publish", body: "Publishing saves the page to the Sanity dataset." },
          {
            _key: "fetch",
            _type: "step",
            title: "Fetch",
            body: "A GROQ query reads the published page through the Sanity CDN and caches it for 60 seconds. Without a Sanity page, a bundled seed page fills in.",
          },
          { _key: "render", _type: "step", title: "Render", body: "Each section maps to one React Server Component. The page also ships as Markdown." },
        ],
      },
      {
        _type: "callToAction",
        _key: "inside",
        heading: "See where each section comes from",
        body: "The next page shows its sections next to the data stored for them.",
        link: { _type: "link", label: "Look inside a page", href: "/inside-a-page" },
      },
    ],
  },
  {
    title: "Inside a page: sections and their Sanity data",
    slug: "inside-a-page",
    description:
      "Each section on this page next to the JSON stored for it in Sanity: a hero, a feature grid, and a call to action.",
    sections: [
      insideHero,
      {
        _type: "codeSample",
        _key: "hero-data",
        heading: "The hero above, as data",
        filename: "page.sections[0]",
        language: "json",
        code: asData(insideHero),
      },
      insideGrid,
      {
        _type: "codeSample",
        _key: "limits-data",
        heading: "The feature grid above, as data",
        body: "Every item carries a _key, so editors can reorder items without losing track of them.",
        filename: "page.sections[2]",
        language: "json",
        code: asData(insideGrid),
      },
      {
        _type: "codeSample",
        _key: "next-data",
        heading: "The call to action below, as data",
        body: "A link is its own object type, shared by heroes and calls to action.",
        filename: "page.sections[5]",
        language: "json",
        code: asData(insideCta),
      },
      insideCta,
    ],
  },
  {
    title: "Guardrails: what the Next Fold schema checks",
    slug: "guardrails",
    description:
      "The rules the Sanity schema enforces before a page can be published: required fields, length limits, allowed sections, and link formats.",
    sections: [
      {
        _type: "hero",
        _key: "hero",
        eyebrow: "Guardrails",
        heading: "Rules that keep every page on brand",
        body: "The schema decides what an editor can publish. The limits live in code next to the components, so copy that fits the Studio also fits the layout.",
      },
      {
        _type: "featureGrid",
        _key: "rules",
        heading: "What the schema checks",
        items: [
          { _key: "required", _type: "feature", title: "Required fields", body: "A section without a heading cannot be published." },
          {
            _key: "length",
            _type: "feature",
            title: "Length limits",
            body: "Headings stop at 80 characters. Meta descriptions must run 70 to 160 characters.",
          },
          {
            _key: "allowed",
            _type: "feature",
            title: "Allowed sections",
            body: "A page accepts only the section types listed in page.ts. Nothing else appears in the Add item menu.",
          },
          {
            _key: "links",
            _type: "feature",
            title: "Link formats",
            body: "A link must be a site path or an https:// URL. Plain http and other schemes are rejected.",
          },
        ],
      },
      {
        _type: "steps",
        _key: "fail",
        heading: "When a rule fails",
        items: [
          { _key: "mark", _type: "step", title: "The Studio flags the field", body: "The field is marked and the message names the rule it broke." },
          { _key: "block", _type: "step", title: "Publishing waits", body: "Sanity does not publish a document while a validation error remains." },
          {
            _key: "fix",
            _type: "step",
            title: "The fix goes live",
            body: "Once every field passes, the page publishes and the site shows it within 60 seconds.",
          },
        ],
      },
      {
        _type: "codeSample",
        _key: "schema",
        heading: "The hero schema",
        body: "Each rule is one line of TypeScript next to its field.",
        filename: "src/sanity/schemaTypes/sections.ts",
        language: "ts",
        code: heroSchema,
      },
      {
        _type: "callToAction",
        _key: "source",
        heading: "Read the full schema",
        body: "Every section type, with its rules and Studio preview, is in one file.",
        link: { _type: "link", label: "View the source", href: "https://github.com/marcop135/nextfold/blob/main/src/sanity/schemaTypes/sections.ts" },
      },
    ],
  },
];

/** Shown until the Sanity dataset publishes the siteSettings document. */
export const seedSettings: SiteSettings = {
  nav: [
    { _key: "inside", _type: "link", label: "Inside a page", href: "/inside-a-page" },
    { _key: "guardrails", _type: "link", label: "Guardrails", href: "/guardrails" },
  ],
  footerNote: "Next Fold Headless CMS",
  projectLinks: [
    { _key: "docs", _type: "link", label: "Documentation", href: "https://github.com/marcop135/nextfold/tree/main/docs" },
    { _key: "license", _type: "link", label: "MIT license", href: "https://github.com/marcop135/nextfold/blob/main/LICENSE" },
  ],
  siteInfoLinks: [
    { _key: "privacy", _type: "link", label: "Privacy", href: "/privacy" },
    { _key: "for-agents", _type: "link", label: "For agents", href: "/for-agents" },
  ],
};
