# MT Software Solutions

Arabic/English **company introduction website** using Bootstrap 5.3.8, shared generated HTML, plain CSS/JavaScript and a private Node/Resend contact endpoint.

Locally implemented and verified on October 14, 2026; external production configuration remains pending. This task performed no public deployment, live provider acceptance or inbox test. Hosting configured separately by the owner has not been assessed here. The owner's latest instruction excludes every portfolio, work sample, internal demonstration, case study, mock product and project screenshot.

## Run locally

Node.js 22.16+ and npm are required.

```sh
npm ci
npm run build
npm run dev
```

Open the printed local URL, normally `http://127.0.0.1:4318/ar/index.html` or `/en/index.html`. The server serves only `dist/` and the contact API. Rebuild and refresh after source edits; there is no watcher. Use HTTP, not direct file opening.

## Company presentation

- **Home:** clear software offering/contact action, brief company introduction and confirmed facts, eight services, seven audience names linked to About, four concise delivery topics, FAQ and contact invitation. No project media or showcase.
- **Services:** eight capabilities in four preserved groups; each service has a durable detail page. Three compact native disclosures help visitors choose how to begin. They are ways to discuss the existing services, not fixed-price packages.
- **Service pages:** need, possible work/deliverables, starting inputs, related services and preselected inquiry. No project evidence sections.
- **About:** confirmed company information, approach, all seven intended audiences and existing sector needs. No invented clients, people or biographies.
- **Process:** scope/review/delivery stages and questions to agree about testing, acceptance, handover, ownership/licensing, hosting costs, changes and maintenance. No unsupported policies or response deadlines.
- **Contact:** email and phone first when sending is unavailable, a collapsed disabled form and a short next-step explanation. Configured sending opens/enables the concise form. Optional target timeline includes an unsure option.
- **Privacy/404:** shared company branding, readable bilingual content and root-safe assets for unknown nested URLs.

Cream, forest-green and gold remain. Typography, concise sections, restrained icons and original branding carry the presentation. Desktop navigation begins at 1120px and its additional inquiry action at 1280px. The native mobile disclosure works without JS; enhancement provides Escape/focus/landscape scrolling and resize behavior.

## Routes and shared source

32 generated documents: seven pages per locale (`index`, `services`, `process`, `about`, `contact`, `privacy`, `404`), eight `service-ID.html` pages per locale, and root index/404.

Preserved service IDs: `custom`, `web`, `mobile-app`, `backend-api`, `integration`, `consulting`, `support`, `cloud`. Preserved groups: `business`, `mobile`, `connected`, `operations`.

Legacy `services.html#service-id` and group links still work. New service links use `service-ID.html`. Contact preselection uses `contact.html?service=integration`, for example. Locale links retain service/page/anchor. Contact changes language in memory, preserving draft values, timeline and selected service, with atomic RTL/LTR stylesheet switching. Drafts never enter browser storage or URLs.

Removed `work.html`, `case-request-workflow.html` and `request-demo.html` in both languages return localized 404. Their data, scripts, styles and images were removed; they cannot be rebuilt as public features. Private historical captures and recovery archives are not current website features.

| Source | Responsibility |
|---|---|
| `js/content.js` | Shared company facts, bilingual capability/audience/copy and project-discussion topics |
| `js/views.js` | Shared page templates and in-memory Contact translation |
| `js/app.js` | Navigation, Contact/locale state, email copy and reduced-motion enhancement |
| `js/contact-rules.js` | Browser/server validation, field limits and service/timeline IDs |
| `css/styles.css` | Company presentation, responsive navigation and form states |
| `scripts/routes.cjs` | Retained route inventory shared by build/check/browser tests |
| `scripts/build.cjs` | Static generation, local Bootstrap, minification, metadata and strict asset allowlist |
| `server/` | Private HTTP server, Resend integration and persistent abuse protection |

Edit source, then regenerate HTML. Do not hand-edit generated pages.

## Facts and branding

