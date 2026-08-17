# WonderTaps Project Plan

Status date: 17 August 2026 (Asia/Kolkata)

## Executive status

WonderTaps is feature-complete for its current static-site scope and its EC2 HTTP origin is healthy. Public launch is blocked by the registrar-level `clientHold` on `wondertaps.in`; HTTPS cannot be issued until DomainIndia removes that hold and the domain is published in DNS.

The root-domain static build succeeds and responsive browser checks pass at 320 × 568 portrait and 667 × 375 landscape. The remaining engineering quality gate is lint, which currently reports three errors. Physical-device audio playback still needs acceptance testing after the public site is reachable.

## Milestones

| Milestone | Status | Verified evidence | Exit criteria / next action |
|---|---|---|---|
| M1 — Product experience | Complete | Hindi, English, and Hinglish; age groups 1, 2–3, 4–5, and 6–7; four Moonlight Meadow activities present in the one-year-old experience | Maintain the universal, animal-led product direction |
| M2 — EC2 static build | Complete | `DEPLOY_TARGET=ec2 npm run build:pages` succeeds; `out/index.html` contains root-domain `/_next/static/` assets and no `/khelkatha/` base path | Rebuild before the next deployment |
| M3 — EC2 origin deployment | Complete, update pending | Nginx configuration test passes; homepage, `www` hostname, and compiled CSS asset return HTTP 200 at the origin | Deploy the latest commit as a new release; active release is still `f1d4d5c-ec2` while source is at `cca686c` |
| M4 — Public DNS | Blocked | Independent resolvers return `NXDOMAIN`; WHOIS shows Cloudflare nameservers but domain status is `clientHold` | Complete DomainIndia verification/KYC/payment checks or ask registrar support to remove `clientHold`; then verify NS, A, and CNAME records |
| M5 — HTTPS and redirects | Blocked | Direct TLS inspection still returns the Dwemory certificate, not a certificate containing `wondertaps.in` | After DNS works, issue the two-host Let's Encrypt certificate, test Nginx, reload, verify both HTTPS hostnames, and run renewal dry-run |
| M6 — Responsive acceptance | In progress | No horizontal overflow at 320 × 568 or 667 × 375; activity controls remain at least 48 px high; browser console has no errors or warnings during landscape check | Test on a physical 320 px-class phone in portrait and landscape |
| M7 — Audio acceptance | In progress | Animal audio is invoked from user click/tap handlers and failures degrade to visual play; six `.ogg` assets are present | On a physical phone, confirm the first deliberate animal tap starts sound and subsequent taps remain reliable |
| M8 — Engineering quality | Complete | Static production build, ESLint, and three WonderTaps product tests pass | Keep the product tests aligned with future experience changes |
| M9 — Public launch | Not started | Depends on DNS, HTTPS, and device acceptance | Complete M4–M8, run live smoke tests, and record launch approval |

## Verified current state

### Source and release

- Active branch: `codex/world-class-wondertaps`
- Source commit: `cca686c` (`Add EC2 static deployment configuration`)
- `origin/main` and `origin/codex/world-class-wondertaps` point to `cca686c`
- Active EC2 release: `/var/www/wondertaps/releases/f1d4d5c-ec2`
- Nginx virtual host: `/etc/nginx/conf.d/wondertaps.conf`
- Nginx syntax: valid; unrelated existing protocol-option warnings are emitted by Beacon/Pulse configurations

### Live origin checks

- `wondertaps.in` with direct EC2 routing: HTTP 200
- `www.wondertaps.in` with direct EC2 routing: HTTP 200
- Compiled CSS asset through the WonderTaps host: HTTP 200
- The WonderTaps virtual host remains isolated on port 80

### DNS and certificate

- Registrar: DomainIndia
- Registry status: `clientHold` and `addPeriod`
- Registered nameservers: `adelaide.ns.cloudflare.com`, `jacob.ns.cloudflare.com`
- Public result: `NXDOMAIN`; no NS, A, or CNAME answer is published
- Current certificate at the EC2 IP with WonderTaps SNI: `dwemory.com` / `www.dwemory.com` only

### Build and quality checks

- EC2 static export: pass
- Root-domain asset paths: pass
- ESLint: pass
- Three product tests verify the root-domain export, complete animal/audio asset set, social preview, and removal of personalized character references
- Raw `<img>` elements are intentional for the static cinematic artwork and browser-local family photos; the corresponding advisory rule is documented at the component boundary

## Critical path to launch

1. Remove the DomainIndia `clientHold`.
2. Confirm public Cloudflare delegation and the `@`/`www` records.
3. Confirm public HTTP for both hostnames.
4. Issue and validate the Let's Encrypt certificate and redirect behavior.
5. Deploy a fresh release from `cca686c` or the newer quality-fix commit.
6. Complete physical-phone portrait, landscape, and first-tap audio acceptance.
7. Run final live smoke tests and mark M9 complete.

## Launch acceptance checklist

- [ ] Domain status no longer includes `clientHold`
- [ ] Public NS answers are the two Cloudflare nameservers
- [ ] `wondertaps.in` routes to the intended EC2 origin
- [ ] `www.wondertaps.in` resolves and follows the chosen canonical behavior
- [ ] Certificate SANs include both hostnames
- [ ] HTTP redirects to HTTPS deliberately
- [ ] Homepage and critical CSS, JavaScript, image, and audio assets return HTTP 200
- [ ] No live asset URL contains `/khelkatha/`
- [ ] 320 px portrait has no clipping or horizontal overflow
- [ ] Phone landscape remains usable without clipped primary controls
- [ ] First deliberate animal tap produces sound on iOS Safari and Android Chrome
- [ ] Dwemory and other EC2 virtual hosts remain unaffected
- [ ] ESLint passes or every remaining warning is explicitly accepted
- [ ] Rollback release and command are recorded before launch

## Status update protocol

Update this file whenever a milestone changes. Record the verification date, command or observable evidence, and remaining exit criterion. Use only these status labels: `Not started`, `In progress`, `Blocked`, `Complete`, and `Complete, update pending`.
