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
    { type: "p", parts: [`This notice covers ${host}. Last updated: 2026-11-19.`] },
    { type: "h2", text: "Controller" },
    {
      type: "p",
      parts: [
        { text: "Marco Pontili", href: "https://marcopontili.com" },
        ". Contact: ",
        { text: "marcopontili.com/contact", href: "https://marcopontili.com/contact" },
        ".",
      ],
    },
    { type: "h2", text: "Analytics: self-hosted Matomo" },
    {
      type: "p",
      parts: [
        "This site uses a self-hosted, cookieless Matomo installation run by the controller. No cookies are set and nothing is stored on your device. IP addresses are anonymised. Page views are recorded when your browser sends Do Not Track or Global Privacy Control. Global Privacy Control asks a site not to sell or share your data for advertising, and this site does neither.",
      ],
    },
    {
      type: "p",
      parts: [
        "When an AI assistant fetches a page for a user, for example ChatGPT-User or Claude-User, the server records that request with its URL and user agent. No browser data is involved.",
      ],
    },
    {
      type: "p",
      parts: [
        "Data processed: anonymised IP address, pages visited, referrer, browser and device type, and time on page. Place of processing: European Union, on the controller's Matomo server hosted by Netsons S.r.l., Italy.",
      ],
    },
    { type: "h2", text: "Hosting: Vercel" },
    {
      type: "p",
      parts: [
        "Vercel Inc. (United States) hosts the site as processor and handles request data such as IP address, user agent, and timestamps to deliver and secure it. Transfers to the United States rely on Vercel's Data Processing Addendum, which includes the EU Standard Contractual Clauses.",
      ],
    },
    { type: "h2", text: "Content: Sanity" },
    {
      type: "p",
      parts: [
        "The server loads page content from Sanity (Sanity AS, Norway). Your browser does not contact Sanity on public pages. Fonts are served by this site, with no requests to Google.",
      ],
    },
    {
      type: "p",
      parts: [
        "The Sanity Studio at ",
        { code: "/studio" },
        " is for project members. Signing in there stores a Sanity session in the browser.",
      ],
    },
    { type: "h2", text: "Purposes and legal basis" },
    {
      type: "p",
      parts: [
        "Hosting data is processed to run and secure the site; analytics data to measure traffic in aggregate. Both rely on legitimate interests under Art. 6(1)(f) GDPR. No marketing profiles are built and no data is sold or shared for advertising.",
      ],
    },
    { type: "h2", text: "Cookies" },
    { type: "p", parts: ["Public pages set no cookies, so no consent banner is shown."] },
    { type: "h2", text: "Retention" },
    { type: "p", parts: ["Data is kept only as long as these purposes require. Analytics reports hold aggregate data only."] },
    { type: "h2", text: "Your rights" },
    {
      type: "p",
      parts: [
        "You may have the right of access, rectification, erasure, restriction, objection, and portability. Use the contact page above. You may also complain to the data protection authority where you live or work.",
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
    { type: "p", parts: [`Dieser Hinweis gilt für ${host}. Stand: 19.11.2026.`] },
    { type: "h2", text: "Verantwortlicher" },
    {
      type: "p",
      parts: [
        { text: "Marco Pontili", href: "https://marcopontili.com" },
        ". Kontakt: ",
        { text: "marcopontili.com/contact", href: "https://marcopontili.com/contact" },
        ".",
      ],
    },
    { type: "h2", text: "Analytics: selbst gehostetes Matomo" },
    {
      type: "p",
      parts: [
        "Diese Website nutzt eine selbst gehostete Matomo-Installation ohne Cookies, betrieben vom Verantwortlichen. Es werden keine Cookies gesetzt und nichts auf Ihrem Gerät gespeichert. IP-Adressen werden anonymisiert. Seitenaufrufe werden auch erfasst, wenn Ihr Browser Do Not Track oder Global Privacy Control sendet. Global Privacy Control bittet eine Website, Ihre Daten nicht für Werbung zu verkaufen oder weiterzugeben, und diese Website tut beides nicht.",
      ],
    },
    {
      type: "p",
      parts: [
        "Ruft ein KI-Assistent eine Seite für eine Person ab, zum Beispiel ChatGPT-User oder Claude-User, erfasst der Server diese Anfrage mit URL und User-Agent. Dabei fallen keine Browserdaten an.",
      ],
    },
    {
      type: "p",
      parts: [
        "Verarbeitete Daten: anonymisierte IP-Adresse, besuchte Seiten, Referrer, Browser- und Gerätetyp sowie Verweildauer. Ort der Verarbeitung: Europäische Union, auf dem Matomo-Server des Verantwortlichen bei Netsons S.r.l., Italien.",
      ],
    },
    { type: "h2", text: "Hosting: Vercel" },
    {
      type: "p",
      parts: [
        "Vercel Inc. (USA) hostet die Website als Auftragsverarbeiter und verarbeitet Anfragedaten wie IP-Adresse, User-Agent und Zeitstempel, um sie auszuliefern und abzusichern. Übermittlungen in die USA stützen sich auf das Data Processing Addendum von Vercel, das die EU-Standardvertragsklauseln enthält.",
      ],
    },
    { type: "h2", text: "Inhalte: Sanity" },
    {
      type: "p",
      parts: [
        "Der Server lädt die Seiteninhalte von Sanity (Sanity AS, Norwegen). Ihr Browser kontaktiert Sanity auf öffentlichen Seiten nicht. Schriften liefert diese Website selbst aus, ohne Anfragen an Google.",
      ],
    },
    {
      type: "p",
      parts: [
        "Das Sanity Studio unter ",
        { code: "/studio" },
        " ist für Projektmitglieder. Bei der Anmeldung dort wird eine Sanity-Sitzung im Browser gespeichert.",
      ],
    },
    { type: "h2", text: "Zwecke und Rechtsgrundlage" },
    {
      type: "p",
      parts: [
        "Hostingdaten werden verarbeitet, um die Website zu betreiben und abzusichern, Analytics-Daten, um die Nutzung in aggregierter Form zu messen. Beides stützt sich auf berechtigte Interessen nach Art. 6 Abs. 1 lit. f DSGVO. Es werden keine Marketingprofile erstellt und keine Daten für Werbung verkauft oder weitergegeben.",
      ],
    },
    { type: "h2", text: "Cookies" },
    { type: "p", parts: ["Öffentliche Seiten setzen keine Cookies, daher gibt es kein Cookie-Banner."] },
    { type: "h2", text: "Speicherdauer" },
    { type: "p", parts: ["Daten werden nur so lange gespeichert, wie diese Zwecke es erfordern. Analytics-Berichte enthalten nur aggregierte Daten."] },
    { type: "h2", text: "Ihre Rechte" },
    {
      type: "p",
      parts: [
        "Sie haben gegebenenfalls das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Widerspruch und Datenübertragbarkeit. Nutzen Sie dafür die oben genannte Kontaktseite. Sie können sich außerdem bei der Datenschutzaufsichtsbehörde an Ihrem Wohn- oder Arbeitsort beschweren.",
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
