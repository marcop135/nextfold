import { StaticPageView } from "@/components/StaticPageView";
import { privacy } from "@/content/static-pages";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(privacy);

export default function PrivacyPage() {
  return <StaticPageView page={privacy} />;
}
