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

   This creates the `home`, `inside-a-page`, and `guardrails` pages and the site settings. Documents that already exist stay as they are, so a second run never overwrites edits.
7. Open http://localhost:3100. The line above the footer reads `Content source: sanity`.
8. For Presentation and Visual Editing, create a viewer token. It reads drafts, so it stays on the server:

   ```bash
   npx sanity tokens add "Next Fold preview" --role=viewer
   ```

   Set it as `SANITY_API_READ_TOKEN` in `.env` and in the Vercel project's environment, then restart `npm run dev`.
9. Open **Presentation** in the Studio. The page loads in draft mode with click-to-edit overlays, and edits show before you publish.

Until Sanity has a published page for a slug, the seed page with that slug from [`seed.ts`](../src/content/seed.ts) renders instead: `home`, `inside-a-page`, and `guardrails`. Published changes reach open pages through the Live Content API.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| `/studio` shows "Studio needs a Sanity project" | `NEXT_PUBLIC_SANITY_PROJECT_ID` is empty, or the dev server was not restarted |
| Studio login loops or shows a CORS error | `http://localhost:3100` is missing from the CORS origins, or has credentials off |
| The page still reads `Content source: seed` | The Page with slug `home` is a draft; publish it |
| Presentation shows "Draft mode needs ..." | `SANITY_API_READ_TOKEN` is empty, or the dev server was not restarted |
