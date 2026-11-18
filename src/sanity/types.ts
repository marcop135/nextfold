/**
 * App-facing names for the types Sanity TypeGen writes to `sanity.types.ts`.
 * Regenerate with `npm run typegen` after a schema or query change; CI fails when the output drifts.
 */
import type { CallToAction, CodeSample, FeatureGrid, Hero, PAGE_QUERY_RESULT, Steps } from "./sanity.types";

export type { Link } from "./sanity.types";

type Keyed<T> = T & { _key: string };

export type HeroSection = Keyed<Hero>;
export type FeatureGridSection = Keyed<FeatureGrid>;
export type StepsSection = Keyed<Steps>;
export type CodeSampleSection = Keyed<CodeSample>;
export type CallToActionSection = Keyed<CallToAction>;

export type Page = NonNullable<PAGE_QUERY_RESULT>;
export type Section = NonNullable<Page["sections"]>[number];

export type ContentSource = "sanity" | "seed";
