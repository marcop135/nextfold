import Link from "next/link";
import type { ReactNode } from "react";
import { SiteHeader, type NavItem } from "@/components/SiteHeader";
import { localizeHref, localizedPath, type Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { AUTHOR, REPO_URL, SITE_NAME } from "@/lib/site";
import { getSiteSettings } from "@/sanity/lib/fetch-page";
import { getFetchOptions } from "@/sanity/lib/live";
import type { SiteSettings } from "@/sanity/types";
import { version } from "../../package.json";

function SiteLink({ link, locale }: { link: SiteSettings["nav"][number]; locale: Locale }) {
  const href = localizeHref(link.href, locale);
  return href.startsWith("/") ? <Link href={href}>{link.label}</Link> : <a href={href}>{link.label}</a>;
}

/** Header and footer from the siteSettings document for this language, with the seed settings as fallback. */
export async function SiteChrome({ children, locale }: { children: ReactNode; locale: Locale }) {
  const settings = await getSiteSettings(locale, await getFetchOptions());
  const t = getMessages(locale);
  const nav: NavItem[] = settings.nav.map(({ href, label }) => ({ href: localizeHref(href, locale), label }));
  const home = localizedPath("/", locale);
  return (
    <>
      <a className="skip-link" href="#main">
        {t.skipLink}
      </a>
      <SiteHeader nav={nav} locale={locale} labels={{ menu: t.menu, main: t.mainNav, language: t.languageNav }} />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <div className="wrap site-footer__inner">
          <div>
            <p className="footer-note">
              {settings.footerNote}
            </p>
            <p className="footer-credit">
              {t.footer.builtBy}{" "}
              <a className="footer-author" href={AUTHOR.url} title={AUTHOR.name}>
                {AUTHOR.name}
              </a>
            </p>
            <div className="footer-brand">
              <Link className="footer-mark" href={home} aria-label={t.footer.homeLabel}>
                {/* Inline, so the ink follows the page colors. The viewBox crops the icon's padding so the mark lines up with the text above. */}
                <svg viewBox="4 2 24 28" width="36" height="42" aria-hidden="true">
                  <path
                    className="footer-mark__ink"
                    d="M6.5 2H20l8 8v17.5a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 4 27.5v-23A2.5 2.5 0 0 1 6.5 2z"
                  />
                  <path className="footer-mark__fold" d="M20 2v5.5a2.5 2.5 0 0 0 2.5 2.5H28z" />
                  <rect className="footer-mark__band" x="8" y="17" width="16" height="5" />
                </svg>
              </Link>
              <a className="footer-version" href={`${REPO_URL}/releases/tag/v${version}`} title={t.footer.releaseNotes}>
                v{version}
              </a>
            </div>
          </div>
          <div className="footer-links">
            <nav className="footer-nav" aria-labelledby="footer-explore">
              <h2 className="footer-nav__heading" id="footer-explore">
                {t.footer.explore}
              </h2>
              <Link href={home}>{t.footer.home}</Link>
              {nav.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <nav className="footer-nav" aria-labelledby="footer-project">
              <h2 className="footer-nav__heading" id="footer-project">
                {t.footer.project}
              </h2>
              <a className="footer-source" href={REPO_URL}>
                <svg className="footer-source__icon" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                </svg>
                {t.footer.source}
              </a>
              {settings.projectLinks?.map((link) => (
                <SiteLink key={link._key} link={link} locale={locale} />
              ))}
            </nav>
            <nav className="footer-nav" aria-labelledby="footer-site-info">
              <h2 className="footer-nav__heading" id="footer-site-info">
                {t.footer.siteInfo}
              </h2>
              {settings.siteInfoLinks?.map((link) => (
                <SiteLink key={link._key} link={link} locale={locale} />
              ))}
              <a href="/llms.txt">llms.txt</a>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}
