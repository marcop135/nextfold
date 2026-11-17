import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@/components/Analytics";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <>
      <SiteChrome>
        <article className="wrap prose">
          <h1>Page not found</h1>
          <p>This address has no page. It may have moved, or the link may have a typo.</p>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/for-agents">For agents</Link>: Markdown versions and discovery files
            </li>
          </ul>
        </article>
      </SiteChrome>
      <Analytics />
    </>
  );
}
