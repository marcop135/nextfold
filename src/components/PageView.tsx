import { stegaClean } from "next-sanity";
import { localizedPath, type Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { pageJsonLd } from "@/lib/site";
import type { LoadedPage } from "@/sanity/lib/fetch-page";
import { HeroVisual } from "./HeroVisual";
import { JsonLd } from "./JsonLd";
import { SectionRenderer } from "./SectionRenderer";

/** `path` is locale-neutral; `locale` is the URL's language, `loaded.locale` the language the content is in. */
export function PageView({ loaded, path, locale }: { loaded: LoadedPage; path: string; locale: Locale }) {
  const { page, source, cachedAt } = loaded;
  const t = getMessages(locale);
  const sections = page.sections ?? [];
  const startsWithHero = sections[0]?._type === "hero";
  const fallback = loaded.locale !== locale;
  // Draft mode encodes field paths into strings; structured data gets the plain text.
  const title = stegaClean(page.title);
  return (
    <>
      <div lang={fallback ? loaded.locale : undefined}>
        {startsWithHero ? null : (
          <div className="wrap">
            <h1 className="page-title">{page.title}</h1>
          </div>
        )}
        <SectionRenderer
          sections={sections}
          locale={locale}
          context={{ path: localizedPath(path, locale), slug: path === "/" ? "home" : path.slice(1), cachedAt, source }}
          heroVisual={
            path === "/" ? (
              <HeroVisual
                locale={locale}
                // The first three sections keep the Studio pane short enough to read at a glance.
                sections={sections.slice(0, 3).map((section) => ({
                  key: section._key,
                  type: stegaClean(section._type),
                  heading: stegaClean(section.heading),
                }))}
              />
            ) : undefined
          }
        />
      </div>
      <p className="wrap source-note">
        {fallback ? `${t.source.fallback} ` : null}
        {source === "sanity" ? t.source.sanity : t.source.seed}
      </p>
      <JsonLd
        data={pageJsonLd({
          path,
          title,
          description: stegaClean(page.description),
          crumbs: path === "/" ? [] : [{ name: title, path }],
          locale,
          homeName: t.footer.home,
        })}
      />
    </>
  );
}
