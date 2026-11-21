# Sanity setup

Connect the app to your own Sanity project. The Free plan covers everything this project uses.

## Plan and limits

From [sanity.io/pricing](https://www.sanity.io/pricing), checked 2026-11-17:

| Plan | Price | Limits that matter here |
| --- | --- | --- |
| Free | $0 | 20 seats, 2 public datasets, 10k documents, 1M API CDN requests and 250k API requests a month, 100 GB bandwidth and assets |
| Growth | $15 per seat a month | Private datasets, 25k documents. New projects get Growth features free for a limited time; the page does not state the length |

The pricing page lists no card requirement for Free. A public dataset is enough: published content is meant to be public, and drafts still need an authenticated request.

## Steps

1. Sign up at [sanity.io](https://www.sanity.io/get-started) with Google, GitHub, or email.
2. In [sanity.io/manage](https://www.sanity.io/manage), create a project named `Next Fold` with a dataset named `production`, visibility public.
3. Copy `.env.example` to `.env` if you have not yet, then set the project ID:

   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=<project id>
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

4. In the project, open **Settings > API settings > CORS origins** and add `http://localhost:3100` with **Allow credentials** on. The embedded Studio needs credentials.
5. Restart `npm run dev`, open http://localhost:3100/studio, and log in with the same account.
6. Copy the seed content into the dataset:

   ```bash
   npx sanity login
   npm run seed:import
   ```

   This creates the `home`, `inside-a-page`, `guardrails`, `caching`, and `system` pages in English and German, and the site settings for both languages. Documents that already exist stay as they are, so a second run never overwrites edits.
7. Open http://localhost:3100. The line above the footer reads "This page comes from the Sanity dataset."
8. For Presentation and Visual Editing, create a viewer token. It reads drafts, so it stays on the server:

   ```bash
   npx sanity tokens add "Next Fold preview" --role=viewer
   ```

   Set it as `SANITY_API_READ_TOKEN` in `.env` and in the Vercel project's environment, then restart `npm run dev`.
9. Open **Presentation** in the Studio. The page loads in draft mode with click-to-edit overlays, and edits show before you publish.

10. For publishes to refresh cached pages when no browser has the site open, add a webhook in **sanity.io/manage > API > Webhooks**:

    | Setting | Value |
    | --- | --- |
    | URL | `https://<your domain>/api/revalidate` |
    | Dataset | `production` |
    | Trigger on | Create, Update, Delete |
    | Filter | `_type in ["page", "siteSettings"]` |
    | Projection | `{_type, "slug": slug.current}` |
    | HTTP method | POST |
    | Secret | A random string, also set as `SANITY_REVALIDATE_SECRET` in Vercel |

    The route checks the signature, then expires the page, the page list behind the sitemap and `llms.txt`, or the site settings.

Until Sanity has a published page for a slug and language, the seed page from [`src/content/seed`](../src/content/seed) renders instead: `home`, `inside-a-page`, `guardrails`, `caching`, and `system`, in English and German. Published changes reach open pages through the Live Content API.

## Rename a field

Stored documents keep the old field name until a migration moves the data, so a rename ships in three steps:

1. Rename the field in [`sections.ts`](../src/sanity/schemaTypes/sections.ts) and update the components that read it.
2. Keep reading the old name in [`queries.ts`](../src/sanity/lib/queries.ts) until the data moves, for example `_type == "hero" && !defined(link) && defined(cta) => { "link": cta }`, then run `npm run typegen`.
3. Create a migration, dry run it, then apply it:

   ```bash
   npx sanity migrations create "<title>"
   npx sanity migrations run <id>
   npx sanity migrations run <id> --no-dry-run
   ```

   `<title>` describes the change. The CLI prompts for options and writes `migrations/<id>/index.ts`; `<id>` is that folder name. The dry run lists the patches and writes nothing. After the apply, drop the old name from the query and run `npm run typegen` again.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| `/studio` shows "Studio needs a Sanity project" | `NEXT_PUBLIC_SANITY_PROJECT_ID` is empty, or the dev server was not restarted |
| Studio login loops or shows a CORS error | `http://localhost:3100` is missing from the CORS origins, or has credentials off |
| The page still says it comes from the seed copy | The Page with slug `home` is a draft; publish it |
| The webhook returns 401 | The secret in the webhook and `SANITY_REVALIDATE_SECRET` differ |
| Presentation shows "Draft mode needs ..." | `SANITY_API_READ_TOKEN` is empty, or the dev server was not restarted |
