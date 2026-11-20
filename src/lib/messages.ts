import type { Locale } from "./i18n";
import type { Messages as RuleMessages } from "./rules";

/**
 * Interface strings. Page copy lives in Sanity and src/content; these are the words around it.
 * `de` is typed against `en`, so a missing or extra key fails `npm run typecheck`.
 */
const en = {
  skipLink: "Skip to content",
  menu: "Menu",
  mainNav: "Main",
  languageNav: "Language",
  footer: {
    explore: "Explore",
    project: "Project",
    siteInfo: "Site info",
    home: "Home",
    source: "View the source",
    builtBy: "Built and maintained by",
    homeLabel: "Next Fold home",
    releaseNotes: "Release notes for this version",
  },
  source: {
    sanity: "This page comes from the Sanity dataset.",
    seed: "This page comes from the seed copy bundled with the site, until the Sanity dataset publishes its own version.",
    fallback: "This page has no German version yet, so it shows the English one.",
  },
  draftBar: { text: "Draft mode: this page shows unpublished changes.", exit: "Exit draft mode" },
  notFound: {
    title: "Page not found",
    body: "This address has no page. It may have moved, or the link may have a typo.",
    home: "Home",
    agents: "For agents",
    agentsNote: ": Markdown versions and discovery files",
  },
  heroVisual: {
    studio: "Sanity Studio",
    doc: "Home page",
    published: "Published",
    draft: "Draft",
    caption: "Sanity Studio on the left, the page it builds on the right.",
    demo: "Demo",
    hint: " Move a section and publish: it's a demo, nothing goes live.",
    publish: "Publish",
    discard: "Discard",
    publishedNow: "Published in the demo. The sketch shows the new order; the real page is unchanged.",
    discarded: "Changes discarded. The rows match the published page again.",
    moveUp: (title: string) => `Move ${title} up`,
    moveDown: (title: string) => `Move ${title} down`,
    moved: (title: string, position: number, total: number) => `${title} moved to position ${position} of ${total}.`,
    types: {
      hero: "Hero",
      featureGrid: "Feature grid",
      steps: "Steps",
      codeSample: "Code sample",
      appBlock: "App block",
      callToAction: "Call to action",
    } as Record<string, string>,
  },
  playground: {
    formTitle: "Hero, as the editor sees it",
    previewTitle: "Live on the page",
    required: " (required)",
    labels: { eyebrow: "Eyebrow", heading: "Heading", body: "Body", label: "Link label", href: "Link URL" },
    hrefHint: "A path such as /contact or a full https:// URL.",
    publish: "Publish",
    breakRules: "Break three rules",
    reset: "Reset",
    statusFailing: (count: number) => (count === 1 ? "One field fails, so Publish stays off." : `${count} fields fail, so Publish stays off.`),
    statusReady: "Every field passes. Publish puts this version live.",
    statusLive: "Live and unchanged.",
    note: "The page changes only when every field passes and you publish.",
    start: {
      eyebrow: "Guardrails",
      heading: "Rules every page passes before it publishes",
      body: "Change any field. The Studio runs these same checks before an editor can publish.",
      label: "How it's run",
    },
    broken: { eyebrow: "A label far too long for the small line above a heading" },
  },
  rules: {
    required: (label: string) => `${label} is required.`,
    tooLong: (label: string, max: number) => `${label} stops at ${max} characters.`,
    tooShort: (label: string, min: number) => `${label} needs at least ${min} characters.`,
    href: "Start with / or https://",
  } satisfies RuleMessages,
  cache: {
    entered: "Entered the cache",
    expires: "Expires when",
    expiresBody: (tag: string) => `The tag ${tag} or a Sanity document tag on it is expired: by the Live Content API on publish, or by the publish webhook.`,
    from: "Content from",
    fromSanity: "The Sanity dataset",
    fromSeed: "The seed copy bundled with the site",
    fresh: (path: string) => `A fresh request for ${path}`,
    again: "Request again",
    requesting: "Requesting…",
    header: "Header",
    value: "Value",
    meaning: "Meaning",
    caption: (time: string) => `Response headers, requested at ${time}`,
    none: "The response carried no cache headers: this server runs in development mode, which skips the cache.",
    pick: "Page",
    history: "Your requests, newest first",
    tryTitle: "Try it",
    tryBody: "Request a page twice: the second answer comes from the cache and is usually faster. A page no one has opened since it last changed shows a MISS first.",
    noHeader: "no cache header",
    meanings: {
      "x-vercel-cache": "HIT: served from Vercel's CDN. MISS or STALE: the server rendered or refreshed it.",
      "x-nextjs-cache": "The Next.js cache, when no CDN sits in front (local and self-hosted runs).",
      age: "Seconds the CDN has held this copy.",
      "cache-control": "How long browsers and CDNs may keep it.",
      date: "When the server sent this response.",
    } as Record<string, string>,
    dateLocale: "en-GB",
  },
};

