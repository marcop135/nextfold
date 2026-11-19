import { defineDocuments, defineLocations, type PresentationPluginOptions } from "sanity/presentation";

const pagePath = (slug?: string) => (slug === "home" ? "/" : `/${slug ?? ""}`);

/** Which document a URL edits, and which URLs show a document. */
export const resolve: PresentationPluginOptions["resolve"] = {
  mainDocuments: defineDocuments([
    { route: "/", filter: `_type == "page" && slug.current == "home"` },
    { route: "/:slug", filter: `_type == "page" && slug.current == $slug` },
  ]),
  locations: {
    page: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({ locations: [{ title: doc?.title || "Untitled", href: pagePath(doc?.slug) }] }),
    }),
    siteSettings: defineLocations({
      message: "The header and footer on every page",
      tone: "positive",
      locations: [{ title: "Home", href: "/" }],
    }),
  },
};
