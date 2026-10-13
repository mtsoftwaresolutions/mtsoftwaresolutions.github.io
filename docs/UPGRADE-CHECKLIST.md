> **Historical / superseded.** The company-focused implementation in [COMPANY-CORRECTION.md](COMPANY-CORRECTION.md) and README takes precedence. Academy section mappings, course/catalog/package/promotion patterns and older tests below are not current requirements. Latest evidence is in VERIFICATION.md.

> Historical record. The current reference redesign is documented in REFERENCE-REDESIGN.md; current results are in VERIFICATION.md. Earlier design and Contact assumptions are superseded.

# Website upgrade — October 11, 2026

## Audit

- Logo: a 1000×1000 JPG with large whitespace and a gray shadow is displayed through fixed negative offsets. The footer has an unwanted white rectangle; favicon lettering is too small.
- Contact: mailto preparation only; no delivery endpoint, provider acceptance, server validation, or failure handling.
- Layout: a large bespoke stylesheet duplicates responsive layout responsibilities. Bootstrap is absent.
- Maintenance: shared markup and static HTML can drift because no repeatable generator exists.
- Production: no deployable server, CSP, environment template, or build boundary excluding recovery archives.
- Previous checks intentionally prohibit fetch, real forms, and external integration; these are obsolete under the current request.
- No Git repository is present. Preserve originals and changes in place.

## Implementation

- [x] Inspect source, logo, routes, and existing checks.
- [x] Capture baseline English/Arabic desktop/mobile UI.
- [x] Pin and integrate local Bootstrap 5.3.8 with matching RTL CSS.
- [x] Create and inspect faithful logo derivatives; preserve original.
- [x] Replace shared layout/design and generate all routes from templates.
- [x] Add accessible navigation, filtering, FAQ, email copy, and motion.
- [x] Implement contact endpoint, validation, abuse protection, and localized states.
- [x] Add SEO, packaging, security headers, and deployment documentation.
- [x] Run server tests, route checks, browser/axe checks, responsive review, and Lighthouse.
- [x] Capture final screenshots and document external configuration.

## External configuration

Production domain, verified sender, provider credential, and live hosting are not yet supplied. Live delivery and deployment remain unverified. Local provider tests must be identified as simulated.

All locally implementable phases are complete. Live credentials, provider acceptance/inbox receipt, real remote rate storage, host TLS/proxy configuration, and deployment remain external steps. Browser engine limitations are recorded in VERIFICATION.md and the cross-browser report.
