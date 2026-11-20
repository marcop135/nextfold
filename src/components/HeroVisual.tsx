"use client";

import { flushSync } from "react-dom";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import type { Locale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { SITE_URL } from "@/lib/site";

export type VisualSection = { key: string; type: string; heading: string };

/** A sketch of how each section type looks on the page, small enough for the preview pane. */
function Wireframe({ type }: { type: string }) {
  switch (type) {
    case "hero":
      return (
        <>
          <span className="wf-line wf-line--title" />
          <span className="wf-line wf-line--short" />
          <span className="wf-pill" />
        </>
      );
    case "featureGrid":
      return (
        <>
          <span className="wf-line wf-line--short" />
          <span className="wf-row">
            <span className="wf-card" />
            <span className="wf-card" />
            <span className="wf-card" />
          </span>
        </>
      );
    case "steps":
      return (
        <>
          <span className="wf-line wf-line--short" />
          <span className="wf-row">
            <span className="wf-step" />
            <span className="wf-step" />
            <span className="wf-step" />
            <span className="wf-step" />
          </span>
        </>
      );
    default:
      return (
        <>
          <span className="wf-line wf-line--short" />
          <span className="wf-pill wf-pill--light" />
        </>
      );
  }
}

const transitionName = (prefix: string, key: string) => `${prefix}-${key.replace(/[^a-zA-Z0-9-]/g, "-")}`;

/** Runs a state update inside a View Transition where the browser has one and motion is welcome. */
function withTransition(update: () => void) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && typeof document.startViewTransition === "function") {
    document.startViewTransition(() => flushSync(update));
  } else {
    update();
  }
}

/**
 * The page's own sections, as an editor lists them in the Studio and as the site renders them.
 * They appear one by one, then the page shows as published. Plays once while on screen;
 * holds the finished state under reduced motion. Once finished, the rows can be reordered
 * and the page blocks follow, the way a drag in the Studio reorders the page.
 */
