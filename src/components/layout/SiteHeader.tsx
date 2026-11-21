"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LOCALE_NAMES, localizedPath, locales, switchLocalePath, type Locale } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/site";

export type NavItem = { href: string; label: string };

/** EN, DE: the current language as text, the other as a full-page link to the same page in it. */
function LanguageSwitch({ locale, pathname, label }: { locale: Locale; pathname: string; label: string }) {
  return (
    <ul className="lang-switch" aria-label={label}>
      {locales.map((item) => {
        const { short, name } = LOCALE_NAMES[item];
        return (
          <li key={item}>
            {item === locale ? (
              <span aria-current="true" lang={item} title={name}>
                <span aria-hidden="true">{short}</span>
                <span className="visually-hidden">{name}</span>
              </span>
            ) : (
              // A plain link: each language has its own root layout, which a client-side navigation cannot swap.
              <a href={switchLocalePath(pathname, item)} hrefLang={item} lang={item} title={name}>
                <span aria-hidden="true">{short}</span>
                <span className="visually-hidden">{name}</span>
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function SiteHeader({
  nav,
  locale,
  labels,
}: {
  nav: NavItem[];
  locale: Locale;
  labels: { menu: string; main: string; language: string };
}) {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [previousPathname, setPreviousPathname] = useState(pathname);
  const toggle = useRef<HTMLButtonElement>(null);

  // Close the small-screen menu after navigating or on Escape.
  if (pathname !== previousPathname) {
    setPreviousPathname(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    // Focus returns to the toggle, since the focused menu link is about to hide.
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <Link href={localizedPath("/", locale)} className="brand">
          {SITE_NAME}
        </Link>
        <LanguageSwitch locale={locale} pathname={pathname} label={labels.language} />
        <button
          ref={toggle}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen(!open)}
        >
          <span className="menu-toggle__icon" aria-hidden="true" />
          <span className="visually-hidden">{labels.menu}</span>
        </button>
        <nav id="site-nav" className="site-nav" data-open={open} aria-label={labels.main}>
          <ul className="nav-list">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
