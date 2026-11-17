import type { ReactNode } from "react";
import { Analytics } from "@/components/Analytics";
import { SiteChrome } from "@/components/SiteChrome";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteChrome>{children}</SiteChrome>
      <Analytics />
    </>
  );
}
