import { at, defineMigration, setIfMissing, unset } from "sanity/migrate";

/**
 * Renames the hero's `cta` field to `link`, the name the call to action section already uses.
 * Dry run (the default): npx sanity migration run rename-hero-cta-to-link
 * Apply: npx sanity migration run rename-hero-cta-to-link --no-dry-run
 * PAGE_QUERY maps a stored cta to link until then, so deploy order does not matter. Drop that mapping once the run is applied.
 */
export default defineMigration({
  title: "Rename hero cta to link",
  documentTypes: ["page"],
  // The base filter keeps the run to pages whose sections still hold a hero with `cta`.
  filter: 'count(sections[_type == "hero" && defined(cta)]) > 0',
  migrate: {
    object(node) {
      if (node._type !== "hero" || node.cta == null) return;
      return [at("link", setIfMissing(node.cta)), at("cta", unset())];
    },
  },
});
