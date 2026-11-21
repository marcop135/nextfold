import { defineQuery } from "next-sanity";

/**
 * One language at a time: the fallback to English happens in fetch-page.ts, after the seed copy in the
 * requested language. `coalesce` counts pages saved before the language field as English.
 */
export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug && coalesce(language, "en") == $language][0]{
    title,
    "slug": slug.current,
    "language": coalesce(language, "en"),
    description,
    sections[]{
      ...,
      _type == "hero" && defined(image.asset) => {
        image{ ..., asset->{ _id, url, metadata{ lqip, dimensions{ width, height } } } }
      }
    }
  }
`);

export const SITEMAP_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current) && coalesce(language, "en") == $language]{
    "slug": slug.current,
    "updatedAt": _updatedAt
  }
`);

export const SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == $id][0]{ nav, footerNote, projectLinks, siteInfoLinks }
`);
