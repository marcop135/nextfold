import type { CallToActionSection, FeatureGridSection, HeroSection, Page, SiteSettings } from "@/sanity/types";

type Feature = NonNullable<FeatureGridSection["items"]>[number];

const feature = (key: string, title: string, body: string): Feature => ({ _key: key, _type: "feature", title, body });

/** '"Inside", 6 of 40 characters', or only the count when the text would not fit on a card. */
function filled(value: string, max: number, required: boolean): string {
  const shown = value.length <= 60 ? `"${value}", ` : "";
  return `${shown}${value.length} of ${max} characters. ${required ? "Required." : "Optional."}`;
}

const insideHero: HeroSection = {
  _type: "hero",
  _key: "hero",
  eyebrow: "Inside",
  heading: "One page, taken apart",
  body: "Every section here is followed by what an editor typed into the Studio to make it. Both come from the same record, so they always match.",
};

const insideGrid: FeatureGridSection = {
  _type: "featureGrid",
  _key: "limits",
  heading: "What a feature grid holds",
  items: [
    feature("heading", "One heading", "Required, up to 80 characters."),
    feature("count", "Two to six cards", "The Studio does not accept fewer than two cards or more than six."),
    feature("fields", "A title and a body per card", "Titles stop at 60 characters, bodies at 200."),
  ],
};

const insideCta: CallToActionSection = {
  _type: "callToAction",
  _key: "next",
  heading: "Where these limits come from",
  body: "Guardrails lists what the Studio checks before an editor can publish.",
  link: { _type: "link", label: "See the guardrails", href: "/guardrails" },
};

