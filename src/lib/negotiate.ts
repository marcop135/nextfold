export type Representation = "html" | "markdown" | "none";

type Range = { type: string; subtype: string; q: number };

/** HTTP quoted strings can contain delimiters and backslash-escaped characters. */
function splitOutsideQuotes(value: string, delimiter: string): string[] {
  const parts: string[] = [];
  let start = 0;
  let quoted = false;
  for (let index = 0; index < value.length; index++) {
    if (quoted && value[index] === "\\") {
      index++;
    } else if (value[index] === '"') {
      quoted = !quoted;
    } else if (!quoted && value[index] === delimiter) {
      parts.push(value.slice(start, index));
      start = index + 1;
    }
  }
  return quoted ? [] : [...parts, value.slice(start)];
}

function parseAccept(header: string): Range[] {
  return splitOutsideQuotes(header, ",")
    .map((part) => {
      const [media, ...params] = splitOutsideQuotes(part.trim(), ";").map((s) => s.trim());
      const [type = "", subtype = "", extra] = media.toLowerCase().split("/");
      const qParam = params.find((p) => p.toLowerCase().startsWith("q="));
      const weight = qParam?.slice(2);
      const q = weight === undefined ? 1 : /^(?:0(?:\.[0-9]{0,3})?|1(?:\.0{0,3})?)$/.test(weight) ? Number(weight) : 0;
      return { type, subtype: extra === undefined ? subtype : "", q };
    })
    .filter((range) => range.type && range.subtype);
}

function qualityFor(ranges: Range[], type: string, subtype: string): { q: number; named: boolean } {
  const exact = ranges.find((r) => r.type === type && r.subtype === subtype);
  if (exact) return { q: exact.q, named: true };
  const partial = ranges.find((r) => r.type === type && r.subtype === "*");
  if (partial) return { q: partial.q, named: false };
  const any = ranges.find((r) => r.type === "*" && r.subtype === "*");
  return { q: any ? any.q : 0, named: false };
}

/** Compare q-values; a tie goes to Markdown only when text/markdown is named explicitly. */
export function preferredRepresentation(accept: string | null): Representation {
  if (!accept?.trim()) return "html";
  const ranges = parseAccept(accept);
  const html = qualityFor(ranges, "text", "html");
  const markdown = qualityFor(ranges, "text", "markdown");
  if (html.q <= 0 && markdown.q <= 0) return "none";
  if (markdown.q > html.q) return "markdown";
  if (markdown.q === html.q && markdown.named && !html.named) return "markdown";
  return "html";
}
