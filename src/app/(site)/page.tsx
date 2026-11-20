import type { Metadata } from "next";
import { CmsPage } from "@/components/CmsPage";
import { pageMetadata } from "@/lib/site";
import { getPage } from "@/sanity/lib/fetch-page";

export async function generateMetadata(): Promise<Metadata> {
  const loaded = await getPage("home");
  return loaded ? pageMetadata({ path: "/", title: loaded.page.title, description: loaded.page.description }) : {};
}

export default function HomePage() {
  return <CmsPage slug="home" path="/" />;
}
