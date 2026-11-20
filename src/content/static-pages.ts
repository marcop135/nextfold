import type { Locale } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

/** Fixed pages, kept as data so the HTML page and its Markdown twin share one source. */
export type Inline = string | { text: string; href: string } | { code: string };
export type Block =
  | { type: "h2"; text: string }
  | { type: "p"; parts: Inline[] }
  | { type: "ul"; items: Inline[][] }
  | { type: "pre"; label: string; text: string; language?: string };

/** `path` is locale-neutral; the German version lives at /de + path. */
export type StaticPage = { path: string; title: string; heading: string; description: string; blocks: Block[] };

const host = SITE_URL.replace("https://", "");

const forAgentsEn: StaticPage = {
  path: "/for-agents",
  title: "For agents: read Next Fold as Markdown",
  heading: "For agents",
  description:
    "Every Next Fold page has a Markdown twin. Request it by path or with Accept: text/markdown, and list all pages in llms.txt.",
  blocks: [
    {
      type: "p",
      parts: [
        "Next Fold is a Next.js App Router site whose pages come from Sanity sections. Every page also exists as Markdown. No login or API key is needed.",
      ],
    },
    { type: "h2", text: "Read a page as Markdown" },
    {
      type: "ul",
      items: [
        [{ code: "/index.md" }, " returns the home page."],
        ["Add ", { code: ".md" }, " to any other page path, for example ", { text: "/privacy.md", href: "/privacy.md" }, "."],
        ["Or request the page URL with ", { code: "Accept: text/markdown" }, "."],
      ],
    },
    { type: "pre", label: "Request the home page as Markdown", language: "bash", text: `curl -H 'Accept: text/markdown' ${SITE_URL}/` },
    { type: "h2", text: "Find every page" },
    {
      type: "ul",
      items: [
        [{ text: "/llms.txt", href: "/llms.txt" }, ": page list with Markdown links"],
        [{ text: "/sitemap.xml", href: "/sitemap.xml" }, ": every public URL"],
        [{ text: "/robots.txt", href: "/robots.txt" }, ": crawl rules and content signals"],
      ],
    },
    { type: "h2", text: "Access" },
    {
      type: "p",
      parts: [
        "These resources return published content only. The Sanity Studio at ",
        { code: "/studio" },
        " is for project members and stays out of search.",
      ],
    },
  ],
};

const privacyEn: StaticPage = {
  path: "/privacy",
  title: "Privacy notice for Next Fold",
  heading: "Privacy",
  description:
    "Next Fold uses cookieless self-hosted Matomo and Vercel hosting. Public pages set no cookies, so no consent banner is shown.",
  blocks: [
    {
      type: "p",
      parts: [
        `This notice covers ${host}. Last updated: 2026-11-20. Controller: `,
        { text: "Marco Pontili", href: "https://marcopontili.com" },
        ", contact through ",
        { text: "marcopontili.com/contact", href: "https://marcopontili.com/contact" },
        ". Public pages set no cookies, so no consent banner is shown.",
      ],
    },
    { type: "h2", text: "What is processed" },
    {
      type: "ul",
      items: [
        [
          "Analytics: a self-hosted, cookieless Matomo on the controller's server at Netsons S.r.l., Italy (EU). It records an anonymised IP address, pages visited, referrer, browser and device type, and time on page, also when your browser sends Do Not Track or Global Privacy Control. The site does not sell or share data for advertising.",
        ],
        [
          "AI assistants: when one fetches a page for a user, for example ChatGPT-User or Claude-User, the server records the URL and user agent.",
        ],
        [
          "Hosting: Vercel Inc. (United States) delivers and secures the site as processor, handling IP address, user agent, and timestamps. Transfers rely on Vercel's Data Processing Addendum with the EU Standard Contractual Clauses.",
        ],
        [
          "Content: page content comes from Sanity (Sanity AS, Norway). While a page is open, your browser connects to Sanity's API to receive content updates, which shares your IP address with Sanity. Signing in to the Studio at ",
          { code: "/studio" },
          " stores a Sanity session in the browser. Fonts are served by this site.",
        ],
      ],
    },
    { type: "h2", text: "Why, and for how long" },
    {
      type: "p",
      parts: [
        "Hosting data keeps the site running and secure; analytics data measures traffic in aggregate. Both rely on legitimate interests under Art. 6(1)(f) GDPR. Data is kept only as long as these purposes require, and analytics reports hold aggregate data only.",
      ],
    },
    { type: "h2", text: "Your rights" },
    {
      type: "p",
      parts: [
        "You may have the right of access, rectification, erasure, restriction, objection, and portability; use the contact page above. You may also complain to the data protection authority where you live or work.",
      ],
    },
  ],
};

