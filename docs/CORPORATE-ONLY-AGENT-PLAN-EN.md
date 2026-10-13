# MT Software Solutions — Corporate Website Correction and Completion Plan

You are responsible for correcting and completing the existing bilingual website in:

`/Users/mohamedtamer0/Desktop/Work/MT Software Solutions`

Follow this plan through inspection, implementation, verification, and documentation. Do not stop after an audit, recommendations, or a proposed design.

## 1. The owner's latest instruction controls the scope

The owner wants **a company introduction website only**. Its purpose is to explain MT Software Solutions, its existing services, the audiences those services suit, the topics involved in working together, and how to contact the company.

**The owner does not want any work samples displayed.** This includes real client projects, internal demonstrations, sample applications, portfolios, case studies, mock products, project screenshots, or implementation-showcase pages. Do not create, publish, retain in the public experience, or replace these with another kind of showcase.

Client projects are private. The owner explicitly stated that they cannot lawfully share them. Do not ask for those projects, anonymize them as a workaround, or use their screenshots, names, logos, data, or results.

Earlier instructions and audit recommendations suggested implementation evidence and an internal demonstration. That direction is now superseded. A recommendation about a portfolio is not an outstanding requirement under this revised scope. Record it as **not applicable to the owner-approved company introduction website**, rather than trying to satisfy it with another example.

Do not interpret “company introduction website” as an Academy, course catalog, student portal, SaaS product, CRM, interactive business tool, or public dashboard.

## 2. Intended visitor experience

A visitor should be able to:

1. Understand what MT Software Solutions provides from the first screen.
2. Explore the eight existing services in familiar, accurate language.
3. Recognize whether those services could suit their organization or project.
4. Understand the subjects to agree before implementation, without invented company policies.
5. Find a useful contact action immediately.
6. Use the Arabic and English versions with equivalent content and behavior.

Build confidence through clear information, consistent presentation, confirmed company details, and usable navigation. Do not invent proof, results, claims of superiority, testimonials, or “reasons to choose us” that imply unsupported delivery experience.

## 3. Inspect the actual workspace before editing

The workspace has already been partially modified under the superseded implementation direction. Treat the current files as a mixed state requiring inspection. Do not assume that the older reports describe the current source exactly.

Read:

- `README.md`
- `docs/PLATFORM-REVIEW-2026-10-13-AR.md`
- `docs/BUSINESS-REVIEW-2026-10-13-AR.md`
- `docs/CURRENT-UPGRADE.md`
- `docs/COMPANY-CORRECTION.md`
- `docs/COMPANY-DETAILS.md`
- `docs/CONTENT-DECISIONS.md`
- `docs/LOGO-ASSETS.md`
- `docs/VERIFICATION.md`
- `docs/PRODUCTION-SETUP.md`
- `docs/EXECUTION-PLAN-2026-10-13.md`
- `docs/FINDINGS-TRACKER-2026-10-13.md`
- `docs/CONTENT-INVENTORY-2026-10-13.md`, if present
- Applicable `AGENTS.md` instructions and relevant skills.

Inspect the shared source, build, server, and tests:

- `js/content.js`
- `js/views.js`
- `js/app.js`
- `js/contact-rules.js`
- `css/styles.css`
- `scripts/`, including route generation and release scripts
- `server/`
- `tests/`
- `assets/`
- Generated `en/`, `ar/`, root HTML, and `dist/` output.

Inspect existing screenshots and reports as private QA evidence. Historical Academy/reference/redesign patterns must not be restored.

A recoverable pre-change baseline exists at `.private/baselines/baseline-2026-10-13.tar.gz`, with its checksum in the adjacent JSON. Verify its existence and contents before relying on it. Create a fresh private snapshot of the current source before further edits. Preserve unrelated owner changes. Use the older baseline for selective comparison and recovery, **not an automatic whole-project rollback**.

## 4. Preserve these confirmed facts and capabilities

Company facts:

- Name: MT Software Solutions.
- Email: mtsscorporate@gmail.com.
- Telephone: +201032105166.
- Location: Giza, Egypt.
- Founded: December 2024. No day is confirmed.
- Facebook: https://www.facebook.com/mtss0/
- LinkedIn: https://www.linkedin.com/company/mtss0

