"use client";

import { useIsPresentationTool } from "next-sanity/hooks";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

/** Outside Presentation, draft mode needs a visible way out. */
export function DraftModeBar({ locale }: { locale: Locale }) {
  const t = getMessages(locale).draftBar;
  if (useIsPresentationTool() !== false) return null;
  return (
    <p className="draft-mode-bar" role="status">
      {t.text}{" "}
      {/* The route handler clears a cookie, so it must not be prefetched. */}
      <Link href="/api/draft-mode/disable" prefetch={false}>
        {t.exit}
      </Link>
    </p>
  );
}