const forAgentsDe: StaticPage = {
  path: "/for-agents",
  title: "Für Agenten: Next Fold als Markdown lesen",
  heading: "Für Agenten",
  description:
    "Jede Seite von Next Fold hat eine Markdown-Version. Abruf über den Pfad oder mit Accept: text/markdown, alle Seiten stehen in llms.txt.",
  blocks: [
    {
      type: "p",
      parts: [
        "Next Fold ist eine Next.js-Website mit App Router, deren Seiten aus Sanity-Abschnitten bestehen. Jede Seite gibt es auch als Markdown, ohne Login und ohne API-Schlüssel.",
      ],
    },
    { type: "h2", text: "Eine Seite als Markdown lesen" },
    {
      type: "ul",
      items: [
        [{ code: "/de/index.md" }, " liefert die deutsche Startseite."],
        ["An jeden anderen Pfad ", { code: ".md" }, " anhängen, zum Beispiel ", { text: "/de/privacy.md", href: "/de/privacy.md" }, "."],
        ["Oder die Seiten-URL mit ", { code: "Accept: text/markdown" }, " abrufen."],
      ],
    },
    { type: "pre", label: "Die deutsche Startseite als Markdown abrufen", language: "bash", text: `curl -H 'Accept: text/markdown' ${SITE_URL}/de` },
    { type: "h2", text: "Alle Seiten finden" },
    {
      type: "ul",
      items: [
        [{ text: "/llms.txt", href: "/llms.txt" }, ": Seitenliste mit Markdown-Links, auf Englisch und Deutsch"],
        [{ text: "/sitemap.xml", href: "/sitemap.xml" }, ": alle öffentlichen URLs mit ihren Sprachversionen"],
        [{ text: "/robots.txt", href: "/robots.txt" }, ": Crawl-Regeln und Content Signals"],
      ],
    },
    { type: "h2", text: "Zugriff" },
    {
      type: "p",
      parts: [
        "Diese Ressourcen liefern nur veröffentlichte Inhalte. Das Sanity Studio unter ",
        { code: "/studio" },
        " ist für Projektmitglieder und wird von Suchmaschinen nicht indexiert.",
      ],
    },
  ],
};

const privacyDe: StaticPage = {
  path: "/privacy",
  title: "Datenschutzhinweis für Next Fold",
  heading: "Datenschutz",
  description:
    "Next Fold nutzt ein selbst gehostetes Matomo ohne Cookies und Hosting bei Vercel. Öffentliche Seiten setzen keine Cookies, daher gibt es kein Cookie-Banner.",
  blocks: [
    {
      type: "p",
      parts: [
        `Dieser Hinweis gilt für ${host}. Stand: 20.11.2026. Verantwortlicher: `,
        { text: "Marco Pontili", href: "https://marcopontili.com" },
        ", Kontakt über ",
        { text: "marcopontili.com/contact", href: "https://marcopontili.com/contact" },
        ". Öffentliche Seiten setzen keine Cookies, daher gibt es kein Cookie-Banner.",
      ],
    },
    { type: "h2", text: "Was verarbeitet wird" },
    {
      type: "ul",
      items: [
        [
          "Analytics: ein selbst gehostetes Matomo ohne Cookies auf dem Server des Verantwortlichen bei Netsons S.r.l., Italien (EU). Es erfasst die anonymisierte IP-Adresse, besuchte Seiten, Referrer, Browser- und Gerätetyp sowie die Verweildauer, auch wenn Ihr Browser Do Not Track oder Global Privacy Control sendet. Die Website verkauft keine Daten und gibt keine für Werbung weiter.",
        ],
        [
          "KI-Assistenten: Ruft einer eine Seite für eine Person ab, zum Beispiel ChatGPT-User oder Claude-User, erfasst der Server URL und User-Agent.",
        ],
        [
          "Hosting: Vercel Inc. (USA) liefert die Website als Auftragsverarbeiter aus, sichert sie ab und verarbeitet dabei IP-Adresse, User-Agent und Zeitstempel. Übermittlungen in die USA stützen sich auf das Data Processing Addendum von Vercel mit den EU-Standardvertragsklauseln.",
        ],
        [
          "Inhalte: Die Seiteninhalte kommen von Sanity (Sanity AS, Norwegen). Solange eine Seite offen ist, verbindet sich Ihr Browser mit der API von Sanity, um Aktualisierungen zu erhalten, dabei erfährt Sanity Ihre IP-Adresse. Bei der Anmeldung im Studio unter ",
          { code: "/studio" },
          " wird eine Sanity-Sitzung im Browser gespeichert. Schriften liefert diese Website selbst aus.",
        ],
      ],
    },
    { type: "h2", text: "Zweck und Speicherdauer" },
    {
      type: "p",
      parts: [
        "Hostingdaten dienen dem Betrieb und der Sicherheit der Website, Analytics-Daten der Messung der Nutzung in aggregierter Form. Beides stützt sich auf berechtigte Interessen nach Art. 6 Abs. 1 lit. f DSGVO. Daten werden nur so lange gespeichert, wie diese Zwecke es erfordern; Analytics-Berichte enthalten nur aggregierte Daten.",
      ],
    },
    { type: "h2", text: "Ihre Rechte" },
    {
      type: "p",
      parts: [
        "Sie haben gegebenenfalls das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Widerspruch und Datenübertragbarkeit; nutzen Sie dafür die oben genannte Kontaktseite. Sie können sich außerdem bei der Datenschutzaufsichtsbehörde an Ihrem Wohn- oder Arbeitsort beschweren.",
      ],
    },
  ],
};

export const forAgents: Record<Locale, StaticPage> = { en: forAgentsEn, de: forAgentsDe };
export const privacy: Record<Locale, StaticPage> = { en: privacyEn, de: privacyDe };

/** Every fixed page in one language. */
export const staticPagesFor = (locale: Locale): StaticPage[] => [forAgents[locale], privacy[locale]];

/** Locale-neutral paths of the fixed pages. */
export const STATIC_PATHS = [forAgentsEn.path, privacyEn.path];
