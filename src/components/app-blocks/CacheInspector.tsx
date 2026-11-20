"use client";

import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

export type CacheContext = { path: string; slug: string; cachedAt: string; source: "sanity" | "seed" };

/** Response headers worth showing, in the order a reader should scan them. */
const HEADERS = ["x-vercel-cache", "x-nextjs-cache", "age", "cache-control", "date"];

type Probe = { at: string; status: number; headers: Record<string, string | null> };

function relative(from: string, now: number, locale: Locale): string {
  const format = new Intl.RelativeTimeFormat(locale, { numeric: "always", style: "short" });
  const seconds = Math.max(0, Math.round((now - Date.parse(from)) / 1000));
  if (seconds < 60) return format.format(-seconds, "second");
  const minutes = Math.round(seconds / 60);
  if (minutes < 120) return format.format(-minutes, "minute");
  const hours = Math.round(minutes / 60);
  return hours < 48 ? format.format(-hours, "hour") : format.format(-Math.round(hours / 24), "day");
}

const formatTime = (iso: string, dateLocale: string) =>
  new Intl.DateTimeFormat(dateLocale, { dateStyle: "medium", timeStyle: "medium", timeZone: "UTC" }).format(new Date(iso)) +
  " UTC";

/** When this copy of the page entered the cache, the tags that can expire it, and a fresh request's headers. */
export function CacheInspector({ context, locale }: { context: CacheContext; locale: Locale }) {
  const t = getMessages(locale).cache;
  const [now, setNow] = useState<number | null>(null);
  const [probes, setProbes] = useState<Probe[]>([]);
  const [busy, setBusy] = useState(false);

  const probe = useCallback(async () => {
    setBusy(true);
    try {
      const response = await fetch(context.path, { method: "HEAD", headers: { accept: "text/html" }, cache: "no-store" });
      const headers = Object.fromEntries(HEADERS.map((name) => [name, response.headers.get(name)]));
      setProbes((list) => [{ at: new Date().toISOString(), status: response.status, headers }, ...list].slice(0, 3));
    } finally {
      setBusy(false);
    }
  }, [context.path]);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = window.setTimeout(() => {
      tick();
      void probe();
    }, 0);
    const timer = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, [probe]);

  const latest = probes[0];
  const shown = HEADERS.filter((name) => latest?.headers[name]);

  return (
    <div className="cache-inspector">
      <dl className="cache-inspector__facts">
        <div>
          <dt>{t.entered}</dt>
          <dd>
            <time dateTime={context.cachedAt}>{formatTime(context.cachedAt, t.dateLocale)}</time>
            {now ? <span className="cache-inspector__ago"> ({relative(context.cachedAt, now, locale)})</span> : null}
          </dd>
        </div>
        <div>
          <dt>{t.expires}</dt>
          <dd>{t.expiresBody(`page:${context.slug}`)}</dd>
        </div>
        <div>
          <dt>{t.from}</dt>
          <dd>{context.source === "sanity" ? t.fromSanity : t.fromSeed}</dd>
        </div>
      </dl>

      <div className="cache-inspector__probe">
        <div className="cache-inspector__probe-head">
          <p className="cache-inspector__title">{t.fresh(context.path)}</p>
          <button className="cache-inspector__button" type="button" onClick={() => void probe()} disabled={busy}>
            {busy ? t.requesting : t.again}
          </button>
        </div>
        <div role="status" aria-live="polite">
          {latest ? (
            shown.length ? (
              <table className="cache-inspector__table">
                <caption className="visually-hidden">{t.caption(formatTime(latest.at, t.dateLocale))}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t.header}</th>
                    <th scope="col">{t.value}</th>
                    <th scope="col">{t.meaning}</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((name) => (
                    <tr key={name}>
                      <th scope="row">
                        <code>{name}</code>
                      </th>
                      <td>
                        <code>{latest.headers[name]}</code>
                      </td>
                      <td>{t.meanings[name]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>{t.none}</p>
            )
          ) : (
            <p>{t.requesting}</p>
          )}
        </div>
        {probes.length > 1 ? (
          <p className="cache-inspector__history">
            {t.earlier}{" "}
            {probes
              .slice(1)
              .map((item) => item.headers["x-vercel-cache"] ?? item.headers["x-nextjs-cache"] ?? t.noHeader)
              .join(", ")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
