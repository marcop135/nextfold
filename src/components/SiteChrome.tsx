import Link from "next/link";
import type { ReactNode } from "react";
import { AUTHOR, SITE_NAME } from "@/lib/site";

const nav = [
  { href: "/for-agents", label: "For agents" },
  { href: "/privacy", label: "Privacy" },
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
          <p>
            Built by <a href={AUTHOR.url}>{AUTHOR.name}</a> with Next.js and Sanity.
          </p>
          <ul className="nav-list">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </>
  );
}
