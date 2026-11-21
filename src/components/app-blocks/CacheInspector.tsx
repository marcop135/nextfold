"use client";

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { localizedPath, type Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

export type CacheContext = { path: string; slug: string; cachedAt: string; source: "sanity" | "seed" };

/** Response headers worth showing, in the order a reader should scan them. */
const HEADERS = ["x-vercel-cache", "x-nextjs-cache", "age", "cache-control", "date"];
/** Runs kept and drawn per page. */
const RUNS = 5;

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
  const [probes, setProbes] = useState<Probe[]>([]);
  const [selected, setSelected] = useState(context.path);
  const [busy, setBusy] = useState(false);
  const nextId = useRef(0);

  const probe = useCallback(async (path: string) => {
    setSelected(path);
    setBusy(true);
    try {
      const started = performance.now();
      const response = await fetch(path, { method: "HEAD", headers: { accept: "text/html" }, cache: "no-store" });
      const ms = Math.round(performance.now() - started);
      const headers = Object.fromEntries(HEADERS.map((name) => [name, response.headers.get(name)]));
      const entry: Probe = { id: nextId.current++, at: new Date().toISOString(), path, status: response.status, ms, headers };
      // Keep the last RUNS per page, so runs on one page never push out another page's.
      setProbes((list) => [entry, ...list.filter((item) => item.path !== path), ...list.filter((item) => item.path === path).slice(0, RUNS - 1)]);
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

  // The answer column is about one page at a time: its requests, newest first, drawn to scale.
  const runs = probes.filter((item) => item.path === selected).slice(0, RUNS);
  const latest = runs[0];
  const slowest = Math.max(1, ...runs.map((item) => item.ms));
  const shown = HEADERS.filter((name) => latest?.headers[name]);
  const request = () => !busy && void probe(selected);

  return (
    <div className="cache-inspector">
      {/* Three facts about the copy you are reading, as tiles: a value to scan, one small line of detail. */}
      <dl className="cache-inspector__stats">
        <div>
          <dt>{t.entered}</dt>
          <dd className="cache-inspector__stat">{now ? relative(context.cachedAt, now, locale) : "…"}</dd>
          <dd>
            <time dateTime={context.cachedAt}>{formatTime(context.cachedAt, t.dateLocale)}</time>
          </dd>
        </div>
        <div>
          <dt>{t.expires}</dt>
          <dd className="cache-inspector__stat">{t.expiresValue}</dd>
          <dd>
            {t.tagNote} <code>page:{context.slug}</code>
          </dd>
        </div>
        <div>
          <dt>{t.from}</dt>
          <dd className="cache-inspector__stat">{context.source === "sanity" ? t.fromSanity : t.fromSeed}</dd>
          <dd>{context.source === "sanity" ? t.fromSanityNote : t.fromSeedNote}</dd>
        </div>
      </dl>

      <div className="cache-inspector__probe">
        <div className="cache-inspector__probe-head" role="group" aria-labelledby={`${id}-pick`}>
          <p className="cache-inspector__label" id={`${id}-pick`}>
            {t.pick}
          </p>
          {/* One click selects a page and requests it; the answer for the selected page is on the right. */}
          <ul className="cache-inspector__pages">
            {PAGES.map((page) => {
              const path = localizedPath(page, locale);
              return (
                <li key={path}>
                  {/* aria-disabled, not disabled: a disabled button would drop keyboard focus mid-request. */}
                  <button
                    className="cache-inspector__page"
                    type="button"
                    aria-pressed={selected === path}
                    aria-disabled={busy}
                    onClick={() => !busy && void probe(path)}
                  >
                    <span>{path}</span>
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M6 3l5 5-5 5" />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="cache-inspector__hint">{t.tryBody}</p>
        </div>

        <div className="cache-inspector__output" aria-busy={busy}>
          <div className="cache-inspector__output-head">
            <p className="cache-inspector__label">{t.requestsFor(selected)}</p>
            <button className="cache-inspector__again" type="button" aria-disabled={busy} onClick={request}>
              {t.again}
            </button>
          </div>

          {/* Announces one short line per request; the bars and table stay out of the live region. */}
          <p className="visually-hidden" role="status">
            {latest ? `${latest.path}: ${resultOf(latest) || t.noHeader}, ${latest.ms} ms` : ""}
          </p>

          {runs.length ? (
            <ol className="cache-inspector__runs" aria-label={t.requestsFor(selected)}>
              {runs.map((item) => {
                const result = resultOf(item);
                return (
                  <li key={item.id} data-result={result.toLowerCase() || "none"}>
                    <span className="cache-inspector__badge" data-result={result.toLowerCase() || "none"}>
                      {result || t.noHeader}
                    </span>
                    <span className="cache-inspector__bar" style={{ "--share": item.ms / slowest } as CSSProperties} aria-hidden="true" />
                    <span className="cache-inspector__ms">{item.ms} ms</span>
                  </li>
                );
              })}
            </ol>
          ) : (
            // Same shape as a row, so the first answer drops into place instead of replacing a line of text.
            <ol className="cache-inspector__runs" aria-label={t.requesting}>
              <li data-result="pending">
                <span className="cache-inspector__badge">…</span>
                <span className="cache-inspector__bar" aria-hidden="true" />
                <span className="cache-inspector__ms">… ms</span>
              </li>
            </ol>
          )}

          {latest ? (
            shown.length ? (
              <details className="cache-inspector__headers">
                <summary>{t.headersToggle(shown.length)}</summary>
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
              </details>
            ) : (
              <p className="cache-inspector__hint">{t.none}</p>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
