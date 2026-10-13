# Confirmed company details — 11 October 2026

## Audit and scope

The shared company data previously contained only name/email. Footer and Contact offered email only; About had no location/founding facts. The existing production-build test explicitly forbade address/telephone and must now reflect owner-confirmed information. No Git checkout exists; none was initialized.

Owner confirmation in this conversation: phone +201032105166; location Giza, Egypt; Facebook https://www.facebook.com/mtss0/; LinkedIn https://www.linkedin.com/company/mtss0. The owner subsequently confirmed **December 2024** as the founding period. A day is not known and must not be invented. Copyright year remains independent.

The public LinkedIn profile lists Founded 2024 and Giza. Facebook inspection was throttled; the exact owner-confirmed URL remains authoritative. The owner's authenticated LinkedIn edit URL was not accessed. No profile posts, course promotions, employee counts, legal classifications or other details were imported.

## Checklist

- [x] Inspect shared data/templates/styles/build/checks/backend assumptions and preserve source baseline.
- [x] Confirm founding period with owner: December 2024, month precision.
- [x] Centralize phone/location/social/founding data and bilingual labels.
- [x] Add footer, Contact and About facts; preserve compact header/form priority.
- [x] Add accessible local social icons and correct LTR tel/email links.
- [x] Update Organization data and matching CSP tests; no fabricated founding day.
- [x] Build/static/unit/browser verification; bilingual screenshots and layout/keyboard/fallback checks.
- [x] Update current documentation and verification status.

## Preservation

Private source recovery baseline: `/tmp/mtss-company-details-1791738216237`. Original logo, backend, validation and app behavior hashes are recorded there. Production hosting/email remain deferred; no live messages or publishing are authorized.

## Delivered

- `js/content.js`: single company data source, localized contact/social labels and owner-confirmed month-precision founding period.
- `js/views.js`: shared phone/social/facts helpers; readable footer contact block and founding statement, form-first Contact with secondary direct information, About facts and compact homepage facts. Normal same-tab external links need no new-window announcement. Decorative official brand SVGs stay unmirrored.
- `css/styles.css`: restrained facts rows, readable LTR phone links, 44px contact/social targets, existing dark-footer contrast and responsive wrapping.
- `scripts/build.cjs`: Organization telephone/sameAs/PostalAddress from shared data; existing domain gating and CSP hashes retained. No street/postal/geo/hours claims.
- `scripts/check.cjs`: validates the exact supported tel scheme rather than treating phone links as local paths.
- `tests/build.test.cjs` and `tests/company-details.test.cjs`: updated confirmed metadata, CSP/deep-404 preservation, generated details and shared-data rerender regressions.
- MIT license for official Bootstrap Icons 1.13.1 glyphs is included; no icon runtime dependency was added.

## Founding precision

The confirmed value is December 2024, represented by period `2024-12`, precision `month`, and localized displays. Visible HTML uses `<time datetime="2024-12">`. There is no invented `2024-12-01` or calculated years-of-experience counter. Organization foundingDate is omitted conservatively because no day is known. The owner confirmation is sufficient for the displayed month; no further date access is required.

Schema reference: [foundingDate](https://schema.org/foundingDate), [Date](https://schema.org/Date). Social reference: [company LinkedIn profile](https://www.linkedin.com/company/mtss0). No private profile/edit form was opened. Facebook content could not be fetched due to throttling; generated links use the exact owner-supplied account.

## Fresh verification

- Build and static check passed: 16 pages, 716 internal links/anchors, 112 asset references, exact phone scheme, original logo hash and private build boundaries.
- 15 Node test groups passed, including updated production metadata/JSON-LD CSP and shared company-detail rendering.
- Fresh Chromium browser suite: 126 language/page/width layouts and 28 axe scans, no page errors/overflow/accessibility violations. Includes Contact preselection, draft/locale/history/rapid switching, availability, simulated acceptance/error/timeout/rate/duplicate handling and native unsupported-API fallback. No real inquiry was sent.
- Targeted company-details browser review: English/Arabic Contact and footer at 320/375/390/768/1024/1440; exact URLs, LTR, keyboard order/focus, 44px targets, distinct editable visitor phone field, founding precision and no-JS visibility.
- Landscape 667×375, reduced motion, partial script failures and 200% equivalent reflow are covered by the current browser suite. Actual toolbar zoom and physical mobile devices are not claimed.
- Backend, validation, application behavior and original logo hashes match the pre-change baseline. The only behavior-related change is validation of tel URLs in the static checker; server files are unchanged.

## Evidence

Before: `screenshots/company-details-before/` (Contact/About/footer English/Arabic at 390/1440).
After: `screenshots/company-details-after/` (all bilingual pages/header/footer/menu, focused About facts, Contact screenshots, browser-report.json and company-details-report.json).

Manual screenshot inspection reviews footer layout/icon contrast, Contact form priority, LTR phone and Arabic facts. Earlier Lighthouse and WebKit/Firefox results remain historical; no fresh scores or additional browser-engine coverage are claimed for this bounded update.

## External setup and rollback

Status remains **Prepared for production configuration**. Real domain/HTTPS hosting, verified Resend identity/secrets, persistent rate storage and controlled live acceptance/inbox test remain deferred. No deployment or live messages occurred.

Local rollback: restore only the changed source files from `/tmp/mtss-company-details-1791738216237`, remove newly introduced company-details test/license if fully reverting, then rebuild. Keep any unrelated newer work. This temporary private backup is not a permanent release archive.
