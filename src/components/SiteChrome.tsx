import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { AUTHOR, REPO_URL, SITE_NAME } from "@/lib/site";
import { version } from "../../package.json";

const nav = [
  { href: "/anatomy", label: "Anatomy of a page" },
  { href: "/guardrails", label: "Guardrails" },
];

const projectLinks = [
  { href: `${REPO_URL}/tree/main/docs`, label: "Documentation" },
  { href: `${REPO_URL}/blob/main/LICENSE`, label: "MIT license" },
  { href: "https://nextstory.marcopontili.com", label: "Next Story, the Storyblok version" },
];

const siteInfoLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/for-agents", label: "For agents" },
];

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="wrap site-header__inner">
          <Link href="/" className="brand">
            <span className="brand__mark" aria-hidden="true" />
            {SITE_NAME}
          </Link>
          <nav aria-label="Main">
            <ul className="nav-list">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <div className="wrap site-footer__inner">
          <div>
            <p className="footer-note">
              {SITE_NAME}: marketing pages from typed Sanity sections{" "}
              <span className="footer-version">v{version}</span>
            </p>
            <p>
              Built and maintained by <a href={AUTHOR.url}>{AUTHOR.name}</a>
            </p>
            <Link className="footer-mark" href="/" aria-label={`${SITE_NAME} home`}>
              <Image src="/icon.svg" alt="" width={48} height={48} unoptimized />
            </Link>
          </div>
          <div className="footer-links">
            <nav className="footer-nav" aria-labelledby="footer-explore">
              <h2 className="footer-nav__heading" id="footer-explore">
                Explore
              </h2>
              <Link href="/">Home</Link>
              {nav.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <nav className="footer-nav" aria-labelledby="footer-project">
              <h2 className="footer-nav__heading" id="footer-project">
                Project
              </h2>
              <a className="footer-source" href={REPO_URL}>
                <svg className="footer-source__icon" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                </svg>
                View the source
              </a>
              {projectLinks.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
            <nav className="footer-nav" aria-labelledby="footer-site-info">
              <h2 className="footer-nav__heading" id="footer-site-info">
                Site info
              </h2>
              {siteInfoLinks.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
              <a href="/llms.txt">llms.txt</a>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}
