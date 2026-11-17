import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageView } from "@/components/PageView";
import { pageMetadata } from "@/lib/site";
import { getPage } from "@/sanity/lib/fetch-page";

export async function generateMetadata(): Promise<Metadata> {
  const loaded = await getPage("home");
  return loaded ? pageMetadata({ path: "/", title: loaded.page.title, description: loaded.page.description }) : {};
}

export default async function HomePage() {
  const loaded = await getPage("home");
  if (!loaded) notFound();
  return <PageView loaded={loaded} path="/" />;
}
