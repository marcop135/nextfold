import type { Locale } from "@/lib/i18n";
import type { Page, SiteSettings } from "@/sanity/types";
import * as de from "./de";
import * as en from "./en";

/** Bundled copy per language, shown until the Sanity dataset publishes its own version. */
export const seedPages: Record<Locale, Page[]> = { en: en.pages, de: de.pages };
export const seedSettings: Record<Locale, SiteSettings> = { en: en.settings, de: de.settings };
