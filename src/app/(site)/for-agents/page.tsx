import { StaticPageView } from "@/components/StaticPageView";
import { forAgents } from "@/content/static-pages";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(forAgents);

export default function ForAgentsPage() {
  return <StaticPageView page={forAgents} />;
}
