# Cloudflare

Cloudflare hosts the DNS for `marcopontili.com`. The site's record points straight at Vercel, with no Cloudflare proxy in between.

## The record

| Name | Type | Target | Proxy status |
| --- | --- | --- | --- |
| `nextfold` | CNAME | The target Vercel shows under **Settings > Domains** | DNS only (grey cloud) |

### Why DNS only

Vercel advises connecting directly ([vercel.com/guides/cloudflare-with-vercel](https://vercel.com/guides/cloudflare-with-vercel), read 2026-11-20). With Cloudflare's proxy in front:

- a second cache sits outside Vercel, so a publish that expires a page on Vercel can leave a stale copy at Cloudflare;
- Vercel's firewall loses visitor signals, and its Bot Protection ruleset does not work behind a reverse proxy;
- every request crosses one more network.

The site keeps one cache and one firewall, both at Vercel. [Caching](caching.md) and [Vercel: set up the firewall](vercel.md#set-up-the-firewall) cover them.

## Turn on DNSSEC

1. In the Cloudflare dashboard, open the `marcopontili.com` zone, then **DNS > Settings**.
2. Select **Enable DNSSEC**. Cloudflare shows a DS record.
3. Add that DS record at the domain registrar, unless Cloudflare is the registrar, in which case it is added for you.
4. Wait until the zone shows DNSSEC as active.

## Add CAA records

CAA records name the certificate authorities allowed to issue certificates for the domain, so no other authority can.

1. Find the authority behind the live certificate:

   ```bash
   openssl s_client -connect nextfold.marcopontili.com:443 -servername nextfold.marcopontili.com </dev/null | openssl x509 -noout -issuer
   ```

2. In **DNS > Records**, add a `CAA` record on `nextfold` with tag `issue` and that authority's CAA domain (for Let's Encrypt, `letsencrypt.org`).
3. Request the site and confirm the certificate still renews: Vercel lists it under **Settings > Domains**.

A CAA record on the apex `marcopontili.com` also applies to every subdomain without its own CAA record, so check the other sites on the domain before adding one there.