Name: MT Software Solutions. Email: **mtsscorporate@gmail.com**. Phone: **+201032105166**. Location: **Giza, Egypt / الجيزة، مصر**. Founded **December 2024 / ديسمبر 2024**, month precision only. [Facebook](https://www.facebook.com/mtss0/) and [LinkedIn](https://www.linkedin.com/company/mtss0) come from shared company data.

`official-logo.jpg` remains unchanged. The full `logo-full.svg` embeds the original raster; the compact `logo-symbol.svg` is a reconstructed derivative, not a supplied vector master. Header/footer/icons preserve the mark without RTL mirroring. See `docs/LOGO-ASSETS.md`. Versioned asset URLs refresh changed styles/templates/branding.

## Contact and privacy

`/api/contact/status` describes configuration presence, not verified delivery. `/api/contact` uses Resend with a verified From address, visitor Reply-To and fixed company recipient. Provider acceptance and actual mailbox receipt are separate.

Shared validation covers required fields, optional organization/phone/service/timeline, limits and supported values. Requests are bounded to 32 KiB. Honeypot, same-origin checks, rate limits and idempotency remain. Failure retains enhanced-form input. No live test sender or inquiry database is added.

Server HTML reflects configuration before JavaScript runs: unconfigured fields are disabled; configured native submission remains available without supported AJAX APIs, including after an in-page language change. Email and telephone remain useful regardless of configuration. No third-party analytics or advertising trackers are included.

Use `.env.example` as a variable-name reference. Keep secrets in private environment/host secret management. Runtime supports persistent SQLite on an explicit single-instance host, or shared distributed Redis. See `docs/PRODUCTION-SETUP.md`.

## Verification

```sh
npm run build
npm run check
npm test
npm run dev
# With preview running in another terminal:
npm run test:browser
npm run test:browsers
npm run audit
```

Set `TEST_URL`, `SCREENSHOT_DIR` or `CHROMIUM_PATH` when needed. Contact browser requests are intercepted or simulated; tests do not send real mail. Final checks: 20 unit groups, 390 Chromium locale layouts plus root/deep 404, 61 axe scans, 60 WebKit page checks and six mobile Lighthouse runs. Firefox launch is unavailable on this host and reported as a non-pass limit. Release extraction/archived-server checks passed.

Current corporate-only evidence belongs in `screenshots/corporate-only-2026-10-14/after/` (final), with October 13 before captures retained separately, with final results in `docs/VERIFICATION.md`. Older company/details and interrupted implementation evidence remains historical. It is not proof of the corrected final version.

## Private recovery and release

The current verified snapshot is `.private/baselines/corporate-resume-before-2026-10-14.tar.gz` with a SHA-256 manifest. Earlier snapshots were not carried into the relocated checkout. Restore selectively from a new private extraction directory and preserve unrelated newer work. The owner supplied the Git checkout; this task did not initialize, commit or push it.

```sh
npm run release
node scripts/verify-release.cjs /absolute/path/to/private/release-directory
```

The release command builds/checks/tests and creates private runtime/source archives with hashes. Verification extracts privately and checks the shipped server, retained routes, removed routes and public boundaries. See `docs/RELEASE-ROLLBACK.md`.

Serve only `dist/` publicly. Keep docs, screenshots, business materials, backups, scripts, server source, environment secrets and runtime databases private. Private business drafts from the interrupted broader work are retained without expansion; they are not a public product or part of this site's presentation.

## External setup

A real HTTPS `SITE_URL` is required at build/runtime for canonical/hreflang, Open Graph URLs, sitemap and Organization/CSP metadata. Without it, robots deliberately blocks indexing. Do not deploy an isolated test domain. Static hosting alone does not provide the contact API.

Hosting/TLS/proxy, verified sender and credentials, persistent rate storage, approved handling/retention policies and a specifically authorized acceptance/inbox test remain external requirements. Read `docs/PRODUCTION-SETUP.md`; local test results do not establish a public launch.

## Repository size and local artifacts

Dependencies (`node_modules/`), built output (`dist/`), screenshots, runtime files and private business/recovery materials do not belong in Git. Install dependencies with `npm ci` and regenerate output with `npm run build`. Keep the generated root/locale pages and their used assets because they support the existing static presentation. The cleanup removed unused font files and retired `logo-web` assets without changing the active logo.

Existing QA reports, private operations drafts, release/baseline archives and historical materials have been moved outside the project. Their preserved location and recovery steps are in [REPOSITORY-CLEANUP.md](docs/REPOSITORY-CLEANUP.md). Future test/release commands recreate ignored local outputs as needed.

## Restrained motion

The homepage highlights one intact word (`Software` / `برمجية`) with a one-time gold background reveal from the language's logical start. Headline text stays readable. Service destination links use subtle background feedback and directional arrow movement for mouse and keyboard; touch has no hover-only movement. Entrances remain short and selective, with visible static fallbacks and cleanup during Contact translation, reduced-motion changes and page restoration.

Run `npm run test:motion` with the preview running for targeted Chromium/WebKit behavioral checks. Set `TEST_URL` and `SCREENSHOT_DIR` for private evidence; this command defaults to the operating system's temporary directory rather than the repository. No animation dependencies were added. Current results and limitations are in [VERIFICATION.md](docs/VERIFICATION.md).
