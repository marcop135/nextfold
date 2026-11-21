import type { ReactNode } from "react";
import { refractor } from "refractor";

type HastNode =
  | { type: "text"; value: string }
  | { type: "element"; tagName: string; properties?: { className?: string[] }; children: HastNode[] }
  | { type: string; children?: HastNode[] };

function render(nodes: HastNode[]): ReactNode[] {
  return nodes.map((node, index) => {
    if (node.type === "text" && "value" in node) return node.value;
    if (node.type === "element" && "tagName" in node) {
      return (
        <span key={index} className={node.properties?.className?.join(" ")}>
          {render(node.children)}
        </span>
      );
    }
    return null;
  });
}

/** Prism highlighting through refractor, on the server: no client JavaScript. Unknown languages stay plain. */
export function CodeBlock({ code, language }: { code: string; language: string }) {
  const highlighted = refractor.registered(language)
    ? render(refractor.highlight(code, language).children as HastNode[])
    : code;
  return <code className={`language-${language}`}>{highlighted}</code>;
}