export type UiMessages = typeof en;

type Shape<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => R
    : T[K] extends Record<string, string>
      ? Record<string, string>
      : T[K] extends object
        ? Shape<T[K]>
        : string;
};

const de: Shape<UiMessages> = {
  skipLink: "Zum Inhalt springen",
  menu: "Menü",
  mainNav: "Hauptnavigation",
  languageNav: "Sprache",
  footer: {
    explore: "Entdecken",
    project: "Projekt",
    siteInfo: "Über die Website",
    home: "Start",
    source: "Quellcode ansehen",
    builtBy: "Gebaut und betreut von",
    homeLabel: "Startseite von Next Fold",
    releaseNotes: "Release Notes dieser Version (auf Englisch)",
  },
  source: {
    sanity: "Diese Seite kommt aus dem Sanity-Datensatz.",
    seed: "Diese Seite kommt aus den Startinhalten, die mit der Website ausgeliefert werden, bis der Sanity-Datensatz eine eigene Version veröffentlicht.",
    fallback: "Diese Seite gibt es noch nicht auf Deutsch, daher steht hier die englische Version.",
  },
  draftBar: { text: "Entwurfsmodus: Diese Seite zeigt unveröffentlichte Änderungen.", exit: "Entwurfsmodus beenden" },
  notFound: {
    title: "Seite nicht gefunden",
    body: "Unter dieser Adresse gibt es keine Seite. Vielleicht wurde sie verschoben, oder der Link enthält einen Tippfehler.",
    home: "Startseite",
    agents: "Für Agenten",
    agentsNote: ": Markdown-Versionen und Dateien zum Auffinden der Seiten",
  },
  heroVisual: {
    studio: "Sanity Studio",
    doc: "Startseite",
    published: "Veröffentlicht",
    draft: "Entwurf",
    caption: "Links das Sanity Studio, rechts die Seite, die daraus entsteht.",
    demo: "Demo",
    hint: " Abschnitt verschieben und veröffentlichen: eine Demo, nichts geht live.",
    publish: "Veröffentlichen",
    discard: "Verwerfen",
    publishedNow: "In der Demo veröffentlicht. Die Skizze zeigt die neue Reihenfolge, die echte Seite bleibt unverändert.",
    discarded: "Änderungen verworfen. Die Zeilen entsprechen wieder der veröffentlichten Seite.",
    moveUp: (title: string) => `${title} nach oben verschieben`,
    moveDown: (title: string) => `${title} nach unten verschieben`,
    moved: (title: string, position: number, total: number) => `${title} steht jetzt an Position ${position} von ${total}.`,
    types: {
      hero: "Hero",
      featureGrid: "Kachelraster",
      steps: "Schritte",
      codeSample: "Codebeispiel",
      appBlock: "App-Block",
      callToAction: "Call to Action",
    },
  },
  playground: {
    formTitle: "Der Hero, wie die Redaktion ihn sieht",
    previewTitle: "Live auf der Seite",
    required: " (Pflichtfeld)",
    labels: { eyebrow: "Dachzeile", heading: "Überschrift", body: "Text", label: "Linktext", href: "Link-URL" },
    hrefHint: "Ein Pfad wie /kontakt oder eine vollständige https://-URL.",
    publish: "Veröffentlichen",
    breakRules: "Drei Regeln brechen",
    reset: "Zurücksetzen",
    statusFailing: (count: number) =>
      count === 1
        ? "Ein Feld verletzt eine Regel, deshalb bleibt „Veröffentlichen“ gesperrt."
        : `${count} Felder verletzen eine Regel, deshalb bleibt „Veröffentlichen“ gesperrt.`,
    statusReady: "Alle Felder sind gültig. „Veröffentlichen“ stellt diese Version live.",
    statusLive: "Live und unverändert.",
    note: "Die Seite ändert sich erst, wenn alle Felder gültig sind und Sie veröffentlichen.",
    start: {
      eyebrow: "Leitplanken",
      heading: "Regeln, die jede Seite vor dem Veröffentlichen erfüllt",
      body: "Ändern Sie ein beliebiges Feld. Das Studio führt dieselben Prüfungen aus, bevor die Redaktion veröffentlichen kann.",
      label: "So läuft der Betrieb",
    },
    broken: { eyebrow: "Eine Dachzeile, die für die kleine Zeile über der Überschrift viel zu lang ist" },
  },
  rules: {
    required: (label: string) => `${label} ist ein Pflichtfeld.`,
    tooLong: (label: string, max: number) => `${label}: höchstens ${max} Zeichen.`,
    tooShort: (label: string, min: number) => `${label}: mindestens ${min} Zeichen.`,
    href: "Mit / oder https:// beginnen",
  },
  cache: {
    entered: "Im Cache seit",
    expires: "Läuft ab",
    expiresBody: (tag: string) =>
      `Wenn das Tag ${tag} oder ein Sanity-Dokument-Tag dieser Seite abläuft, ausgelöst durch die Live Content API beim Veröffentlichen oder durch den Publish-Webhook.`,
    from: "Herkunft des Inhalts",
    fromSanity: "Sanity-Datensatz",
    fromSeed: "Startinhalte, die mit der Website ausgeliefert werden",
    fresh: (path: string) => `Eine neue Anfrage an ${path}`,
    again: "Erneut anfragen",
    requesting: "Anfrage läuft …",
    header: "Header",
    value: "Wert",
    meaning: "Bedeutung",
    caption: (time: string) => `Response-Header, angefragt um ${time}`,
    none: "Die Antwort enthielt keine Cache-Header: Dieser Server läuft im Entwicklungsmodus, der den Cache überspringt.",
    pick: "Seite",
    history: "Ihre Anfragen, neueste zuerst",
    tryTitle: "Ausprobieren",
    tryBody: "Fragen Sie eine Seite zweimal an: Die zweite Antwort kommt aus dem Cache und ist meist schneller. Eine Seite, die seit ihrer letzten Änderung niemand geöffnet hat, zeigt zuerst ein MISS.",
    noHeader: "kein Cache-Header",
    meanings: {
      "x-vercel-cache": "HIT: aus dem CDN von Vercel. MISS oder STALE: Der Server hat die Seite gerendert oder aktualisiert.",
      "x-nextjs-cache": "Der Next.js-Cache, wenn kein CDN davor sitzt (lokal und selbst gehostet).",
      age: "Sekunden, die das CDN diese Kopie schon hält.",
      "cache-control": "Wie lange Browser und CDNs sie behalten dürfen.",
      date: "Wann der Server diese Antwort gesendet hat.",
    },
    dateLocale: "de-DE",
  },
};

const MESSAGES: Record<Locale, UiMessages> = { en, de: de as UiMessages };

export function getMessages(locale: Locale): UiMessages {
  return MESSAGES[locale];
}
