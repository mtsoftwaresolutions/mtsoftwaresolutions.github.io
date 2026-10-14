> Repository cleanup: the recorded evidence and private archives below are now preserved outside the project. See REPOSITORY-CLEANUP.md for the exact location. These are historical paths, not missing runtime dependencies.

# Verification — restrained motion, 14 October 2026

Implemented: one-time gold background reveal behind the unchanged headline word `Software` / `برمجية`; service-link hover/keyboard feedback with logical arrow direction; short selective entrances with visible fallback, visited-element tracking and locale/preference/page lifecycle cleanup. Existing header, buttons, content, services and contact behavior remain. A pre-existing 4px tablet footer gutter overflow exposed by WebKit was corrected without hiding overflow.

- Baseline and final `npm run build`, `npm run check`, `npm test`: passed (32 generated documents, 1,362 links/anchors, 224 asset references, 20 unit groups).
- Final `npm run test:browser`: passed (390 bilingual page/viewport cases; 60 route axe scans plus configured Contact scan; simulated contact, native fallback, no-JS, reduced motion, removed routes and retained service preselection).
- `npm run test:motion`: passed in Chromium 151.0.7922.34 and WebKit 26.0, with 16 bilingual layouts per engine across 320/390/768/1119/1120/1279/1280/1440px. Checks cover timed reveal samples, unchanged headline text, logical origin, stable geometry, doubled headline text, 200% equivalent reflow, mouse/keyboard/touch, one-shot scrolling, live preference changes, unsupported/throwing APIs and repeated Contact locale changes preserving drafts.
- Additional early reduced-motion cancellation during the active Arabic hero reveal: passed. The final highlight remains readable and does not restart when normal motion returns.
- `npm run test:browsers`: WebKit passed all 60 retained locale route/layout checks. The command exits nonzero because Firefox launch timed out on this host; Firefox coverage is unavailable, not passed.
- Chromium layout-shift observation recorded 0 for each homepage language. WebKit does not expose this performance entry; stable page/hero geometry was verified through timed samples instead. No Lighthouse or field-performance improvement is claimed.
- Before/after page heights and hero heights at 390/1440px are unchanged in both languages. Final screenshots and reveal samples were visually inspected, including Arabic at 320px and doubled headline text.

Private source backup, plan, logs and current evidence:
`/Users/mohamedtamer0/Desktop/Work/MTSS Private Archive/motion-2026-10-14-164552/`

`baseline-source/` contains recoverable pre-edit files; `before/` holds baseline captures; `motion/` holds final screenshots, timed samples, motion report and geometry/early-cancellation evidence; `browser/` holds full browser/accessibility and cross-browser reports. These files are outside Git and the public build. Restore source selectively, preserving newer owner work, then install dependencies and rebuild.

Known pre-existing limit: doubling the root font size for the entire page at a 320px viewport causes header/footer overflow in both baseline and final versions. This is distinct from the successfully checked doubled headline and 200% equivalent browser reflow; whole-page text-only enlargement is not claimed fixed. Firefox is also unverified. No public deployment, real email/provider request, account change, Git commit or push occurred.

---

# Verification — corporate-only correction, 14 October 2026

**Local correction verified; external launch configuration pending.** The public site introduces the company and services only. No portfolio, sample application, internal demo, case study, mock product or project screenshot remains. This task did not publish, commit/push, change accounts or send real inquiries. Separately configured public hosting has not been assessed.

## Actual workspace and recovery

The project was relocated by the owner to `/Users/mohamedtamer0/Desktop/Work/mtsoftwaresolutions.github.io` and now has an owner-created Git checkout. Work continued there after confirming the matching source, routes and correction documents. Existing owner changes, including the license and tracked metadata files, were preserved.

