import { defineQuery } from "next-sanity";

/**
 * One language at a time: the fallback to English happens in fetch-page.ts, after the seed copy in the
 * requested language. `coalesce` counts pages saved before the language field as English. Every section
 * names its fields, so a field added to the schema reaches the page only once the query asks for it.
 */
export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug && coalesce(language, "en") == $language][0]{
    title,
    "slug": slug.current,
    "language": coalesce(language, "en"),
    description,
    seo{ title, noIndex },
    sections[]{
      _key,
      _type,
      _type == "hero" => {
        eyebrow, heading, body, link{ label, href }, theme, spacing,
        image{ alt, hotspot, crop, "asset": asset->{ _id, url, metadata{ lqip, dimensions{ width, height } } } }
      },
      _type == "featureGrid" => {
        heading, theme, spacing,
        items[]{ _key, title, body, link{ label, href } }
      },
      _type == "steps" => {
        heading, theme, spacing,
        items[]{ _key, title, body }
      },
      _type == "codeSample" => { heading, body, filename, language, code, theme, spacing },
      _type == "appBlock" => { heading, body, kind, theme, spacing },
      _type == "callToAction" => { heading, body, link{ label, href }, theme, spacing }
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
