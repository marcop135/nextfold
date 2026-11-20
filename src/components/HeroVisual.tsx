"use client";

import { flushSync } from "react-dom";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { SITE_URL } from "@/lib/site";

export type VisualSection = { key: string; type: string; heading: string };

const TYPE_TITLES: Record<string, string> = {
  hero: "Hero",
  featureGrid: "Feature grid",
  steps: "Steps",
  codeSample: "Code sample",
  appBlock: "App block",
  callToAction: "Call to action",
};

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
export function HeroVisual({ sections }: { sections: VisualSection[] }) {
  const id = useId();
  const figure = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const [order, setOrder] = useState(() => sections.map((section) => section.key));
  const [active, setActive] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const focusAfterMove = useRef<{ key: string; direction: "up" | "down" } | null>(null);

  const byKey = new Map(sections.map((section) => [section.key, section]));
  const ordered = order.map((key) => byKey.get(key)).filter((section): section is VisualSection => !!section);
  const moved = order.some((key, index) => key !== sections[index]?.key);

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
      setAnnouncement(`${title} moved to position ${to + 1} of ${next.length}.`);
    });
  };

  const reset = () =>
    withTransition(() => {
      setOrder(sections.map((section) => section.key));
      setAnnouncement("Original order restored.");
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
            Sanity Studio
          </p>
          <p className="hero-visual__doc" id={`${id}-doc`}>
            Home page
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
                        aria-label={`Move ${title} up`}
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
                        aria-label={`Move ${title} down`}
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
          <p className="hero-visual__status">
            <span className="hero-visual__status-dot" />
            Published
          </p>
        </div>
        <div className="hero-visual__page" aria-hidden="true">
          <p className="hero-visual__address">{SITE_URL.replace("https://", "")}</p>
          <div className="hero-visual__blocks">
            {ordered.map((section, index) => (
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
        This page as an editor sees it in Sanity Studio, next to what the site builds from it.
        {ready ? " Move a section up or down and the page follows." : null}
        {ready && moved ? (
          <>
            {" "}
            <button type="button" className="hero-visual__reset" onClick={reset}>
              Reset order
            </button>
          </>
        ) : null}
      </figcaption>
      <p className="visually-hidden" role="status">
        {announcement}
      </p>
    </figure>
  );
}
