import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import type { ReactNode } from "react";
import { Analytics } from "@/components/Analytics";
import { DraftModeBar } from "@/components/DraftModeBar";
import { SiteChrome } from "@/components/SiteChrome";
import { live } from "@/sanity/lib/live";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const { isEnabled: isDraftMode } = await draftMode();
  return (
    <>
      <SiteChrome>{children}</SiteChrome>
      {live ? <live.SanityLive /> : null}
      {isDraftMode ? (
        <>
          <VisualEditing />
          <DraftModeBar />
        </>
      ) : null}
      <Analytics />
    </>
  );
}
