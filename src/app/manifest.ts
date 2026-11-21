import type { MetadataRoute } from "next";
import { SITE_DESCRIPTIONS, SITE_NAME } from "@/lib/site";

/**
 * Web app manifest, so a saved shortcut or home-screen bookmark gets the Next Fold name and icon.
 * `display: "browser"` keeps it a website: Chromium does not offer to install it as an app, and a saved
 * shortcut opens in a normal browser tab. No service worker, by design.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTIONS.en,
    start_url: "/",
    scope: "/",
    display: "browser",
    background_color: "#f3f3f5",
    theme_color: "#ffffff",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
