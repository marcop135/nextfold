import type { Block, Inline, StaticPage } from "@/content/static-pages";
import type { Page } from "@/sanity/types";
import { APP_BLOCKS, isAppBlockKind } from "./app-blocks";
import { LOCALE_NAMES, localizeHref, localizedPath, type Locale } from "./i18n";
import { SITE_URL } from "./site";

const absolute = (href: string) => (href.startsWith("/") ? `${SITE_URL}${href}` : href);

/** `path` is locale-neutral; the url in the front matter carries the locale. */
function frontmatter(title: string, description: string, path: string, locale: Locale): string {
  return [
    "---",
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `url: ${SITE_URL}${localizedPath(path, locale)}`,
    `lang: ${LOCALE_NAMES[locale].hreflang}`,
    "---",
  ].join("\n");
}

function inline(parts: Inline[]): string {
  return parts
    .map((part) => {
      if (typeof part === "string") return part;
      if ("code" in part) return `\`${part.code}\``;
      return `[${part.text}](${absolute(part.href)})`;
    })
    .join("");
}

function block(item: Block): string {
  switch (item.type) {
    case "h2":
      return `## ${item.text}`;
    case "p":
      return inline(item.parts);
    case "ul":
      return item.items.map((parts) => `- ${inline(parts)}`).join("\n");
    case "pre":
      return `\`\`\`bash\n${item.text}\n\`\`\``;
  }
}

export function staticPageMarkdown(page: StaticPage, locale: Locale): string {
  return (
    [frontmatter(page.title, page.description, page.path, locale), `# ${page.heading}`, ...page.blocks.map(block)].join("\n\n") +
    "\n"
  );
}

/** `path` is locale-neutral. Links inside the page point at the same language. */
export function cmsPageMarkdown(page: Page, path: string, locale: Locale): string {
  const link = (href: string) => absolute(localizeHref(href, locale));
  const out = [frontmatter(page.title, page.description, path, locale)];
  const sections = page.sections ?? [];
  if (sections[0]?._type !== "hero") out.push(`# ${page.title}`);
  sections.forEach((section, index) => {
    const level = index === 0 && section._type === "hero" ? "#" : "##";
    out.push(`${level} ${section.heading}`);
    switch (section._type) {
      case "hero":
        if (section.body) out.push(section.body);
        if (section.image?.asset && "url" in section.image.asset) {
          out.push(`![${section.image.alt ?? ""}](${section.image.asset.url})`);
        }
        if (section.link) out.push(`[${section.link.label}](${link(section.link.href)})`);
        break;
      case "featureGrid":
        out.push(
          (section.items ?? [])
            .map((item) => {
              const more = item.link ? ` [${item.link.label}](${link(item.link.href)})` : "";
              return `- **${item.title}**${item.body ? `: ${item.body}` : ""}${more}`;
            })
            .join("\n"),
        );
        break;
      case "steps":
        out.push(
          (section.items ?? []).map((item, step) => `${step + 1}. **${item.title}**${item.body ? `: ${item.body}` : ""}`).join("\n"),
        );
        break;
      case "codeSample":
        if (section.body) out.push(section.body);
        out.push(`\`${section.filename}\``, "```" + section.language + "\n" + section.code + "\n```");
        break;
      case "appBlock": {
        if (section.body) out.push(section.body);
        if (isAppBlockKind(section.kind)) out.push(`_${APP_BLOCKS[section.kind].fallback}_`);
        break;
      }
      case "callToAction":
        if (section.body) out.push(section.body);
        out.push(`[${section.link.label}](${link(section.link.href)})`);
        break;
    }
  });
  return out.join("\n\n") + "\n";
}
