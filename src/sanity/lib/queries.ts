import { defineQuery } from "next-sanity";

export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    description,
    sections[]{ ... }
  }
`);

export const SITEMAP_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }
`);
