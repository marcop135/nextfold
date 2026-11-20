/**
 * Site languages. English lives at the root, German under /de. Ported from Next Story's helpers
 * (marcop135/nextstory src/lib/i18n.ts), with Markdown twins added.
 */
export const locales = ["en", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const LOCALE_NAMES: Record<Locale, { short: string; name: string; og: string; hreflang: string }> = {
  en: { short: "EN", name: "English", og: "en_US", hreflang: "en" },
  de: { short: "DE", name: "Deutsch", og: "de_DE", hreflang: "de" },
};

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Locale from the first path segment: /de/guardrails → de, anything else → en. */
export function localeForPathname(pathname: string): Locale {
  const first = pathname.split("/")[1] ?? "";
  return isLocale(first) && first !== defaultLocale ? first : defaultLocale;
}

/** The path without its locale prefix: /de/guardrails → /guardrails, /de → /. */
export function stripLocale(pathname: string): string {
  const locale = localeForPathname(pathname);
  if (locale === defaultLocale) return pathname || "/";
  return pathname.slice(locale.length + 1) || "/";
}

/** A locale-neutral path in a given language: (/guardrails, de) → /de/guardrails, (/, de) → /de. */
export function localizedPath(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** The same page in another language. Every page exists in both, with the same slug. */
export function switchLocalePath(pathname: string, target: Locale): string {
  return localizedPath(stripLocale(pathname), target);
}

/** hreflang map for a locale-neutral path, x-default pointing at English. */
export function hreflangAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((locale) => [LOCALE_NAMES[locale].hreflang, localizedPath(path, locale)])),
    "x-default": localizedPath(path, defaultLocale),
  };
}

/** Paths that are not pages: they exist once, for every language. */
const SHARED_ROOTS = new Set(["studio", "api", "og", "md"]);

/** A page path inside this site gets the locale prefix; external URLs, files, and shared routes stay as they are. */
export function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//") || localeForPathname(href) !== defaultLocale) return href;
  const pathOnly = href.split(/[?#]/)[0];
  if (pathOnly.includes(".") || SHARED_ROOTS.has(pathOnly.split("/")[1] ?? "")) return href;
  const [path, hash] = href.split("#");
  const target = localizedPath(path || "/", locale);
  return hash !== undefined ? `${target}#${hash}` : target;
}
