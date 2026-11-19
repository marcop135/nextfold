import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId, studioUrl } from "../env";

/** Stega is off by default; sanityFetch turns it on in draft mode so Visual Editing can map text to fields. */
export const client = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published", stega: { studioUrl } })
  : null;
