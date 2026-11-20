"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { localizedPath, type Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

export type CacheContext = { path: string; slug: string; cachedAt: string; source: "sanity" | "seed" };

/** Response headers worth showing, in the order a reader should scan them. */
const HEADERS = ["x-vercel-cache", "x-nextjs-cache", "age", "cache-control", "date"];

/** Pages a visitor can request from the inspector, locale-neutral. */
const PAGES = ["/", "/inside-a-page", "/guardrails", "/caching", "/system"];

type Probe = { id: number; at: string; path: string; status: number; ms: number; headers: Record<string, string | null> };

function relative(from: string, now: number, locale: Locale): string {
  const format = new Intl.RelativeTimeFormat(locale, { numeric: "always", style: "short" });
  const seconds = Math.max(0, Math.round((now - Date.parse(from)) / 1000));
  if (seconds < 60) return format.format(-seconds, "second");
  const minutes = Math.round(seconds / 60);
  if (minutes < 120) return format.format(-minutes, "minute");
  const hours = Math.round(minutes / 60);
  return hours < 48 ? format.format(-hours, "hour") : format.format(-Math.round(hours / 24), "day");
}

const formatTime = (iso: string, dateLocale: string, style: "medium" | "short" = "medium") =>
  new Intl.DateTimeFormat(dateLocale, { dateStyle: style === "medium" ? "medium" : undefined, timeStyle: "medium", timeZone: "UTC" }).format(
    new Date(iso),
  ) + " UTC";

/** HIT, MISS, STALE, PRERENDER, or none: what the cache said about one response. */
const resultOf = (probe: Probe) => (probe.headers["x-vercel-cache"] ?? probe.headers["x-nextjs-cache"] ?? "").toUpperCase();

/**
 * When this copy of the page entered the cache, the tags that can expire it, and live requests:
 * pick any page, request it, and compare the cache result and response time across requests.
 */
export function CacheInspector({ context, locale }: { context: CacheContext; locale: Locale }) {
  const t = getMessages(locale).cache;
  const id = useId();
  const [now, setNow] = useState<number | null>(null);
  const [target, setTarget] = useState(context.path);
  const [probes, setProbes] = useState<Probe[]>([]);
  const [busy, setBusy] = useState(false);

  const probe = useCallback(async (path: string) => {
    setBusy(true);
    try {
      const started = performance.now();
      const response = await fetch(path, { method: "HEAD", headers: { accept: "text/html" }, cache: "no-store" });
      const ms = Math.round(performance.now() - started);
      const headers = Object.fromEntries(HEADERS.map((name) => [name, response.headers.get(name)]));
      setProbes((list) => [{ id: Date.now(), at: new Date().toISOString(), path, status: response.status, ms, headers }, ...list].slice(0, 6));
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = window.setTimeout(() => {
      tick();
      void probe(context.path);
    }, 0);
    const timer = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, [probe, context.path]);

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
        <div>
          <dt>{t.tryTitle}</dt>
          <dd>{t.tryBody}</dd>
        </div>
      </dl>

      <div className="cache-inspector__probe">
        <form
          className="cache-inspector__probe-head"
          onSubmit={(event) => {
            event.preventDefault();
            void probe(target);
          }}
        >
          <label className="cache-inspector__picker" htmlFor={`${id}-page`}>
            <span>{t.pick}</span>
            <select id={`${id}-page`} value={target} onChange={(event) => setTarget(event.target.value)}>
              {PAGES.map((page) => {
                const path = localizedPath(page, locale);
                return (
                  <option key={path} value={path}>
                    {path}
                  </option>
                );
              })}
            </select>
          </label>
          <button className="cache-inspector__button" type="submit" disabled={busy}>
            {busy ? t.requesting : t.again}
          </button>
        </form>

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

        {probes.length ? (
          <div className="cache-inspector__history">
            <p className="cache-inspector__history-title">{t.history}</p>
            <ol>
              {probes.map((item) => {
                const result = resultOf(item);
                return (
                  <li key={item.id}>
                    <span className="cache-inspector__badge" data-result={result.toLowerCase() || "none"}>
                      {result || t.noHeader}
                    </span>
                    <code>{item.path}</code>
                    <span className="cache-inspector__ms">{item.ms} ms</span>
                    <time dateTime={item.at}>{formatTime(item.at, t.dateLocale, "short")}</time>
                  </li>
                );
              })}
            </ol>
          </div>
        ) : null}
      </div>
    </div>
  );
}
