> Historical record. The current corporate-only website is described in CURRENT-UPGRADE.md and the October 13 correction plan. The latest owner instruction excludes all showcase content; the current verification is in VERIFICATION.md.

# Company presentation correction — historical October 11 record

This request supersedes Academy-derived page composition. The palette, official branding, Bootstrap 5.3.8, bilingual generated HTML and real Contact backend remain. No deployment or live inquiry testing is authorized.

## Baseline and findings

Fresh captures: `screenshots/company-before/`, including all seven pages in English/Arabic at 390/1440px, header/footer/menu and `baseline.json`. English mobile Home: 14,035px; Services: 14,967px. Arabic: 13,604px / 13,747px. Header: 81px. The baseline build regenerated package-box illustrations. Services are duplicated as a filtered catalog and full details; process is concealed by a carousel; About principles repeat; a floating inquiry dialog adds a step and can obstruct actions. Contact availability appears late.

No Git checkout exists. A private source backup was made under `/tmp/mtss-company-backup-1791736179105` without environment values, runtime data or deployment files. Original logo remains unchanged.

## Checklist

- [x] Audit source/build/backend; capture bilingual baseline; preserve original branding and source backup.
- [x] Remove package artwork generator and exclude all unused legacy media from deployment.
- [x] Rebuild homepage around client needs, compact service index, company approach, full process, FAQ and one final invitation.
- [x] Services: one HTML detail destination per service, preserved groups/anchors/preselection, visible Custom/Web/Mobile distinction.
- [x] About/Process: distinct content, useful sectors/audiences, no duplicated principles, outputs/review points.
- [x] Remove catalog, topics, carousel, promo dialog/floating CTA and dead interaction/style/content code.
- [x] Keep compact branding; deliberate desktop breakpoint and prominent desktop inquiry action.
- [x] Contact: earlier mobile form, availability before fields, localized states, preserved backend and draft/native fallback behavior.
- [x] Verify all language routes/9 widths/landscape/keyboard/reduced-motion/no-JS/script failures, meaningful browser tests and axe.
- [x] Build/check/backend/branding tests; new visual evidence, heights, cross-browser and fresh Lighthouse.
- [x] Update README/current docs, mark Academy mappings historical, document external setup and rollback.

## Information architecture

Home: practical software offering → eight-service index → three illustrative needs with relevant service links → company approach → visible four-stage process → FAQ → inquiry.
Services: compact group/service navigation → Custom/Web/Mobile relationship → eight unique HTML service details grouped by the existing anchors; no filtering or dialogs.
About: company offering → three principles once → intended audiences → explicitly illustrative sectors.
Process: visible sequence → each stage's purpose, discussable outputs and client review → preparation and collaboration.
Contact: concise introduction → form with availability before fields → direct email and guidance. No simulated acceptance in the normal preview.

## Deferred configuration

Prepared for production configuration. Domain, hosting topology/persistent rate storage, verified Resend sender and server-side credentials, HTTPS and a controlled live acceptance/delivery test remain owner tasks. No production credentials are requested or used here.

## Design tokens and decisions

Paper `#f8f6f2`, forest `#1a3a2e`, secondary green `#2c5a44`, gold `#c9a84c`, near-black `#111111`, neutral borders `#e8e4de`. Maximum content width 75rem, mobile gutters 1rem each, body text 1rem/1.7; Arabic heading metrics receive independent line-height adjustments. Sections use 2.5–4rem padding rather than fixed oversized media stages. Primary buttons use a restrained 0.625rem radius; open rows use dividers instead of cards. Motion uses 150/240/420ms with reduced-motion and initialization fallbacks.

The existing 81px header remains. Desktop navigation begins at 70rem/1120px; the extra inquiry button is shown from 80rem/1280px. Language controls and mobile menu targets remain at least 44px. Breakpoint selection preserves readable navigation and the full brand name; it is deliberately independent of Bootstrap's 992px grid transition.

Brand generation now produces only the full raster-backed lockup, compact reconstructed symbol and icons. Retired package and repetitive service illustrations were moved to the private baseline backup, removed from active source, and explicitly excluded from dist if accidentally restored. The localized hero workflow is semantic HTML; no new bitmap dependencies or fictional project claims were needed.

## Delivered and verified

See VERIFICATION.md for current results and screenshot/report paths. Fresh visual comparisons are in `screenshots/company-after/review.html`; actual page heights are in `height-comparison.json`. All eight services retain their original IDs, HTML details, group anchors and inquiry preselection. Search/filter/topic/dialog/carousel code was removed rather than left as inactive placeholders. The floating obstruction cannot recur because no floating project control is rendered.

Contact checks availability before fields, bounds that check with a five-second timeout, and reserves status space to avoid shifting the form. The actual endpoint, provider adapter and abuse protection were not changed. No environment secrets or live messages were used.

## Local rollback

The source baseline is `/tmp/mtss-company-backup-1791736179105`. Restore only the intended files (`js/`, `css/`, `scripts/`, `docs/`, `tests/`, README) and rebuild. Its `legacy-media/` contains the removed illustrations if reverting the former design intentionally. This temporary backup is a local recovery aid, not a durable release system; move it to private owner-controlled storage if long-term recovery is needed. Never make it the public web root. The unchanged original JPG remains in the repository.
