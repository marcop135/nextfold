import { SITE_URL } from "@/lib/site";

/** Fixed pages, kept as data so the HTML page and its Markdown twin share one source. */
export type Inline = string | { text: string; href: string } | { code: string };
export type Block =
  | { type: "h2"; text: string }
  | { type: "p"; parts: Inline[] }
  | { type: "ul"; items: Inline[][] }
  | { type: "pre"; label: string; text: string };

export type StaticPage = { path: string; title: string; heading: string; description: string; blocks: Block[] };

const host = SITE_URL.replace("https://", "");

export const forAgents: StaticPage = {
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
    { type: "pre", label: "Request the home page as Markdown", text: `curl -H 'Accept: text/markdown' ${SITE_URL}/` },
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

export const privacy: StaticPage = {
  path: "/privacy",
  title: "Privacy notice for Next Fold",
  heading: "Privacy",
  description:
    "Next Fold uses cookieless self-hosted Matomo and Vercel hosting. Public pages set no cookies, so no consent banner is shown.",
  blocks: [
    { type: "p", parts: [`This notice covers ${host}. Last updated: 2026-11-17.`] },
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
        "This site uses a self-hosted, cookieless Matomo installation run by the controller. No cookies are set and nothing is stored on your device. IP addresses are anonymised. When your browser sends Do Not Track, no page view is recorded.",
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

export const staticPages = [forAgents, privacy];
