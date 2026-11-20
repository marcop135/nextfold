"use client";

import { useCallback, useEffect, useState } from "react";

export type CacheContext = { path: string; slug: string; cachedAt: string; source: "sanity" | "seed" };

/** Response headers worth showing, in the order a reader should scan them. */
const HEADERS: { name: string; meaning: string }[] = [
  { name: "x-vercel-cache", meaning: "HIT: served from Vercel's CDN. MISS or STALE: the server rendered or refreshed it." },
  { name: "x-nextjs-cache", meaning: "The Next.js cache, when no CDN sits in front (local and self-hosted runs)." },
  { name: "age", meaning: "Seconds the CDN has held this copy." },
  { name: "cache-control", meaning: "How long browsers and CDNs may keep it." },
  { name: "date", meaning: "When the server sent this response." },
];

type Probe = { at: string; status: number; headers: Record<string, string | null> };

function relative(from: string, now: number): string {
  const seconds = Math.max(0, Math.round((now - Date.parse(from)) / 1000));
  if (seconds < 60) return `${seconds} s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 120) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  return hours < 48 ? `${hours} h ago` : `${Math.round(hours / 24)} days ago`;
}

const formatTime = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "medium", timeZone: "UTC" }).format(new Date(iso)) +
  " UTC";

/** When this copy of the page entered the cache, the tags that can expire it, and a fresh request's headers. */
export function CacheInspector({ context }: { context: CacheContext }) {
  const [now, setNow] = useState<number | null>(null);
  const [probes, setProbes] = useState<Probe[]>([]);
  const [busy, setBusy] = useState(false);

  const probe = useCallback(async () => {
    setBusy(true);
    try {
      const response = await fetch(context.path, { method: "HEAD", headers: { accept: "text/html" }, cache: "no-store" });
      const headers = Object.fromEntries(HEADERS.map(({ name }) => [name, response.headers.get(name)]));
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
  const shown = HEADERS.filter(({ name }) => latest?.headers[name]);

  return (
    <div className="cache-inspector">
      <dl className="cache-inspector__facts">
        <div>
          <dt>Entered the cache</dt>
          <dd>
            <time dateTime={context.cachedAt}>{formatTime(context.cachedAt)}</time>
            {now ? <span className="cache-inspector__ago"> ({relative(context.cachedAt, now)})</span> : null}
          </dd>
        </div>
        <div>
          <dt>Expires when</dt>
          <dd>
            The tag <code>page:{context.slug}</code> or a Sanity document tag on it is expired: by the Live Content API
            on publish, or by the publish webhook.
          </dd>
        </div>
        <div>
          <dt>Content from</dt>
          <dd>{context.source === "sanity" ? "The Sanity dataset" : "The seed copy bundled with the site"}</dd>
        </div>
      </dl>

      <div className="cache-inspector__probe">
        <div className="cache-inspector__probe-head">
          <p className="cache-inspector__title">A fresh request for {context.path}</p>
          <button className="cache-inspector__button" type="button" onClick={() => void probe()} disabled={busy}>
            {busy ? "Requesting…" : "Request again"}
          </button>
        </div>
        <div role="status" aria-live="polite">
          {latest ? (
            shown.length ? (
              <table className="cache-inspector__table">
                <caption className="visually-hidden">Response headers, requested at {formatTime(latest.at)}</caption>
                <thead>
                  <tr>
                    <th scope="col">Header</th>
                    <th scope="col">Value</th>
                    <th scope="col">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map(({ name, meaning }) => (
                    <tr key={name}>
                      <th scope="row">
                        <code>{name}</code>
                      </th>
                      <td>
                        <code>{latest.headers[name]}</code>
                      </td>
                      <td>{meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>The response carried no cache headers: this server runs in development mode, which skips the cache.</p>
            )
          ) : (
            <p>Requesting…</p>
          )}
        </div>
        {probes.length > 1 ? (
          <p className="cache-inspector__history">
            Earlier requests:{" "}
            {probes
              .slice(1)
              .map((item) => `${item.headers["x-vercel-cache"] ?? item.headers["x-nextjs-cache"] ?? "no cache header"}`)
              .join(", ")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
