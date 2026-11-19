import { defineQuery } from "next-sanity";

/** Heroes saved before the rename-hero-cta-to-link migration still store their link as `cta`; drop that line once it has run. */
export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    description,
    sections[]{
      ...,
      _type == "hero" && !defined(link) && defined(cta) => { "link": cta },
      _type == "hero" && defined(image.asset) => {
        image{ ..., asset->{ _id, url, metadata{ lqip, dimensions{ width, height } } } }
      }
    }
  }
`);

export const SITEMAP_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }
`);

export const SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{ nav, footerNote, projectLinks, siteInfoLinks }
`);
