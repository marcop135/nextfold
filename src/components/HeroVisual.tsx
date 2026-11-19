"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { SITE_URL } from "@/lib/site";

export type VisualSection = { key: string; type: string; heading: string };

const TYPE_TITLES: Record<string, string> = {
  hero: "Hero",
  featureGrid: "Feature grid",
  steps: "Steps",
  codeSample: "Code sample",
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

/**
 * The page's own sections, as an editor lists them in the Studio and as the site renders them.
 * They appear one by one, then the page shows as published. Plays once while on screen;
 * holds the finished state under reduced motion.
 */
export function HeroVisual({ sections }: { sections: VisualSection[] }) {
  const figure = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = figure.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      element.dataset.motion = "static";
      return;
    }
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let completed = false;
    const update = () => {
      element.dataset.motion =
        motion.matches || completed ? "static" : visible && !document.hidden ? "running" : "paused";
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
      <div className="hero-visual__panes" aria-hidden="true">
        <div className="hero-visual__studio">
          <p className="hero-visual__label">Sanity Studio</p>
          <p className="hero-visual__doc">Home page</p>
          <ol className="hero-visual__rows">
            {sections.map((section, index) => (
              <li key={section.key} className="hero-visual__row" style={{ "--i": index } as CSSProperties}>
                <span className="hero-visual__type">{TYPE_TITLES[section.type] ?? section.type}</span>
                <span className="hero-visual__heading">{section.heading}</span>
              </li>
            ))}
          </ol>
          <p className="hero-visual__status">
            <span className="hero-visual__status-dot" />
            Published
          </p>
        </div>
        <div className="hero-visual__page">
          <p className="hero-visual__address">{SITE_URL.replace("https://", "")}</p>
          <div className="hero-visual__blocks">
            {sections.map((section, index) => (
              <span
                key={section.key}
                className={`hero-visual__block hero-visual__block--${section.type}`}
                style={{ "--i": index } as CSSProperties}
              >
                <Wireframe type={section.type} />
              </span>
            ))}
          </div>
        </div>
      </div>
      <figcaption>
        This page as an editor sees it in Sanity Studio, next to what the site builds from it. Each section the editor
        adds becomes one block on the page.
      </figcaption>
    </figure>
  );
}
