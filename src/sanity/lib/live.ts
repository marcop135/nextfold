import { defineLive } from "next-sanity/live";
import { client } from "./client";
import { readToken } from "./token";

/**
 * Live Content API: published changes refresh open pages, and draft mode reads drafts with the viewer token.
 * The token stays on the server, so live drafts work inside Presentation only.
 */
export const live = client ? defineLive({ client, serverToken: readToken || false, browserToken: false }) : null;
