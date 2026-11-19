import { stegaClean } from "next-sanity";
import type { LoadedPage } from "@/sanity/lib/fetch-page";
import { pageJsonLd } from "@/lib/site";
import { HeroVisual } from "./HeroVisual";
import { JsonLd } from "./JsonLd";
import { SectionRenderer } from "./SectionRenderer";

export function PageView({ loaded, path }: { loaded: LoadedPage; path: string }) {
  const { page, source } = loaded;
  const sections = page.sections ?? [];
  const startsWithHero = sections[0]?._type === "hero";
  // Draft mode encodes field paths into strings; structured data gets the plain text.
  const title = stegaClean(page.title);
  return (
    <>
      {startsWithHero ? null : (
        <div className="wrap">
          <h1 className="page-title">{page.title}</h1>
        </div>
      )}
      <SectionRenderer
        sections={sections}
        heroVisual={
          path === "/" ? (
            <HeroVisual
              sections={sections.map((section) => ({
                key: section._key,
                type: stegaClean(section._type),
                heading: stegaClean(section.heading),
              }))}
            />
          ) : undefined
        }
      />
      <p className="wrap source-note">
        {source === "sanity"
          ? "This page comes from the Sanity dataset."
          : "This page comes from the seed copy bundled with the site, until the Sanity dataset publishes its own version."}
      </p>
      <JsonLd
        data={pageJsonLd({
          path,
          title,
          description: stegaClean(page.description),
          crumbs: path === "/" ? [] : [{ name: title, path }],
        })}
      />
    </>
  );
}
