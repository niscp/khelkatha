# WonderTaps Handoff

Last updated: 17 August 2026 (Asia/Kolkata)

## Current state

WonderTaps is a multilingual, age-configured learning playground for children. The one-year-old experience is a full-screen Moonlight Meadow with four activities: Animal Safari, Firefly Garden, Who Is Calling?, and Rhythm Parade.

The application has been installed on the development EC2 server and passed HTTP checks at the origin. Public DNS and HTTPS still require a fresh live verification because the last verification command was interrupted.

## Source control

- Repository: `https://github.com/niscp/wondertaps`
- Working branch: `codex/world-class-wondertaps`
- The same changes were pushed to `main`.
- Latest product commit: `a7974de` (`Redesign WonderTaps as universal toddler playground`)
- Local project: `/Users/nishanksingh/Documents/Codex/2026-08-07/i-want-to-build-a-website/wondertaps-worldclass`

Important recent commits:

- `cca686c` — EC2 static-build and Nginx deployment configuration
- `f1d4d5c` — toddler landscape fixes
- `116375c` — mobile responsiveness fixes
- `4c454a9` — full-screen toddler play interface
- `167671f` — original cinematic toddler games

## Hosting

- AWS account: `429553084140`
- EC2 name: `gmc_dev`
- Instance ID: `i-0a727bc1f8fd1d76a`
- Region/AZ: `ap-south-1` / `ap-south-1b`
- Elastic IP: `13.126.73.142`
- SSH user: `ubuntu`
- SSH key on Nishank's Mac: `/Users/nishanksingh/Desktop/side-projects/keys/gmc-agent.pem`

Do not print, copy into the repository, or commit the PEM contents.

The EC2 server also hosts Dwemory and GetMeCab development services. WonderTaps was added as an isolated Nginx virtual host; do not replace the default server or the Dwemory configuration.

## Deployed files

- Deployment root: `/var/www/wondertaps`
- Active symlink: `/var/www/wondertaps/current`
- Active release: `/var/www/wondertaps/releases/a7974de-ec2`
- Nginx configuration: `/etc/nginx/conf.d/wondertaps.conf`
- Repository copy: `deploy/ec2/wondertaps.conf`
- ACME webroot: `/var/www/certbot`

The origin smoke tests returned HTTP 200 for both the homepage and a compiled CSS asset.

## Build

GitHub Pages and EC2 require different asset paths. Do not deploy the GitHub Pages artifact to EC2.

Build the root-domain EC2 artifact with:

```bash
DEPLOY_TARGET=ec2 npm run build:pages
```

Verify that the artifact does not contain the GitHub Pages base path:

```bash
rg '/khelkatha/' out/index.html
```

The command should return no matches. EC2 assets should begin with `/_next/static/`.

The default `npm run build` uses Vinext and previously failed locally because the optional Darwin Rolldown native binding was missing. The Next.js `build:pages` command is the proven static-export path.

## Deployment procedure

Use a unique release name, preferably the Git commit plus `-ec2`.

1. Build and validate locally.
2. Archive `out/`.
3. Upload the archive with `scp` using `gmc-agent.pem`.
4. Extract into `/var/www/wondertaps/releases/<release>`.
5. Set ownership to `www-data:www-data`.
6. Switch `/var/www/wondertaps/current` with `ln -sfn`.
7. Run `sudo nginx -t` before reloading Nginx.
8. Reload Nginx and smoke-test with the WonderTaps Host header.

Origin smoke tests:

```bash
curl -I -H 'Host: wondertaps.in' http://127.0.0.1/
curl -I -H 'Host: wondertaps.in' http://127.0.0.1/_next/static/<actual-css-file>
```

Expected result: HTTP 200 for both.

## DNS

Registrar: DomainIndia. DNS provider: Cloudflare.

Cloudflare nameservers configured at the registrar:

- `adelaide.ns.cloudflare.com`
- `jacob.ns.cloudflare.com`

Required Cloudflare records:

- `A` — `@` → `13.126.73.142`
- `CNAME` — `www` → `wondertaps.in`

The four old GitHub Pages A records (`185.199.108.153` through `185.199.111.153`) were removed. Do not restore them while EC2 is the intended origin.

Verify public delegation and records:

```bash
dig +short NS wondertaps.in @1.1.1.1
dig +short A wondertaps.in @1.1.1.1
dig +short CNAME www.wondertaps.in @1.1.1.1
```

Expected NS values are the two Cloudflare nameservers, and the origin should ultimately route to the EC2 deployment.

## HTTPS: remaining work

Before issuing a certificate, confirm that public DNS resolves and that port 80 serves WonderTaps for both hostnames.

Then run on EC2:

```bash
sudo certbot --nginx -d wondertaps.in -d www.wondertaps.in --redirect
sudo nginx -t
sudo systemctl reload nginx
```

Verify:

```bash
curl -I https://wondertaps.in/
curl -I https://www.wondertaps.in/
sudo certbot renew --dry-run
```

Expected result: valid WonderTaps certificate, HTTP 200 at the root, and either HTTP 200 or a deliberate canonical redirect for `www`.

Before WonderTaps received its own certificate, the EC2 HTTPS default served the Dwemory certificate. Do not mistake that for a valid WonderTaps TLS deployment.

## Rollback

Rollback does not require deleting files or changing other Nginx sites.

1. Point `/var/www/wondertaps/current` to the previous known-good release.
2. Run `sudo nginx -t`.
3. Reload Nginx.
4. Repeat the Host-header smoke tests.

Example:

```bash
sudo ln -sfn /var/www/wondertaps/releases/<previous-release> /var/www/wondertaps/current
sudo nginx -t
sudo systemctl reload nginx
```

Rollback triggers:

- Homepage or critical assets return a non-200 response.
- The page references `/khelkatha/` assets on the custom domain.
- WonderTaps changes affect Dwemory or another existing EC2 virtual host.
- TLS serves a certificate that does not include `wondertaps.in`.

## Product notes

- Supported languages: Hindi, English, and Hinglish.
- Supported age groups: 1, 2–3, 4–5, and 6–7 years.
- The one-year-old mode is deliberately app-like, full-screen, and optimized for 320 px portrait through phone landscape.
- Cinematic animal artwork is stored in `public/wondertaps-animal-world.png`.
- Social sharing artwork is stored in `public/og.png`.
- Animal audio files are stored under `public/sounds/`.
- Personalization data and recorded praise audio are stored client-side in the browser; there is no application database for the current static site.

## Immediate next actions

1. Re-run the public DNS checks.
2. Confirm HTTP access for both `wondertaps.in` and `www.wondertaps.in`.
3. Issue the Let's Encrypt certificate and enable HTTPS redirect.
4. Test the live site on a 320 px phone and in landscape.
5. Confirm animal sounds begin after the first user tap, as required by mobile browser autoplay rules.
