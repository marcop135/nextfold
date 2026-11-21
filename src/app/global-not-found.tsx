import type { Metadata } from "next";
import Link from "next/link";
import "@/styles/globals.css";

export const metadata: Metadata = { title: "Page not found | Next Fold", robots: { index: false, follow: true } };

/** Addresses outside every route, such as /a/b/c. Pages under a language get [locale]/not-found.tsx instead. */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main className="wrap prose" id="main">
          <h1>Page not found</h1>
          <p>This address has no page. It may have moved, or the link may have a typo.</p>
          <p>
            <Link href="/">Next Fold home</Link> · <Link href="/de">Deutsche Startseite</Link>
          </p>
        </main>
      </body>
    </html>
  );
}
