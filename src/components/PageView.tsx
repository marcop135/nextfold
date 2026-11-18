import type { LoadedPage } from "@/sanity/lib/fetch-page";
import { pageJsonLd } from "@/lib/site";
import { HeroVisual } from "./HeroVisual";
import { JsonLd } from "./JsonLd";
import { SectionRenderer } from "./SectionRenderer";

export function PageView({ loaded, path }: { loaded: LoadedPage; path: string }) {
  const { page, source } = loaded;
  const sections = page.sections ?? [];
  const startsWithHero = sections[0]?._type === "hero";
  return (
    <>
      {startsWithHero ? null : (
        <div className="wrap">
          <h1 className="page-title">{page.title}</h1>
        </div>
      )}
      <SectionRenderer sections={sections} heroVisual={path === "/" ? <HeroVisual /> : undefined} />
      <p className="wrap source-note">
        Content source: <code>{source}</code>
      </p>
      <JsonLd
        data={pageJsonLd({
          path,
          title: page.title,
          description: page.description,
          crumbs: path === "/" ? [] : [{ name: page.title, path }],
        })}
      />
    </>
  );
}