/** Shown until the Sanity dataset publishes a page with the same slug. */
export const seedPages: Page[] = [
  {
    title: "Next Fold: pages built from sections that hold their shape",
    slug: "home",
    description:
      "Next Fold is a Next.js and Sanity demo. Editors build pages from sections in Sanity Studio, and each section has rules that keep the page in shape.",
    sections: [
      {
        _type: "hero",
        _key: "hero",
        eyebrow: "Next.js + Sanity",
        heading: "Editors build the page. The schema keeps it in shape.",
        body: "Every page on this site is a stack of sections. Editors write and arrange them in Sanity Studio, and each kind of section has rules, so what they publish still fits the design.",
        link: { _type: "link", label: "See how a page is built", href: "/inside-a-page" },
      },
      {
        _type: "featureGrid",
        _key: "owners",
        heading: "Who does what",
        items: [
          feature("editors", "Editors", "Write the copy, choose the sections, and publish without waiting for a developer or a deploy."),
          feature("developers", "Developers", "Decide which sections exist, what each one may hold, and how it looks on the page."),
          feature(
            "readers",
            "Readers and agents",
            "Read the same page in a browser or as plain Markdown, which AI assistants can fetch directly.",
          ),
        ],
      },
      {
        _type: "steps",
        _key: "flow",
        heading: "How a page gets here",
        items: [
          { _key: "define", _type: "step", title: "Design the pieces", body: "A developer defines each kind of section once: a hero, a grid of cards, a call to action." },
          { _key: "edit", _type: "step", title: "Compose", body: "An editor stacks those sections into a page in the Studio and fills in the text." },
          {
            _key: "check",
            _type: "step",
            title: "Check",
            body: "The Studio checks every field before publishing, so an empty heading or a broken link never goes live.",
          },
          { _key: "publish", _type: "step", title: "Publish", body: "One click puts the page live. Pages already open in a browser refresh on their own." },
          { _key: "render", _type: "step", title: "Read", body: "Visitors get a fast page. Agents get the same words as Markdown." },
        ],
      },
      {
        _type: "callToAction",
        _key: "inside",
        heading: "See where each section comes from",
        body: "The next page takes itself apart, one section at a time.",
        link: { _type: "link", label: "Look inside a page", href: "/inside-a-page" },
      },
    ],
  },
  {
    title: "Inside a page: each section and what the editor typed",
    slug: "inside-a-page",
    description:
      "Each section on this page, followed by the fields an editor filled in to make it: a hero, a feature grid, and a call to action.",
    sections: [
      insideHero,
      {
        _type: "featureGrid",
        _key: "hero-fields",
        heading: "Behind the hero: what the editor filled in",
        theme: "surface",
        items: [
          feature("eyebrow", "Eyebrow", filled(insideHero.eyebrow ?? "", 40, false)),
          feature("heading", "Heading", filled(insideHero.heading, 80, true)),
          feature("body", "Body", filled(insideHero.body ?? "", 240, false)),
        ],
      },
      insideGrid,
      {
        _type: "featureGrid",
        _key: "grid-fields",
        heading: "Behind the grid: what the editor filled in",
        theme: "surface",
        items: [
          feature("heading", "Heading", filled(insideGrid.heading, 80, true)),
          feature("cards", "Cards", `${insideGrid.items?.length ?? 0} cards, each with a title and a body. Editors can drag them into a new order.`),
        ],
      },
      {
        _type: "featureGrid",
        _key: "cta-fields",
        heading: "Behind the next section: what the editor filled in",
        theme: "surface",
        items: [
          feature("heading", "Heading", filled(insideCta.heading, 80, true)),
          feature("body", "Body", filled(insideCta.body ?? "", 200, false)),
          feature("link", "Link", `"${insideCta.link.label}", pointing to ${insideCta.link.href}. Required.`),
        ],
      },
      insideCta,
    ],
  },
  {
    title: "Guardrails: what the Next Fold schema checks",
    slug: "guardrails",
    description:
      "The rules Sanity Studio checks before a page can be published: required fields, length limits, allowed sections, and link formats.",
    sections: [
      {
        _type: "hero",
        _key: "hero",
        eyebrow: "Guardrails",
        heading: "Rules every page passes before it publishes",
        body: "The schema decides what an editor can publish. Its limits are set next to the design, so copy that fits the Studio also fits the page.",
      },
      {
        _type: "featureGrid",
        _key: "rules",
        heading: "What the Studio checks",
        items: [
          feature("required", "Required fields", "A section without a heading cannot be published."),
          feature("length", "Length limits", "Headings stop at 80 characters. Page descriptions for search run 70 to 160 characters."),
          feature("allowed", "Allowed sections", "A page accepts only the section types the developers allow. Nothing else shows up in the Add menu."),
          feature("links", "Link formats", "A link is a path on this site or an https:// address. Anything else is turned away."),
        ],
      },
      {
        _type: "steps",
        _key: "fail",
        heading: "When a rule fails",
        items: [
          { _key: "mark", _type: "step", title: "The Studio flags the field", body: "The field turns red and the message says which rule it broke." },
          { _key: "block", _type: "step", title: "Publishing waits", body: "The Publish button stays off while any field fails." },
          { _key: "fix", _type: "step", title: "The fix goes live", body: "Once every field passes, the page publishes and open pages refresh." },
        ],
      },
      {
        _type: "featureGrid",
        _key: "hero-rules",
        heading: "The hero's rules, in plain words",
        theme: "surface",
        items: [
          feature("heading", "Heading", "Required. Up to 80 characters."),
          feature("text", "Eyebrow and body", "Optional. The eyebrow stops at 40 characters, the body at 240, about two sentences."),
          feature("image", "Image", "Optional. Once an image is added, it needs a description for screen readers."),
          feature("link", "Call to action", "Optional. A label and a path on this site or an https:// address."),
        ],
      },
      {
        _type: "callToAction",
        _key: "source",
        heading: "Read the full schema",
        body: "Every section type and its rules live in one file on GitHub.",
        link: { _type: "link", label: "View the schema on GitHub", href: "https://github.com/marcop135/nextfold/blob/main/src/sanity/schemaTypes/sections.ts" },
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