Keep these facts centralized in shared data. Preserve the original company logo and its proportions. The complete SVG is a raster-backed container, and the compact symbol is a reconstructed derivative; neither is a supplied vector master.

Keep all eight services and their identifiers:

- `custom`: Custom Software Development.
- `web`: Web Application Development.
- `mobile-app`: Mobile Application Development.
- `backend-api`: Backend & API Development.
- `integration`: System Integration.
- `consulting`: Software Consulting.
- `support`: Maintenance & Support.
- `cloud`: Cloud & DevOps Services.

Keep all four group identifiers: `business`, `mobile`, `connected`, and `operations`.

Keep the seven existing audiences: small and medium businesses, startups, enterprises and large organizations, entrepreneurs and project founders, agencies and service companies, government entities, and nonprofit organizations.

Do not select a new niche, geographic market, preferred audience, additional advertised service, certification, team size, or client relationship without confirmed information.

## 5. Phase A — Create a correction ledger and baseline

Before implementation:

1. Run the current website locally with sending unavailable and no real provider requests.
2. Capture representative Arabic/English desktop and mobile screens.
3. Record current build, static-check, and test results, including failures.
4. Inventory everything introduced for the rejected showcase direction.
5. Create a concise living plan and correction tracker.

For each tracker item record: source, current evidence, intended change, affected files, acceptance criteria, status, and verification evidence.

Separate:

- Website defects to fix.
- Showcase features to remove.
- Useful changes to retain after verification.
- Missing company facts.
- External production configuration.
- Superseded recommendations that no longer apply.

**Gate:** a recoverable snapshot exists, the actual current state is understood, and removal is planned across the complete source/build/navigation/test path.

## 6. Phase B — Remove the rejected showcase completely

Inspect and remove public features introduced for work samples. Likely current additions include:

- `work.html`
- `case-request-workflow.html`
- `request-demo.html`
- `js/demo.js`
- `js/demo-rules.js`
- `request-demo-en.png` and `request-demo-ar.png`
- `projects` and `demo` content structures
- Demo-specific public copy, evidence links, screenshots, acceptance-example sections, and navigation labels.

Do not rely on that list alone. Search the actual source for all showcase references and inspect each match.

Remove or revise:

1. Homepage demo images, “try the demo” actions, implementation-example sections, and evidence-based reasons referring to the demo.
2. Showcase navigation and footer links.
3. Service-page links to case studies, demo evidence, and paragraphs explaining the limits of the rejected demonstration.
4. Audience and engagement links to example projects.
5. Route inventory entries, metadata mappings, sitemap entries, and script-loading conditions for removed pages.
6. Demo-specific CSS, JavaScript, shared data, asset copying, and build rules.
7. Tests whose purpose is to require the removed feature. Replace them with meaningful checks for the revised corporate website.
8. Stale generated showcase HTML in both locale directories, as well as the rebuilt public output.

An obsolete showcase URL should receive the normal localized 404. Do not keep a hidden or unlinked demo accessible through its old URL, and do not silently redirect it to a misleading “work” substitute.

Private historical reports, screenshots, and recovery archives may remain as historical evidence. Keep them outside the public output. Existing private business materials are not public website content; preserve them privately unless there is a concrete reason to change them. Do not expand business-tool development in this task.

**Gate:** no showcase page, screenshot, script, navigation item, sitemap entry, or functional sample remains publicly accessible. Removal is real, not CSS hiding.

## 7. Phase C — Rebuild the homepage as a company introduction

Use a concise sequence, adapted to the content:

1. A clear company/service headline, short supporting paragraph, and contact action.
2. A brief company introduction using confirmed facts.
3. A concise overview of the existing services.
4. The existing audiences and the kinds of needs relevant to them, summarized with links to further information.
5. A short outline of project discussion and delivery topics.
6. A few purchase-relevant questions.
7. A final contact invitation.

Do not place a portfolio, project example, demo, mock application, screenshot gallery, or “selected work” section anywhere in this sequence.

