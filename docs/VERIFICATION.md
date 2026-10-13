> Latest bounded company-details update: see [COMPANY-DETAILS.md](COMPANY-DETAILS.md), `screenshots/company-details-after/browser-report.json` and `company-details-report.json`. Phone/location/social/founding facts and metadata are now confirmed. The redesign metrics and Lighthouse results below describe the previous broader correction and were not rerun as new performance claims for this update.

# Verification — company presentation correction, 11 October 2026

**Prepared for production configuration.** All results below belong to the current company correction. Earlier reference/upgrade reports are historical. No live deployment, actual provider acceptance, inbox receipt or remote Redis transaction has occurred.

## Automated checks

- Build succeeds: 16 generated pages, local Bootstrap 5.3.8, minified public assets. No environment file is present in this checkout; the preview was explicitly started with an empty provider configuration and a non-sending injected limiter.
- `npm run check`: 16 pages, 732 links/anchors, 112 asset references; language/direction, one matching Bootstrap stylesheet/bundle, source/embedded logo hashes, icon paths and private-file build boundaries.
- `npm test`: 13 test groups passed. Includes branding/ICO/source silhouette, isolated production metadata/CSP/deep 404, validation/UTF-8/phone/length/honeypot, provider recipient/From/Reply-To/idempotency, simulated provider errors/timeout, SQLite persistence and simulated atomic Redis, origin/content type/payload/private boundaries. New presentation guards verify canonical service details, visible process, early availability and no regeneration/deployment of retired artwork.
- Chromium 151: 14 locale routes × 9 widths (320, 375, 390, 768, 991, 992, 1024, 1440, 1920): **126 layouts**, no horizontal overflow or page errors. **28 axe WCAG A/AA scans**, no recorded violations. Header 81px; proportional compact mark and LTR wordmark.
- Behavioral tests: mobile menu/landscape reachability, Escape/focus/resize/scroll lock, skip link and FAQ; eight service destinations/unique details/all group anchors, Mobile discoverability, preselection; single About principles, audience/sector visibility and process outputs/reviews.
- Contact frontend tests intercept API requests: client and server-like field errors, submitting/duplicate prevention, acceptance/reset, 422/429/502/503/network/timeout, failed-value retention, copy email and native UTF-8 POST when fetch/AbortController/crypto is missing. These are **simulations**, never evidence of real delivery.
- Contact availability tests cover missing configuration, network failure, malformed response and five-second timeout; all fail closed with direct email before the fields.
- Language tests cover draft/URL/history preservation, rapid duplicate selection, cancellation back to the active language, final RTL stylesheet consistency, reload and failed stylesheet feedback. No draft browser storage is used.
- No-JS and separate app/Bootstrap/content/views/contact-rules script failures retain one usable native navigation. Reduced-motion has no running animations. 200% **equivalent reflow** uses 720 CSS pixels/2× scale, not an actual browser-toolbar zoom test.
- Additional header transition measurements at 1119/1120/1279/1280/1440/1920px and 320/375/390px brand/toggle checks found no collision; typography is not shrunk to force a 992px desktop layout.
- WebKit 26.0: 12 English/Arabic Home/Services/Contact desktop/mobile checks passed, including logo/overflow, menu/FAQ/anchors and simulated Contact/locale/copy. Firefox launch timed out on this host; `test:browsers` exits nonzero and records **unavailable**, not a pass. No real Safari device or installed Firefox release is claimed.

## Visual review and measurements

Fresh screenshots cover all seven pages in both languages at 390/1440px; header/logo/footer/menu, focused viewport details, visible process, Contact availability and 2× branding are also retained. Visual review examined the homepage composition, open service rows and details, About/industry layout, all process stages, Contact, Privacy/404 and RTL text/directional treatment. Diagram captions are localized; no package imagery, oversized portrait stage or floating project obstruction remains.

Measured total page heights at 390×900 CSS pixels, including the footer:

| Page | Before px | After px | Change |
|---|---:|---:|---|
| en/index | 14,035 | 7,399 | 47% reduction |
| en/services | 14,967 | 8,669 | 42% reduction |
| en/about | 6,264 | 5,024 | 20% reduction |
| en/process | 4,771 | 4,243 | 11% reduction |
| en/contact | 2,926 | 3,001 | 3% increase |
| ar/index | 13,604 | 6,956 | 49% reduction |
| ar/services | 13,747 | 8,090 | 41% reduction |
| ar/about | 5,908 | 4,495 | 24% reduction |
| ar/process | 4,434 | 3,940 | 11% reduction |
| ar/contact | 2,959 | 2,997 | 1% increase |

Contact total length is slightly greater because availability and preparation guidance remain visible. The actual first field moved from **885px to 631px** in English and **856px to 564px** in Arabic. It follows the availability explanation rather than a lengthy email introduction. No required services or meaningful detail content were hidden to reduce heights.

## Lighthouse — latest local mobile run

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---|---|---|
| en/index | 100 | 100 | 100 | 66 | 1.7 s | 0.003 | 0 ms |
| en/contact | 100 | 100 | 100 | 66 | 1.8 s | 0 | 0 ms |
| ar/index | 100 | 100 | 100 | 66 | 1.7 s | 0 | 0 ms |
| ar/contact | 100 | 100 | 100 | 66 | 1.7 s | 0 | 0 ms |

FCP is 1.1s on all four pages. Contact status space was reserved after an earlier run recorded an English Contact CLS of 0.074; the final run records 0 on both Contact pages. Scores are investigation evidence, not field Core Web Vitals or proof of company suitability.

SEO 66 is expected while SITE_URL is absent and robots intentionally prevents indexing. The isolated production build verifies metadata/sitemap/CSP without publishing a fake domain. Lighthouse still reports approximately 29KiB unused Bootstrap CSS and roughly 410–420ms render-blocking opportunities. Bootstrap is retained as requested rather than replacing it with an unverified pruned build. One English Contact trace also attributes roughly 4s scripting to the document despite zero TBT and a 100 performance score; an independent normal local 5.5-second observation recorded no long tasks. The trace warning is retained, not declared solved or assumed to be field behavior.

## Evidence locations

- `screenshots/company-before/`: fresh baseline pages, header/footer/menu and baseline.json.
- `screenshots/company-after/`: current bilingual page images, header/footer/menu, browser-report.json, height-comparison.json, cross-browser-report.json, 200% equivalent reflow and normal-contact-tasks.json.
- `screenshots/company-after/review.html`: side-by-side before/after gallery at matching widths; open locally. This private review file is excluded from the production build.
- `screenshots/company-after/components/`: focused hero/service/process/contact/privacy/404 viewports, 2× branding and header-breakpoints.json.
- `screenshots/company-after/lighthouse/`: raw four-page reports and scores.json.

Screenshots are captured by the browser, not fabricated. Full-page captures may include ordinary sticky-header stitching; focused viewport evidence records actual interaction regions. Native icon bytes/proportions are tested; operating-system home-screen installation and browser-toolbar favicon rendering are not claimed.

## Remaining external work

Configure the real HTTPS domain/host and sender verification/secret, durable rate-storage topology/salt, proxy/TLS, actual provider acceptance and a controlled receipt test in mtsscorporate@gmail.com. Review Privacy against actual business retention/provider arrangements. No authentication/CMS/admin/inquiry database was added. Startup, build, preview, deployment preparation and rollback are documented in README and PRODUCTION-SETUP.md.
