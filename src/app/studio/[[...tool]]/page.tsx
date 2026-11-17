import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main className="studio-setup">
        <h1>Studio needs a Sanity project</h1>
        <p>
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> in <code>.env</code>, add{" "}
          <code>http://localhost:3100</code> as a CORS origin with credentials, then restart{" "}
          <code>npm run dev</code>. Steps: <code>docs/sanity-setup.md</code>.
        </p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