Current recovery snapshot: `.private/baselines/corporate-resume-before-2026-10-14.tar.gz`, with source commit/inventory and SHA-256 in adjacent JSON. Earlier October 13 archives are absent from this checkout; their prior existence is historical, not a current recovery guarantee. Missing `.gitignore` and empty `.env.example` were restored. No secret values are in that example or the snapshot.

## Commands and fresh results

| Command / coverage | Result |
|---|---|
| `npm run build` | Pass: 32 generated company/service documents, local Bootstrap 5.3.8 and minified allowlisted assets |
| `npm run check` | Pass: 1,362 links/anchors and 224 asset references; language/RTL, one H1, IDs, logo hashes and private output boundaries |
| `npm test` | Pass: 20 groups; source/branding, isolated production metadata/CSP, server validation/security/rate/idempotency, timeline, native Contact ordering and showcase removal |
| `npm run test:browser` | Pass: 390 locale layouts, 60 locale axe scans plus configured Contact scan; additional root/deep-404 rendering and behavioral cases |
| `npm run test:browsers` | WebKit 26.0 passed 60 desktop/mobile page checks; Firefox unavailable after a 20-second launch timeout. Command exits nonzero for that limitation; Firefox is **not** a pass |
| `npm run audit` | Pass: six fresh mobile reports for English/Arabic Home, Contact and Web service |

Chromium version for captures/QA: 151.0.7922.34. The locale layout matrix includes all 30 locale documents at 320, 375, 390, 768, 991, 992, 1024, 1119, 1120, 1279, 1280, 1440 and 1920 CSS pixels. It recorded no page errors, broken images or horizontal overflow. The 61 WCAG A/AA scans recorded no violations. These are automated checks, not a comprehensive accessibility/security certification or physical-device test.

## Meaningful behavior checked

- All eight service destinations, four group/legacy anchors, service preselection and language counterparts.
- Corporate Home with confirmed facts, eight capabilities, seven audiences and four visible short process topics; About retains its audiences/sectors without fake people or client claims.
- All six removed locale showcase URLs return localized 404; their scripts/images are unavailable. Static guards also require removal from shared data, source assets/templates and generated documents. No hidden demo or misleading redirect remains.
- Root index/404 and unknown nested English/Arabic URLs render at 320/1440 without broken assets or overflow.
- Mobile menu, short 667×375 landscape navigation, Escape/focus return, skip link, resize state, scroll lock, FAQ and visible keyboard focus.
- Reduced motion, native no-JS navigation, individual app/vendor/content/views/rules failures and 200% equivalent reflow. Reflow uses a 720 CSS-pixel viewport at 2× device scale; actual browser-toolbar zoom is not claimed.
- Unconfigured Contact keeps direct email/phone early and the form collapsed/disabled. Network, malformed status and status-timeout cases fail closed.
- Configured Contact shows enabled fields and a prominent form. DOM/reading/keyboard order matches the displayed priority. Server-generated HTML has the same order without JavaScript.
- Contact draft, timeline/service, URL/history, RTL/LTR stylesheet and rapid/cancelled/failed language transitions.
- Intercepted validation, accepted/reset, duplicate/submitting, 422, 429, 502, 503, network and timeout cases preserve failed input. No inquiry contents enter storage or personal-data URLs.
- Missing fetch/AbortController/crypto retains native validation and an enabled configured form through a locale switch; UTF-8 native POST is intercepted. Provider acceptance, recipient/From/Reply-To and timeline/idempotency are separately covered with injected provider tests.
- Configuration status describes presence only. No real Resend request, inbox receipt or remote Redis transaction occurred.

## Visual review and page length

Fresh full-page screenshots cover all retained locale pages at 390/1440. Focused viewports cover Home, Services, About, Process, Contact and Web service; configured Contact captures are explicitly simulated. The private before/after gallery compares the October 13 mixed-state baseline with the corrected October 14 output.

Inspection reviewed bilingual first screens, typography/brand/direction, service summaries/details, About/audiences, Process/purchase questions, contact availability/form states, menu/footer and 404/privacy. No project imagery or showcase navigation appears in the final presentation.

