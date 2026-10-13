> **Historical / superseded.** The company-focused implementation in [COMPANY-CORRECTION.md](COMPANY-CORRECTION.md) and README takes precedence. Academy section mappings, course/catalog/package/promotion patterns and older tests below are not current requirements. Latest evidence is in VERIFICATION.md.

# Reference redesign — 11 October 2026

Status: locally implemented and verified; prepared for production configuration. Local-only; no publication or production email configuration authorized.

Reference: https://mtacademy-courses.github.io/ (live Arabic/English browser captures).

## Audit
- Current header is approximately 131–133px tall; stacked logo/tagline is too small and traced contours are rough.
- Current split hero, blue/navy/lime palette, narrow cards, fonts and section rhythm differ substantially from the reference.
- Mobile collapse can exceed short landscape viewport; individual-script failure leaves navigation inaccessible.
- Contact language changes have a stylesheet race, retain an outdated URL and can lose values through a same-page CTA.
- Contact server exists; locally unconfigured and must remain honestly unavailable. Backend contracts are retained.
- No Git checkout is present. Source backup is recorded in /tmp/mtss-redesign-backup; unrelated files will be preserved.

## Reference mapping
| Reference | Company adaptation | Measurements / behavior |
|---|---|---|
| Header | Official compact symbol + company wordmark; five links, Services disclosure, locale capsule | Cream translucent, ~81px desktop, dark-green active capsule; mobile full-height scrolling panel |
| Hero | Software headline and project/services CTAs | Centered, grid, warm glow, 69px title at 1440, Arabic line-height 1.35 |
| Learning paths | Build / Connect / Operate solution presentations | Three 24px-radius cards at >=1200, 432px visual stages, white/green/gold variants |
| Course catalog | Eight confirmed services | 16:10 media, three columns >=1120; search/filter/chips/details dialog |
| Instructor | Company approach, illustrative architecture media | #111 section; white/gold text; no fabricated portrait or statistics |
| Reviews | Proposed process carousel | Keyboard arrows, slide count; no testimonials/ratings |
| Payment | Project preparation + engagement needs | Split copy/cards layout; no unconfirmed payment methods |
| Contact | Project CTA + direct email | Gold-bordered rounded panel |
| Footer | Company, routes, groups, email | Four columns, near-black, gold top rule |
| Promotion | Reusable optional project callout | No countdown, discount or automatic dialog; opt-in project introduction, real Contact destination |

## Checklist
- [x] Inspect reference/source and existing architecture; preserve baseline.
- [x] Establish matching tokens, typography and Bootstrap layouts.
- [x] Replace rough logo derivative with faithful source-backed framing; preserve original.
- [x] Rebuild header/menu and fix fallback/focus/landscape defects.
- [x] Recreate homepage and style all bilingual routes.
- [x] Implement search, filters, dialogs, process carousel and motion.
- [x] Preserve backend; fix locale transitions and Contact state.
- [x] Verify layouts, accessibility and failure states; Chromium/WebKit pass, Firefox unavailable and documented.
- [x] Capture comparisons; update build, documentation and handoff.

Screenshots: screenshots/reference/ and screenshots/redesign-before/.

## Observed fixes during verification
- Initial mobile menu enhancement caused CLS around 0.60. Rendering the native disclosure closed initially eliminated the large shift while retaining a working no-JS toggle. Final Lighthouse mobile CLS: 0–0.013.
- Accessible brand text now contains a literal separator between MT and Software Solutions. Topic controls include their visible +1/−1 text in accessible names.
- Unconfigured Contact remains unavailable; no backend or simulated success mode was added.
- Full official artwork retains its original raster/shading. Header/footer now share the compact cleaned source-derived mark and wordmark; native favicon formats supplement SVG. See LOGO-ASSETS.md for reconstruction limits and CURRENT-UPGRADE.md for the subsequent branding work.

- Deep-path 404 assets used relative URLs and failed on unknown nested paths. Templates now use root-safe asset URLs; unknown root routes use the public branded 404 without serving private paths. Automated fixture and rendered tests verify both locales.
- Neutral floating project CTA now hides when the footer enters view, avoiding overlap with copyright and footer links.

## Handoff
All locally implementable work is completed. See VERIFICATION.md, LOGO-ASSETS.md, README.md and PRODUCTION-SETUP.md. No deployment or real email test was performed.
