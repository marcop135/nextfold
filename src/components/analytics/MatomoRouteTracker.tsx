"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    _paq?: unknown[][];
  }
}

/** Track App Router client navigations; the container tracks the first load. */
export function MatomoRouteTracker() {
  const pathname = usePathname();
  const previous = useRef<string | null>(null);

  useEffect(() => {
    const last = previous.current;
    previous.current = window.location.href;
    if (last === null || last === window.location.href) return;
    const paq = (window._paq = window._paq || []);
    paq.push(["setReferrerUrl", last]);
    paq.push(["setCustomUrl", window.location.href]);
    paq.push(["setDocumentTitle", document.title]);
    paq.push(["trackPageView"]);
  }, [pathname]);

  return null;
}
