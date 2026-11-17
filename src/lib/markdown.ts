import type { Block, Inline, StaticPage } from "@/content/static-pages";
import type { Page } from "@/sanity/types";
import { SITE_URL } from "./site";

const absolute = (href: string) => (href.startsWith("/") ? `${SITE_URL}${href}` : href);

function frontmatter(title: string, description: string, path: string): string {
  return `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\nurl: ${SITE_URL}${path}\n---`;
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

export function staticPageMarkdown(page: StaticPage): string {
  return [frontmatter(page.title, page.description, page.path), `# ${page.heading}`, ...page.blocks.map(block)].join("\n\n") + "\n";
}

export function cmsPageMarkdown(page: Page, path: string): string {
  const out = [frontmatter(page.title, page.description, path)];
  const sections = page.sections ?? [];
  if (sections[0]?._type !== "hero") out.push(`# ${page.title}`);
  sections.forEach((section, index) => {
    const level = index === 0 && section._type === "hero" ? "#" : "##";
    out.push(`${level} ${section.heading}`);
    if (section._type === "hero") {
      if (section.body) out.push(section.body);
      if (section.cta) out.push(`[${section.cta.label}](${absolute(section.cta.href)})`);
    } else if (section._type === "featureGrid") {
      out.push((section.items ?? []).map((item) => `- **${item.title}**${item.body ? `: ${item.body}` : ""}`).join("\n"));
    } else {
      if (section.body) out.push(section.body);
      out.push(`[${section.link.label}](${absolute(section.link.href)})`);
    }
  });
  return out.join("\n\n") + "\n";
}