Keep the cream, forest-green, and gold direction, recognizable branding, and Bootstrap-based architecture. Improve hierarchy, typography, spacing, section rhythm, and button consistency in both languages.

Use text, spacing, restrained icons, and confirmed branding as the main presentation. Do not replace the removed demo with large decorative artwork or another fake product screen. A diagram is optional only if it explains the company's existing services without looking like a project showcase; omission is preferable when it adds no useful information.

Shorten repeated content, especially on mobile. Keep essential information available through clear page destinations. Avoid promotional dialogs, floating obstructions, repetitive generic cards, and redundant contact prompts.

**Gate:** the first screen explains the company and its services, all content supports the company introduction, and mobile scanning improves without accessibility regressions.

## 8. Phase D — Make Services, About, and Process consistent

### Services

Keep all eight services discoverable. Existing useful service-specific pages may remain after removing showcase content; they do not need to be discarded merely because they were added during the interrupted work.

For each service explain concisely:

- What the service is.
- Which business needs it can address.
- The kinds of work a project scope may include.
- Useful information needed at the start.
- Possible deliverables.
- Related existing services.
- A direct inquiry action with service preselection.

Describe capabilities and potential needs without presenting a sample project, fictional implementation, or past-client claim. Preserve legacy service/group anchors and incoming links. Avoid fixed packages, unapproved prices, arbitrary budget bands, and guarantees.

If three starting paths remain useful—clarify the need, develop/improve software, maintain/operate software—present them briefly as ways to discuss the existing services. They must not dominate the site or look like invented commercial packages. Do not duplicate the same explanations across multiple sections.

### About

Use confirmed company information, offering, audiences, location, founding month, and contact details. Keep the seven audiences visible without implying they are existing clients.

Do not fabricate founders, employees, biographies, credentials, experience years, or stock-photo staff. If verified people information is absent, publish a complete company introduction without an empty team section. Record the factual gap privately; do not block routine completion on it.

### Process and FAQ

Explain the topics a project discussion should clarify: requirements, scope, reviews, acceptance, testing, documentation, handover, source-code arrangements, ownership/licensing, hosting costs, changes, and maintenance coverage.

Publish established practices only when supported. Otherwise, explain what needs to be agreed for the project. Do not invent a universal ownership transfer policy, payment schedule, support level, response deadline, free consultation, or legal commitment.

**Gate:** all pages read as one coherent corporate website, contain no showcase references, preserve existing capabilities/audiences, and make no unsupported promises.

## 9. Phase E — Retain and verify useful contact improvements

Review the actual contact changes already made and keep those that improve the company introduction experience.

When online sending is unavailable:

- Show a short, accurate explanation.
- Put direct email and telephone actions prominently before any unavailable form.
- Keep the unavailable form treatment deliberate, accessible, and disabled.
- Do not encourage visitors to fill a form they cannot submit.
- Ensure no-JavaScript visitors have usable direct contact options.

When sending is configured:

- Keep the concise inquiry form prominent.
- Explain the next discussion without promising a reply time.
- Retain service preselection, language switching, and draft preservation.
- An existing optional timeline field may remain if it is useful and fully implemented. Do not add more qualification fields or budget bands by default.

Inspect the entire data path for any retained field: content, templates, client/server validation, limits, provider message, privacy wording, reset, retry/idempotency, locale changes, and tests.

Preserve Resend, the confirmed recipient mtsscorporate@gmail.com, server-side credentials, honeypot, rate limits, origin checks, native validation, duplicate prevention, failure-state input retention, and truthful success/error states.

Specifically verify that unsupported JavaScript APIs and in-page language changes do not leave a configured native form incorrectly disabled or conceal relevant error feedback.

All test submissions must be intercepted or simulated. Do not send real messages. Provider acceptance is not evidence of inbox receipt.

**Gate:** both contact availability states are useful, bilingual and accessible, with no regression in security or input preservation.

## 10. Phase F — Align build, metadata, and public boundaries

Work in shared source/templates, not hand-edited generated HTML.

