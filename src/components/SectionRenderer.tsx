import { stegaClean } from "next-sanity";
import { Image } from "next-sanity/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CodeBlock } from "@/components/CodeBlock";
import type {
  CallToActionSection,
  CodeSampleSection,
  FeatureGridSection,
  HeroSection,
  Link as LinkValue,
  Section,
  StepsSection,
} from "@/sanity/types";

/** Style options become data attributes; globals.css maps each value to its token. */
function styleAttributes(section: Section) {
  return {
    "data-theme": "theme" in section ? stegaClean(section.theme) : undefined,
    "data-spacing": stegaClean(section.spacing),
  };
}

function SectionLink({ link, className }: { link: LinkValue; className: string }) {
  return link.href.startsWith("/") ? (
    <Link className={className} href={link.href}>
      {link.label}
    </Link>
  ) : (
    <a className={className} href={link.href}>
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

function Hero({ section, isFirst, visual }: { section: HeroSection; isFirst: boolean; visual?: ReactNode }) {
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
          {section.link ? <SectionLink className="button" link={section.link} /> : null}
        </div>
        {visual}
      </div>
    </section>
  );
}

function FeatureGrid({ section }: { section: FeatureGridSection }) {
  return (
    <section className="section" {...styleAttributes(section)} aria-labelledby={`${section._key}-title`}>
      <div className="wrap">
        <h2 id={`${section._key}-title`}>{section.heading}</h2>
        <ul className="feature-grid">
          {section.items?.map((item) => (
            <li key={item._key}>
              <h3>{item.title}</h3>
              {item.body ? <p>{item.body}</p> : null}
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
          <pre tabIndex={0} aria-label={stegaClean(section.filename)}>
            <CodeBlock code={section.code} language={stegaClean(section.language)} />
          </pre>
        </figure>
      </div>
    </section>
  );
}

function CallToAction({ section }: { section: CallToActionSection }) {
  return (
    <section className="section cta" {...styleAttributes(section)} aria-labelledby={`${section._key}-title`}>
      <div className="wrap cta__inner">
        <h2 id={`${section._key}-title`}>{section.heading}</h2>
        {section.body ? <p>{section.body}</p> : null}
        <SectionLink className="button" link={section.link} />
      </div>
    </section>
  );
}

/** `heroVisual` sits beside the opening hero only. */
export function SectionRenderer({ sections, heroVisual }: { sections: Section[]; heroVisual?: ReactNode }) {
  return sections.map((section, index) => {
    switch (section._type) {
      case "hero":
        return (
          <Hero
            key={section._key}
            section={section}
            isFirst={index === 0}
            visual={index === 0 ? heroVisual : undefined}
          />
        );
      case "featureGrid":
        return <FeatureGrid key={section._key} section={section} />;
      case "steps":
        return <Steps key={section._key} section={section} />;
      case "codeSample":
        return <CodeSample key={section._key} section={section} />;
      case "callToAction":
        return <CallToAction key={section._key} section={section} />;
      default:
        return null;
    }
  });
}
