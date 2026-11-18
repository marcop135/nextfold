"use client";

import { useEffect, useRef } from "react";

const stages = [
  { label: "Define", lines: ['defineType("hero")', 'defineType("steps")', 'defineType("callToAction")'] },
  { label: "Compose", lines: ["page.sections", "[hero, steps, callToAction]"] },
  { label: "Publish", lines: ['perspective: "published"', "GROQ over the CDN"] },
  { label: "Render", lines: ["<Hero />", "<Steps />", "<CallToAction />"] },
];

const caption = "Section types defined in code become the pages editors compose and publish.";

/** Plays once while on screen; holds still under reduced motion or in a hidden tab. */
export function HeroVisual() {
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
      if (event.animationName !== "hero-visual-progress") return;
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
    <figure ref={figure} className="hero-visual" data-motion="pending">
      <div className="hero-visual__bar" aria-hidden="true">
        <span>sanity / page</span>
        <span>home</span>
      </div>
      <ol className="hero-visual__flow" aria-label={caption}>
        {stages.map((stage, index) => (
          <li key={stage.label} className={`hero-visual__stage hero-visual__stage--${index}`}>
            <span className="hero-visual__number" aria-hidden="true">
              0{index + 1}
            </span>
            <span className="hero-visual__label">{stage.label}</span>
            <span className="hero-visual__sketch" aria-hidden="true">
              {stage.lines.map((line) => (
                <code key={line}>{line}</code>
              ))}
            </span>
          </li>
        ))}
      </ol>
      <div className="hero-visual__track" aria-hidden="true">
        <span />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
