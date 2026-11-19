import Link from "next/link";
import type { Block, Inline, StaticPage } from "@/content/static-pages";
import { pageJsonLd } from "@/lib/site";
import { CodeBlock } from "./CodeBlock";
import { JsonLd } from "./JsonLd";

function InlineParts({ parts }: { parts: Inline[] }) {
  return parts.map((part, index) => {
    if (typeof part === "string") return part;
    if ("code" in part) return <code key={index}>{part.code}</code>;
    return part.href.startsWith("/") ? (
      <Link key={index} href={part.href}>
        {part.text}
      </Link>
    ) : (
      <a key={index} href={part.href}>
        {part.text}
      </a>
    );
  });
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return <h2>{block.text}</h2>;
    case "p":
      return (
        <p>
          <InlineParts parts={block.parts} />
        </p>
      );
    case "ul":
      return (
        <ul>
          {block.items.map((parts, index) => (
            <li key={index}>
              <InlineParts parts={parts} />
            </li>
          ))}
        </ul>
      );
    case "pre":
      return (
        <pre tabIndex={0} role={block.label ? "region" : undefined} aria-label={block.label}>
          <CodeBlock code={block.text} language={block.language ?? "text"} />
        </pre>
      );
  }
}

export function StaticPageView({ page }: { page: StaticPage }) {
  return (
    <article className="wrap prose">
      <h1>{page.heading}</h1>
      {page.blocks.map((block, index) => (
        <BlockView key={index} block={block} />
      ))}
      <JsonLd
        data={pageJsonLd({
          path: page.path,
          title: page.title,
          description: page.description,
          crumbs: [{ name: page.heading, path: page.path }],
        })}
      />
    </article>
  );
}
