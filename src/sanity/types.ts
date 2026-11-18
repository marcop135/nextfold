export type Link = { label: string; href: string };

export type HeroSection = {
  _type: "hero";
  _key: string;
  eyebrow?: string;
  heading: string;
  body?: string;
  cta?: Link;
};

export type FeatureGridSection = {
  _type: "featureGrid";
  _key: string;
  heading: string;
  items?: { _key: string; title: string; body?: string }[];
};

export type StepsSection = {
  _type: "steps";
  _key: string;
  heading: string;
  items?: { _key: string; title: string; body?: string }[];
};

export type CodeSampleSection = {
  _type: "codeSample";
  _key: string;
  heading: string;
  body?: string;
  filename: string;
  language: "json" | "ts" | "groq" | "bash";
  code: string;
};

export type CallToActionSection = {
  _type: "callToAction";
  _key: string;
  heading: string;
  body?: string;
  link: Link;
};

export type Section = HeroSection | FeatureGridSection | StepsSection | CodeSampleSection | CallToActionSection;

export type Page = {
  title: string;
  slug: string;
  description: string;
  sections?: Section[];
};

export type ContentSource = "sanity" | "seed";
