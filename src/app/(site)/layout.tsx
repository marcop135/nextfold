import { VisualEditing } from "next-sanity/visual-editing";
import type { ReactNode } from "react";
import { Analytics } from "@/components/Analytics";
import { DraftModeBar } from "@/components/DraftModeBar";
import { SiteChrome } from "@/components/SiteChrome";
import { isDraftMode as readDraftMode, live } from "@/sanity/lib/live";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const isDraftMode = await readDraftMode();
  return (
    <>
      <SiteChrome>{children}</SiteChrome>
      {live ? <live.SanityLive includeDrafts={isDraftMode} /> : null}
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
