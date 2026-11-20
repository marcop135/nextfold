"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeForPathname, localizedPath } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

/** Inside the language layout, so the header and footer are already there. The language comes from the URL. */
export default function NotFound() {
  const locale = localeForPathname(usePathname() ?? "/");
  const t = getMessages(locale).notFound;
  return (
    <article className="wrap prose">
      <title>{`${t.title} | Next Fold`}</title>
      <meta name="robots" content="noindex, follow" />
      <h1>{t.title}</h1>
      <p>{t.body}</p>
      <ul>
        <li>
          <Link href={localizedPath("/", locale)}>{t.home}</Link>
        </li>
        <li>
          <Link href={localizedPath("/for-agents", locale)}>{t.agents}</Link>
          {t.agentsNote}
        </li>
      </ul>
    </article>
  );
}
