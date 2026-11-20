import type { NextConfig } from "next";
import { sanity } from "next-sanity/live/cache-life";
import { DISCOVERY_LINK } from "./src/lib/site";
import { projectId } from "./src/sanity/env";

const isDev = process.env.NODE_ENV !== "production";
// The container loads from mt.; its bundled tracker reports to matomo.
const matomo = "https://mt.marcopontili.com https://matomo.marcopontili.com";
// Live Content API events for <SanityLive />.
const sanityLive = projectId ? ` https://${projectId}.api.sanity.io https://${projectId}.apicdn.sanity.io` : "";

/**
 * App Router streams inline RSC payload scripts, so script-src keeps 'unsafe-inline'.
 * 'unsafe-eval' and the HMR socket are dev-only. The Studio route gets its own,
 * looser headers below because it talks to the Sanity APIs from the browser.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${matomo}${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: https://cdn.sanity.io ${matomo}`,
  "font-src 'self'",
  `connect-src 'self' ${matomo}${sanityLive}${isDev ? " ws: wss:" : ""}`,
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const shared = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // next dev would otherwise write AGENTS.md and CLAUDE.md into the repo root.
  agentRules: false,
  experimental: { globalNotFound: true },
  // 'use cache' everywhere; cached entries live until a Sanity Live event or the publish webhook expires their tags.
  cacheComponents: true,
  cacheLife: { default: sanity },
  partialPrefetching: false,
  devIndicators: false,
  async redirects() {
    return [
      { source: "/anatomy", destination: "/inside-a-page", permanent: true },
      { source: "/anatomy.md", destination: "/inside-a-page.md", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/((?!studio).*)",
        headers: [
          ...shared,
          { key: "Content-Security-Policy", value: csp },
          { key: "No-Vary-Search", value: 'params=("utm_source" "utm_medium" "utm_campaign" "utm_term" "utm_content")' },
        ],
      },
      // Markdown twins set their own Link header (canonical HTML plus these links); a config header would replace it.
      {
        source: "/((?!studio)(?!.*\\.md$).*)",
        headers: [{ key: "Link", value: DISCOVERY_LINK }],
      },
      {
        source: "/studio/:path*",
        headers: [...shared, { key: "X-Frame-Options", value: "SAMEORIGIN" }, { key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/studio",
        headers: [...shared, { key: "X-Frame-Options", value: "SAMEORIGIN" }, { key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
