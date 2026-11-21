import Script from "next/script";
import { MATOMO_CONTAINER_ID, MATOMO_ENABLED, MATOMO_ORIGIN } from "@/lib/matomo";
import { MatomoRouteTracker } from "@/components/analytics/MatomoRouteTracker";

/** Matomo Tag Manager container; its Pageview tag tracks the first load. */
export function Analytics() {
  if (!MATOMO_ENABLED) return null;
  const bootstrap = `var _mtm=window._mtm=window._mtm||[];_mtm.push({'mtm.startTime':Date.now(),event:'mtm.Start'});`;
  return (
    <>
      <Script id="matomo-bootstrap" strategy="afterInteractive">
        {bootstrap}
      </Script>
      <Script src={`${MATOMO_ORIGIN}/c/${MATOMO_CONTAINER_ID}.js`} strategy="afterInteractive" />
      <MatomoRouteTracker />
    </>
  );
}
