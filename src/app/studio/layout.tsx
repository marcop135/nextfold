import type { ReactNode } from "react";
import "@/styles/globals.css";

/** The Studio's own root layout: no site header, footer, or analytics. */
export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