Comparable total page heights at 390×900, including footer:

| Locale / page | Before correction px | Corrected px | Reduction |
|---|---:|---:|---:|
| en/Home | 6,643 | 5,034 | 24.2% |
| ar/Home | 6,253 | 4,743 | 24.1% |
| en/Services | 6,009 | 4,998 | 16.8% |
| ar/Services | 5,311 | 4,458 | 16.1% |
| en/About | 6,166 | 5,464 | 11.4% |
| ar/About | 5,632 | 4,870 | 13.5% |
| en/Process | 5,460 | 5,405 | 1.0% |
| ar/Process | 5,058 | 5,008 | 1.0% |
| en/Contact, unavailable | 2,405 | 2,350 | 2.3% |
| ar/Contact, unavailable | 2,307 | 2,258 | 2.1% |

The initial October 13 audit's Arabic Home/Services measurements were 7,058/8,144px. They are historical context, not the direct mixed-state baseline above. Process retains useful purchase questions; it was not shortened by concealing those topics.

## Fresh Lighthouse mobile results

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---|---|---|
| en/Home | 100 | 100 | 100 | 66 | 1.7s | 0.003 | 0ms |
| ar/Home | 100 | 100 | 100 | 66 | 1.7s | 0 | 0ms |
| en/Contact | 100 | 100 | 100 | 66 | 1.7s | 0 | 0ms |
| ar/Contact | 100 | 100 | 100 | 66 | 1.7s | 0 | 0ms |
| en/Web service | 100 | 100 | 100 | 66 | 1.7s | 0.003 | 0ms |
| ar/Web service | 100 | 100 | 100 | 66 | 1.7s | 0 | 0ms |

FCP was 1.1s on all six. SEO 66 reflects deliberate local indexing protection without a real production origin. No fake domain was used to improve it. The isolated production test verifies canonical/hreflang, 28 sitemap entries, Organization data/CSP and mismatched-origin rejection; that fixture is not deployed.

Lighthouse still suggests about 29KiB unused Bootstrap CSS and 380–420ms render-blocking savings. English Contact also reports a scripting/main-thread warning despite zero TBT and a 100 score. A separate normal 5.5-second local observation recorded no long tasks. The warning remains documented; it is not declared fixed or assumed to be field behavior. These are lab measurements, not field Core Web Vitals.

## Evidence and release checks

- `screenshots/corporate-only-2026-10-13/before/`: mixed-state baseline images and metrics.
- `screenshots/corporate-only-2026-10-14/after/browser-report.json`: final layout/accessibility/behavior outcomes and heights.
- `cross-browser-report.json`: actual engine coverage and Firefox limitation.
- `lighthouse/`: six raw reports and scores.
- `height-comparison.json`, `visual-review-report.json`, `review.html`: comparable measurements, browser version/private simulations and visual review gallery.
- `.private/logs/`: command output for this continuation.
- `.private/releases/`: final archives, SHA-256 manifests and extraction verification when assembled.

Final release assembly/extraction passed October 14. The archived server itself passed the retained-route, removed-route, private-boundary and unavailable-contact smoke checks; archive/public hashes and extraction passed. See RELEASE-READINESS-2026-10-14.md for the exact private artifact path. Off-device archive/storage backup and a host-specific release switch remain owner operational actions.

## External launch status

Local corporate-site corrections and browser checks are complete within the stated engine limitation. Real HTTPS domain/hosting/TLS/proxy, verified sender/server secrets, persistent SQLite or distributed Redis with stable salt, approved retention/provider/log arrangements and specifically authorized provider acceptance **and** inbox receipt remain pending. No claims about live hosting, DNS, public indexing, remote storage or mailbox delivery are made.

Optional verified people biographies may be added later. Private client projects remain excluded under owner instruction, not missing launch content. No prices, guarantees, team claims, client results or operational policies were invented.
