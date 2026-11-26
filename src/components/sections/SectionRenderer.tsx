import { stegaClean } from "next-sanity";
import { Image } from "next-sanity/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CodeBlock } from "@/components/sections/CodeBlock";
import { CacheInspector, type CacheContext } from "@/components/app-blocks/CacheInspector";
import { GuardrailsPlayground } from "@/components/app-blocks/GuardrailsPlayground";
import { PageAnatomy } from "@/components/app-blocks/PageAnatomy";
import { anatomyOf } from "@/lib/anatomy";
import { isAppBlockKind } from "@/lib/app-blocks";
import { localizeHref, type Locale } from "@/lib/i18n";
import type {
  AppBlockSection,
  CallToActionSection,
  CodeSampleSection,
  FeatureGridSection,
  HeroSection,
  Section,
  StepsSection,
} from "@/sanity/types";

/** Style options become data attributes; src/styles/sections.css maps each value to its token. */
function styleAttributes(section: Section) {
  return {
    "data-theme": "theme" in section ? stegaClean(section.theme) : undefined,
    "data-spacing": stegaClean(section.spacing),
  };
}

type LinkValue = { label: string; href: string };

function SectionLink({ link, className, locale }: { link: LinkValue; className: string; locale: Locale }) {
  const href = localizeHref(stegaClean(link.href), locale);
  return href.startsWith("/") ? (
    <Link className={className} href={href}>
      {link.label}
    </Link>
  ) : (
    <a className={className} href={href}>
      {link.label}
    </a>
  );
}

type HeroImageValue = NonNullable<HeroSection["image"]>;
type ResolvedAsset = Extract<NonNullable<HeroImageValue["asset"]>, { url: string }>;

function HeroImage({ image, asset, preload }: { image: HeroImageValue; asset: ResolvedAsset; preload: boolean }) {
  return (
    <figure className="hero-image">
      {/* 4:3 whatever the upload: the crop applies first, then the frame centers on the hotspot. */}
      <Image
        src={{ ...image, asset }}
        alt={stegaClean(image.alt) ?? ""}
        width={960}
        height={720}
        sizes="(min-width: 56rem) 34rem, 100vw"
        placeholder={asset.metadata?.lqip ? "blur" : "empty"}
        preload={preload}
      />
    </figure>
  );
}

function Hero({
  section,
  isFirst,
  visual,
  locale,
}: {
  section: HeroSection;
  isFirst: boolean;
  visual?: ReactNode;
  locale: Locale;
}) {
  const Heading = isFirst ? "h1" : "h2";
  const asset = section.image?.asset && "url" in section.image.asset ? section.image.asset : null;
  // An editor's image takes the place of the built-in visual.
  if (section.image && asset) visual = <HeroImage image={section.image} asset={asset} preload={isFirst} />;
  return (
    <section className="section hero" {...styleAttributes(section)} aria-labelledby={`${section._key}-title`}>
      <div className={visual ? "wrap hero__layout" : "wrap"}>
        <div className="hero__intro">
          {section.eyebrow ? <p className="eyebrow">{section.eyebrow}</p> : null}
          <Heading id={`${section._key}-title`}>{section.heading}</Heading>
          {section.body ? <p className="lead">{section.body}</p> : null}
          {section.link ? <SectionLink className="button" link={section.link} locale={locale} /> : null}
        </div>
        {visual}
      </div>
    </section>
  );
}

function FeatureGrid({ section, locale }: { section: FeatureGridSection; locale: Locale }) {
  return (
    <section className="section" {...styleAttributes(section)} aria-labelledby={`${section._key}-title`}>
      <div className="wrap">
        <h2 id={`${section._key}-title`}>{section.heading}</h2>
        <ul className="feature-grid">
          {section.items?.map((item) => (
            <li key={item._key}>
              <h3>{item.title}</h3>
              {item.body ? <p>{item.body}</p> : null}
              {item.link ? <SectionLink className="feature-grid__link" link={item.link} locale={locale} /> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Steps({ section }: { section: StepsSection }) {
  return (
    <section className="section" {...styleAttributes(section)} aria-labelledby={`${section._key}-title`}>
      <div className="wrap">
        <h2 id={`${section._key}-title`}>{section.heading}</h2>
        <ol className="steps">
          {section.items?.map((item) => (
            <li key={item._key}>
              <h3>{item.title}</h3>
              {item.body ? <p>{item.body}</p> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CodeSample({ section }: { section: CodeSampleSection }) {
  return (
    <section className="section" {...styleAttributes(section)} aria-labelledby={`${section._key}-title`}>
      <div className="wrap">
        <h2 id={`${section._key}-title`}>{section.heading}</h2>
        {section.body ? <p className="lead section-lead">{section.body}</p> : null}
        <figure className="code-sample">
          <figcaption>{section.filename}</figcaption>
          <pre tabIndex={0} role="region" aria-label={stegaClean(section.filename)}>
            <CodeBlock code={section.code} language={stegaClean(section.language)} />
          </pre>
        </figure>
      </div>
    </section>
  );
}

function AppBlock({
  section,
  sections,
  context,
  locale,
}: {
  section: AppBlockSection;
  sections: Section[];
  context?: CacheContext;
  locale: Locale;
}) {
  const kind = stegaClean(section.kind);
  if (!isAppBlockKind(kind)) return null;
  return (
    <section
      id={stegaClean(section._key)}
      className="section app-block"
      {...styleAttributes(section)}
      aria-labelledby={`${section._key}-title`}
    >
      <div className="wrap">
        <h2 id={`${section._key}-title`}>{section.heading}</h2>
        {section.body ? <p className="lead section-lead">{section.body}</p> : null}
        {kind === "guardrailsPlayground" ? <GuardrailsPlayground locale={locale} /> : null}
        {kind === "cacheInspector" && context ? <CacheInspector context={context} locale={locale} /> : null}
        {kind === "pageAnatomy" ? <PageAnatomy sections={anatomyOf(sections)} locale={locale} /> : null}
      </div>
    </section>
  );
}

function CallToAction({ section, locale }: { section: CallToActionSection; locale: Locale }) {
  return (
    <section className="section cta" {...styleAttributes(section)} aria-labelledby={`${section._key}-title`}>
      <div className="wrap cta__inner">
        <h2 id={`${section._key}-title`}>{section.heading}</h2>
        {section.body ? <p>{section.body}</p> : null}
        <SectionLink className="button" link={section.link} locale={locale} />
      </div>
    </section>
  );
}

/** `heroVisual` sits beside the opening hero only; `context` feeds app blocks that describe the page itself. */
export function SectionRenderer({
  sections,
  heroVisual,
  context,
  locale,
}: {
  sections: Section[];
  heroVisual?: ReactNode;
  context?: CacheContext;
  locale: Locale;
}) {
  return sections.map((section, index) => {
    switch (section._type) {
      case "hero":
        return (
          <Hero
            key={section._key}
            section={section}
            isFirst={index === 0}
            visual={index === 0 ? heroVisual : undefined}
            locale={locale}
          />
        );
      case "featureGrid":
        return <FeatureGrid key={section._key} section={section} locale={locale} />;
      case "steps":
        return <Steps key={section._key} section={section} />;
      case "codeSample":
        return <CodeSample key={section._key} section={section} />;
      case "appBlock":
        return <AppBlock key={section._key} section={section} sections={sections} context={context} locale={locale} />;
      case "callToAction":
        return <CallToAction key={section._key} section={section} locale={locale} />;
      default:
        return null;
    }
  });
}
