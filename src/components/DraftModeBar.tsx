"use client";

import { useIsPresentationTool } from "next-sanity/hooks";
import Link from "next/link";

/** Outside Presentation, draft mode needs a visible way out. */
export function DraftModeBar() {
  if (useIsPresentationTool() !== false) return null;
  return (
    <p className="draft-mode-bar" role="status">
      Draft mode: this page shows unpublished changes.{" "}
      {/* The route handler clears a cookie, so it must not be prefetched. */}
      <Link href="/api/draft-mode/disable" prefetch={false}>
        Exit draft mode
      </Link>
    </p>
  );
}
