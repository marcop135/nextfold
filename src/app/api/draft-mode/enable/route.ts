import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/lib/client";
import { readToken } from "@/sanity/lib/token";

/** Presentation calls this with a preview secret; the viewer token validates it and sets the draft mode cookie. */
const handler = client && readToken ? defineEnableDraftMode({ client: client.withConfig({ token: readToken }) }) : null;

export function GET(request: Request) {
  if (handler) return handler.GET(request);
  return new Response("Draft mode needs NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_READ_TOKEN.\n", {
    status: 501,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
