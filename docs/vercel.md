# Vercel

How the Vercel project behind the site is set up, and how to check it. Deploy steps are in [Operations: release](operations.md#release).

## Project settings

| Setting | Value | Where |
| --- | --- | --- |
| Framework | Next.js | [`vercel.json`](../vercel.json); set the dashboard preset to match |
| Function region | `fra1` (Frankfurt) | `vercel.json` |
| Git integration | None: production deploys from a clean `main` checkout with the Vercel CLI | Dashboard, **Settings > Git** |
| Domain | `nextfold.marcopontili.com`, DNS at [Cloudflare](cloudflare.md) | Dashboard, **Settings > Domains** |

### Why `fra1`

Server functions run only when a request misses the cache: the first render after a publish, Markdown twins, Open Graph cards, and `/api/*`. Cached pages come from Vercel's edge network wherever the functions run. Frankfurt puts those uncached requests near a European audience and near the Matomo server the proxy reports AI-assistant hits to. Sanity is read through its global CDN, so the region does not change Sanity latency. The region does not limit where Vercel processes requests; the [privacy notice](https://nextfold.marcopontili.com/privacy) names Vercel Inc. (United States) as processor.

## Environment variables

Set for **Production** in **Settings > Environment Variables**. [The README](../README.md#sanity-setup) lists what each one does.

| Variable | Kind |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` | Public |
| `NEXT_PUBLIC_SITE_URL` | Public |
| `NEXT_PUBLIC_MATOMO_SITE_ID`, `NEXT_PUBLIC_MATOMO_CONTAINER_ID` | Public |
| `SANITY_REVALIDATE_SECRET` | Secret |
| `SANITY_API_READ_TOKEN` | Secret, server only |

Preview deployments get `noindex` from [`site.ts`](../src/lib/site.ts) (`VERCEL_ENV=preview`).

## Set up the firewall

1. In the dashboard, open **Firewall** for the project.
2. Turn on **Bot Protection** in log mode. Leave **AI bots** allowed: the site publishes Markdown and `llms.txt` for them.
3. Add a custom rule: request path equals `/api/revalidate` and method is not `POST`, action **Deny**. The publish webhook only ever sends `POST`.
4. After a week, read the firewall log. Switch Bot Protection to challenge only when it shows no verified bots or AI assistants being flagged.

## Check the setup

```bash
vercel inspect <deployment url> --scope <team>
vercel firewall status --project nextfold --scope <team>
```

`inspect` lists each function with its region (`[fra1]`); `firewall status` shows Bot Protection and the custom rules. `<deployment url>` is the URL `vercel deploy` prints, and `<team>` is the Vercel team the project belongs to.