1. Rebuild only the retained company pages and service destinations.
2. Verify all retained relative assets, navigation, active states, locale links, titles and descriptions.
3. Remove all showcase URLs from sitemap and metadata generation.
4. Preserve the existing production-domain gating: without a real `SITE_URL`, indexing remains disabled.
5. Verify production metadata through an isolated test fixture. Never use a fake domain as the actual public build configuration.
6. Keep docs, screenshots, private business materials, baselines, archives, scripts, secrets and runtime databases out of public output.
7. Recheck release scripts for dependencies introduced during the interrupted changes. A release archive must contain everything its server actually requires, while retaining private/public separation.
8. Keep external hosting, domain, email verification, persistent rate storage, live account changes, and public deployment pending specific owner authorization.

**Gate:** only the approved informational website is shipped, metadata covers the retained routes, and private material cannot be served.

## 11. Phase G — Verify the final corrected implementation

Run the applicable existing commands:

```sh
npm run build
npm run check
npm test
npm run test:browser
npm run test:browsers
npm run audit
```

Start the local preview as required. Update obsolete route/structural assumptions to match intentional removals, while preserving meaningful assertions.

Verify:

- All retained routes in Arabic and English.
- Legacy service/group anchors and contact preselection.
- Removed showcase URLs return 404, and rejected assets/scripts are absent from the public build.
- Mobile widths starting at 320px, relevant desktop header breakpoints, and short landscape navigation.
- No horizontal overflow, broken images, or page errors.
- Keyboard interaction, visible focus, skip link, accessible names, contrast, FAQ, and reduced motion.
- No-JavaScript navigation and contact availability states.
- Locale switching, RTL/LTR stylesheet consistency, and draft preservation.
- Simulated validation, unavailable, timeout, rate-limit, duplicate, failure and accepted states.
- Accurate privacy wording and no unsolicited analytics/tracking.
- Production metadata in isolated output and private-file HTTP/build boundaries.
- Recovery/release extraction where existing release tooling is retained.

Capture fresh before/after screenshots and inspect them visually. Measure page heights and Lighthouse metrics on the corrected version. Do not reuse the interrupted demo version's results as proof of the corrected website.

Fix material regressions before completion. If a browser engine is unavailable, record that limitation and a non-pass result; do not count unavailable coverage as successful.

**Gate:** all locally implementable corrections pass their checks, and the actual final website has no work samples or showcase remnants.

## 12. Phase H — Documentation and handoff

Update README and the current implementation, content decisions, verification, execution plan and finding tracker documents so they describe the corporate-only website accurately.

Mark the portfolio/demo recommendations and interrupted showcase work as superseded. Historical evidence may stay private with clear dates. Do not leave “demo delivered” or “portfolio completed” as an active requirement or claimed final feature.

Provide:

1. The implemented Arabic/English company introduction website.
2. A completed correction plan and tracker.
3. Fresh verification results and screenshots.
4. Updated run/build and private release/rollback instructions.
5. A concise list of missing company facts and external setup, clearly separated from completed local work.
6. An accurate release-readiness status.

Report progress in plain Arabic. Finish with a concise Arabic summary of what was removed, what was retained/improved, how the corrected website was tested, and what external configuration remains.

Do not claim public launch, live email delivery, or approved company policies when those have not been established. Do not ask the owner to approve routine local edits. Ask only for facts or consequential external decisions that are genuinely necessary, and continue independent work while waiting.

## Final acceptance checklist

- [ ] The site is a company introduction website only.
- [ ] No portfolio, work samples, internal demos, case studies, mock products, project screenshots, or showcase routes are publicly accessible.
- [ ] No private client material is used or requested.
- [ ] Confirmed branding and company details are preserved.
- [ ] All eight services, four group identifiers and seven audiences remain represented.
- [ ] Arabic and English content and behavior are aligned.
- [ ] Contact works usefully in configured and unconfigured states.
- [ ] Existing meaningful functionality remains intact.
- [ ] Removed features have no stale source/build/navigation/metadata dependencies.
- [ ] Final screenshots and test results belong to the corrected corporate-only version.
- [ ] Documentation reflects the latest owner instruction.
- [ ] External configuration is reported honestly as pending.

Begin with current-state inspection and a fresh private snapshot, then execute this plan to completion.
