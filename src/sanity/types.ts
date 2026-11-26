/**
 * App-facing names for the types Sanity TypeGen writes to `sanity.types.ts`.
 * Regenerate with `npm run typegen` after a schema or query change; CI fails when the output drifts.
 */
import type { PAGE_QUERY_RESULT, SETTINGS_QUERY_RESULT } from "./sanity.types";

export type { Link } from "./sanity.types";

export type Page = NonNullable<PAGE_QUERY_RESULT>;
export type Section = NonNullable<Page["sections"]>[number];
/** From the query, not the schema: PAGE_QUERY names each section's fields and dereferences the hero image asset. */
export type HeroSection = Extract<Section, { _type: "hero" }>;
export type FeatureGridSection = Extract<Section, { _type: "featureGrid" }>;
export type StepsSection = Extract<Section, { _type: "steps" }>;
export type CodeSampleSection = Extract<Section, { _type: "codeSample" }>;
export type AppBlockSection = Extract<Section, { _type: "appBlock" }>;
export type CallToActionSection = Extract<Section, { _type: "callToAction" }>;

/**
 * Seed copy is written the way an editor leaves a document: an empty field is absent and a value may
 * carry its schema `_type`. The query returns the same field as `null`. Required fields stay required.
 */
type Authored<T> = T extends readonly (infer U)[]
  ? Authored<U>[]
  : T extends object
    ? { [K in keyof T as null extends T[K] ? never : K]: Authored<T[K]> } & {
        [K in keyof T as null extends T[K] ? K : never]?: Authored<NonNullable<T[K]>>;
      } & { _type?: string }
    : T;

export type SeedPage = Authored<Page>;
export type SeedSection = NonNullable<SeedPage["sections"]>[number];
export type SeedHeroSection = Extract<SeedSection, { _type: "hero" }>;
export type SeedFeatureGridSection = Extract<SeedSection, { _type: "featureGrid" }>;
export type SeedCallToActionSection = Extract<SeedSection, { _type: "callToAction" }>;

export type SiteSettings = NonNullable<SETTINGS_QUERY_RESULT>;

export type ContentSource = "sanity" | "seed";