export function HeroVisual({ sections, locale }: { sections: VisualSection[]; locale: Locale }) {
  const t = getMessages(locale).heroVisual;
  const TYPE_TITLES = t.types;
  const id = useId();
  const figure = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  // The Studio rows show the editor's draft order; the page shows the published one until Publish.
  const [order, setOrder] = useState(() => sections.map((section) => section.key));
  const [liveOrder, setLiveOrder] = useState(() => sections.map((section) => section.key));
  const [active, setActive] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const focusAfterMove = useRef<{ key: string; direction: "up" | "down" } | null>(null);

  const byKey = new Map(sections.map((section) => [section.key, section]));
  const toSections = (keys: string[]) => keys.map((key) => byKey.get(key)).filter((section): section is VisualSection => !!section);
  const ordered = toSections(order);
  const live = toSections(liveOrder);
  const moved = order.some((key, index) => key !== liveOrder[index]);

  useEffect(() => {
    const element = figure.current;
    if (!element) return;
    const markReady = () => setReady(true);
    if (typeof IntersectionObserver === "undefined") {
      element.dataset.motion = "static";
      queueMicrotask(markReady);
      return;
    }
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let completed = false;
    const update = () => {
      element.dataset.motion =
        motion.matches || completed ? "static" : visible && !document.hidden ? "running" : "paused";
      if (element.dataset.motion === "static") markReady();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        update();
      },
      { threshold: [0, 0.25] },
    );
    const finish = (event: AnimationEvent) => {
      if (event.animationName !== "hero-visual-publish") return;
      completed = true;
      update();
    };
    update();
    observer.observe(element);
    motion.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    element.addEventListener("animationend", finish);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      element.removeEventListener("animationend", finish);
    };
  }, []);

  // Keep focus on the moved row: the same arrow, or the other one once this one is disabled at an end.
  useEffect(() => {
    const target = focusAfterMove.current;
    if (!target) return;
    focusAfterMove.current = null;
    const same = document.getElementById(`${id}-${target.key}-${target.direction}`) as HTMLButtonElement | null;
    const other = document.getElementById(
      `${id}-${target.key}-${target.direction === "up" ? "down" : "up"}`,
    ) as HTMLButtonElement | null;
    (same && !same.disabled ? same : other)?.focus();
  }, [order, id]);

  const move = (key: string, direction: "up" | "down") => {
    const from = order.indexOf(key);
    const to = direction === "up" ? from - 1 : from + 1;
    if (from < 0 || to < 0 || to >= order.length) return;
    const next = [...order];
    [next[from], next[to]] = [next[to], next[from]];
    focusAfterMove.current = { key, direction };
    const title = TYPE_TITLES[byKey.get(key)?.type ?? ""] ?? "Section";
    withTransition(() => {
      setOrder(next);
      setAnnouncement(t.moved(title, to + 1, next.length));
    });
  };

  const publish = () =>
    withTransition(() => {
      setLiveOrder(order);
      setAnnouncement(t.publishedNow);
    });

  const discard = () =>
    withTransition(() => {
      setOrder(liveOrder);
      setAnnouncement(t.discarded);
    });

  return (
    <figure
      ref={figure}
      className="hero-visual"
      data-motion="pending"
      style={
        {
          "--count": sections.length,
          // Stagger caps the whole sequence near 4.4s, under the 5s limit of WCAG 2.2.2.
          "--step": `${Math.min(0.7, 3.5 / Math.max(sections.length, 1))}s`,
        } as CSSProperties
      }
    >
      <div className="hero-visual__panes">
        <div className="hero-visual__studio">
          <p className="hero-visual__label" aria-hidden="true">
            {t.studio} <span className="hero-visual__demo">{t.demo}</span>
          </p>
          <p className="hero-visual__doc" id={`${id}-doc`}>
            {t.doc}
          </p>
          <ol className="hero-visual__rows" aria-labelledby={`${id}-doc`}>
            {ordered.map((section, index) => {
              const title = TYPE_TITLES[section.type] ?? section.type;
              return (
                <li
                  key={section.key}
                  className="hero-visual__row"
                  data-active={active === section.key ? "" : undefined}
                  style={{ "--i": index, viewTransitionName: transitionName("hv-row", section.key) } as CSSProperties}
                  onMouseEnter={() => setActive(section.key)}
                  onMouseLeave={() => setActive(null)}
                >
                  <span className="hero-visual__text">
                    <span className="hero-visual__type">{title}</span>
                    <span className="hero-visual__heading">{section.heading}</span>
                  </span>
                  {ready && ordered.length > 1 ? (
                    <span
                      className="hero-visual__move"
                      onFocus={() => setActive(section.key)}
                      onBlur={() => setActive(null)}
                    >
                      <button
                        type="button"
                        id={`${id}-${section.key}-up`}
                        aria-label={t.moveUp(title)}
                        disabled={index === 0}
                        onClick={() => move(section.key, "up")}
                      >
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M8 12V4M4 8l4-4 4 4" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        id={`${id}-${section.key}-down`}
                        aria-label={t.moveDown(title)}
                        disabled={index === ordered.length - 1}
                        onClick={() => move(section.key, "down")}
                      >
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M8 4v8M4 8l4 4 4-4" />
                        </svg>
                      </button>
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ol>
          <div className="hero-visual__footer">
            <p className="hero-visual__status" data-state={moved ? "draft" : "published"}>
              <span className="hero-visual__status-dot" />
              {moved ? t.draft : t.published}
            </p>
            {ready && moved ? (
              <>
                <button type="button" className="hero-visual__publish" onClick={publish}>
                  {t.publish}
                </button>
                <button type="button" className="hero-visual__reset" onClick={discard}>
                  {t.discard}
                </button>
              </>
            ) : null}
          </div>
        </div>
        <div className="hero-visual__page" aria-hidden="true">
          <p className="hero-visual__address">{SITE_URL.replace("https://", "")}</p>
          <div className="hero-visual__blocks">
            {live.map((section, index) => (
              <span
                key={section.key}
                className={`hero-visual__block hero-visual__block--${section.type}`}
                data-active={active === section.key ? "" : undefined}
                style={{ "--i": index, viewTransitionName: transitionName("hv-block", section.key) } as CSSProperties}
              >
                <Wireframe type={section.type} />
              </span>
            ))}
          </div>
        </div>
      </div>
      <figcaption>
        {t.caption}
        {ready ? t.hint : null}
      </figcaption>
      <p className="visually-hidden" role="status">
        {announcement}
      </p>
    </figure>
  );
}
