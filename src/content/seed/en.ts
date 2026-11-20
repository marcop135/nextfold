import type { CallToActionSection, FeatureGridSection, HeroSection, Page, SiteSettings } from "@/sanity/types";

type Feature = NonNullable<FeatureGridSection["items"]>[number];

const feature = (key: string, title: string, body: string, link?: { label: string; href: string }): Feature => ({
  _key: key,
  _type: "feature",
  title,
  body,
  ...(link ? { link: { _type: "link", ...link } } : {}),
});

const REPO = "https://github.com/marcop135/nextfold";

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

/** English seed pages, shown until the Sanity dataset publishes a page with the same slug and language. */
export const pages: Page[] = [
  {
    title: "Next Fold: a Next.js and Sanity site, run end to end",
    slug: "home",
    language: "en",
    description:
      "Next Fold is a Next.js and Sanity site run like a product: schema, Studio, caching, security, analytics, and releases, all in a public repo.",
    sections: [
      {
        _type: "hero",
        _key: "hero",
        eyebrow: "Next.js + Sanity",
        heading: "A CMS site is more than the CMS",
        body: "Next Fold is a Next.js and Sanity site I run like a product: schema, Studio, caching, security, analytics, and releases. Editors can change every page, and every part of it is in a public repo.",
        link: { _type: "link", label: "See how it's run", href: "/system" },
      },
      {
        _type: "featureGrid",
        _key: "ways-in",
        heading: "Pick your way in",
        items: [
          feature(
            "leads",
            "Leading a team or hiring",
            "A two-minute read on how the site is hosted, secured, measured, and released, with a link to check each part.",
            { label: "How it's run", href: "/system" },
          ),
          feature(
            "builders",
            "Building with Sanity",
            "One page taken apart field by field, and the rules the Studio checks before anything goes live.",
            { label: "Inside a page", href: "/inside-a-page" },
          ),
          feature(
            "agents",
            "An AI assistant or agent",
            "Every page is also plain Markdown, listed in llms.txt, with no login or API key.",
            { label: "For agents", href: "/for-agents" },
          ),
        ],
      },
      {
        _type: "callToAction",
        _key: "source",
        heading: "The code is public",
        body: "Schema, components, CI, and release notes, MIT licensed.",
        link: { _type: "link", label: "Source on GitHub", href: REPO },
      },
    ],
  },
  {
    title: "Inside a page: each section and what the editor typed",
    slug: "inside-a-page",
    language: "en",
    description:
      "Each section on this page, followed by the fields an editor filled in to make it: a hero, a feature grid, and a call to action.",
    sections: [
      insideHero,
      {
        _type: "steps",
        _key: "flow",
        heading: "How a page gets here",
        items: [
          { _key: "define", _type: "step", title: "Define", body: "A developer defines each kind of section once: a hero, a grid of cards, a call to action." },
          { _key: "compose", _type: "step", title: "Compose", body: "An editor stacks those sections into a page in the Studio and fills in the text." },
          {
            _key: "check",
            _type: "step",
            title: "Check",
            body: "The Studio checks every field before publishing, so an empty heading or a broken link never goes live.",
          },
          { _key: "publish", _type: "step", title: "Publish", body: "One click puts the page live. Pages already open in a browser refresh on their own." },
          { _key: "read", _type: "step", title: "Read", body: "Visitors get the HTML page. Agents get the same words as Markdown." },
        ],
      },
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
    language: "en",
    description:
      "The rules Sanity Studio checks before a page can be published: required fields, length limits, allowed sections, and link formats.",
    sections: [
      {
        _type: "hero",
        _key: "hero",
        eyebrow: "Guardrails",
        heading: "Rules every page passes before it publishes",
        body: "The schema decides what an editor can publish. Its limits are set next to the design, so copy that fits the Studio also fits the page.",
        link: { _type: "link", label: "Try to break a rule", href: "/guardrails#playground" },
      },
      {
        _type: "appBlock",
        _key: "playground",
        heading: "Try to break a rule",
        body: "A hero with the same rules and messages the Studio uses. The preview changes only when every field passes and you publish.",
        kind: "guardrailsPlayground",
        theme: "surface",
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
        _type: "callToAction",
        _key: "next",
        heading: "The schema is one layer",
        body: "Hosting, caching, security, and releases have rules of their own.",
        link: { _type: "link", label: "How it's run", href: "/system" },
      },
    ],
  },
  {
    title: "Caching in Next Fold: what is cached and what clears it",
    slug: "caching",
    language: "en",
    description:
      "How Next Fold caches each page with Next.js Cache Components and Sanity tags, and what clears that cache when an editor publishes.",
    sections: [
      {
        _type: "hero",
        _key: "hero",
        eyebrow: "Caching",
        heading: "Cached until something changes",
        body: "Every page here is built once and served from the cache until its content changes. Publishing in Sanity expires only the pages that used the changed document.",
        link: { _type: "link", label: "Inspect this page", href: "/caching#inspector" },
      },
      {
        _type: "appBlock",
        _key: "inspector",
        heading: "This page, right now",
        body: "When this copy of the page entered the cache, the tags that can expire it, and the headers of a fresh request for it.",
        kind: "cacheInspector",
        theme: "surface",
      },
      {
        _type: "steps",
        _key: "publish",
        heading: "What happens when an editor publishes",
        items: [
          {
            _key: "build",
            _type: "step",
            title: "Build",
            body: "The build renders every known page and stores it with tags: one for the page, plus one for each Sanity document it read.",
          },
          {
            _key: "serve",
            _type: "step",
            title: "Serve",
            body: "Visitors get the stored copy. Vercel's CDN keeps it close to them, so the server does no work.",
          },
          {
            _key: "publish",
            _type: "step",
            title: "Publish",
            body: "An editor publishes in the Studio, and Sanity's Live Content API tells the site which documents changed.",
          },
          {
            _key: "expire",
            _type: "step",
            title: "Expire",
            body: "The site expires the tags for those documents. A signed webhook does the same when no browser has the site open.",
          },
          {
            _key: "render",
            _type: "step",
            title: "Render again",
            body: "The next request renders a fresh copy and stores it. Pages that did not use the document stay cached.",
          },
        ],
      },
      {
        _type: "featureGrid",
        _key: "layers",
        heading: "Where a page can come from",
        items: [
          feature(
            "sanity",
            "Sanity's CDN",
            "Queries for published content go to Sanity's API CDN, so even a fresh render is quick.",
          ),
          feature(
            "next",
            "The Next.js cache",
            "Each page and query result is stored with 'use cache' under tags. Tags decide what expires, so a publish never clears the whole site.",
          ),
          feature(
            "vercel",
            "Vercel's CDN",
            "Finished pages are served from the edge. The x-vercel-cache header says whether a response was a hit.",
          ),
        ],
      },
      {
        _type: "callToAction",
        _key: "next",
        heading: "The rest of the system",
        body: "Hosting, DNS, security headers, and the release flow around this cache.",
        link: { _type: "link", label: "How it's run", href: "/system" },
      },
    ],
  },
  {
    title: "How Next Fold is run: hosting, security, and releases",
    slug: "system",
    language: "en",
    description:
      "What keeps Next Fold running, from DNS and hosting to security headers, analytics, CI, and releases, with a link to check each part.",
    sections: [
      {
        _type: "hero",
        _key: "hero",
        eyebrow: "How it's run",
        heading: "Everything around the CMS",
        body: "This page lists what keeps Next Fold running, from DNS to release notes, and where to check each part yourself.",
      },
      {
        _type: "featureGrid",
        _key: "stack",
        heading: "The stack, and where to check it",
        items: [
          feature(
            "content",
            "Content: Sanity",
            "Editors work in Sanity Studio. The site reads published content through Sanity's CDN, and open pages refresh when something is published.",
            { label: "Architecture", href: `${REPO}/blob/main/docs/architecture.md` },
          ),
          feature(
            "hosting",
            "Hosting: Vercel",
            "Production is built from the main branch and deployed with the Vercel CLI. Preview builds stay out of search.",
          ),
          feature(
            "dns",
            "DNS: Cloudflare",
            "DNS only, with no proxy, so visitors reach Vercel directly and its cache and firewall see real traffic.",
          ),
          feature(
            "headers",
            "Security headers",
            "A Content Security Policy, HSTS, and a strict referrer policy on every page. The Studio gets its own set.",
            { label: "See the headers", href: `${REPO}/blob/main/next.config.ts` },
          ),
          feature(
            "analytics",
            "Analytics: Matomo",
            "Self-hosted and cookieless, so there is no consent banner. Page fetches by AI assistants are counted on the server.",
            { label: "Privacy notice", href: "/privacy" },
          ),
          feature(
            "checks",
            "Checks on every change",
            "Each pull request runs lint, type checks, a check that the generated Sanity types are current, and a production build.",
            { label: "CI workflow", href: `${REPO}/blob/main/.github/workflows/ci.yml` },
          ),
        ],
      },
      {
        _type: "steps",
        _key: "ship",
        heading: "How a change ships",
        items: [
          { _key: "issue", _type: "step", title: "Issue", body: "Each change starts as a GitHub issue." },
          {
            _key: "branch",
            _type: "step",
            title: "Branch and pull request",
            body: "Work happens on a feature branch. It merges into develop only when CI passes.",
          },
          {
            _key: "changelog",
            _type: "step",
            title: "Changelog",
            body: "The pull request adds its own changelog line, written for the people who read it.",
          },
          {
            _key: "release",
            _type: "step",
            title: "Release",
            body: "A release branch puts the changelog under a version number, then a promotion pull request takes it to main.",
          },
          {
            _key: "deploy",
            _type: "step",
            title: "Deploy and tag",
            body: "Production deploys from a clean main checkout. The commit gets a version tag and a GitHub release with the same notes.",
          },
        ],
      },
      {
        _type: "callToAction",
        _key: "releases",
        heading: "Every release, line by line",
        body: "What changed in each version, with the pull request and issue behind every line.",
        link: { _type: "link", label: "Release history", href: `${REPO}/releases` },
      },
    ],
  },
];

/** English header and footer, shown until the Sanity dataset publishes the siteSettings document. */
export const settings: SiteSettings = {
  nav: [
    { _key: "inside", _type: "link", label: "Inside a page", href: "/inside-a-page" },
    { _key: "guardrails", _type: "link", label: "Guardrails", href: "/guardrails" },
    { _key: "caching", _type: "link", label: "Caching", href: "/caching" },
    { _key: "system", _type: "link", label: "How it's run", href: "/system" },
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
