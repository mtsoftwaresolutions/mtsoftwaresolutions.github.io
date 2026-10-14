# Official branding assets

The original `assets/images/official-logo.jpg` is unchanged (SHA-256 `edf0b4361fd6438ebef5f977442f63640f44353db6bfbd94609c94edbf560921`) and matches the supplied Desktop file. No new company identity, font-based MT substitution, or Academy graduation cap was introduced.

## Assets and usage

- `logo-symbol.svg`: transparent compact mark with cleaned native paths reconstructed from the original contour geometry. Intrinsic 574×402, artwork bounds approximately x225–766/y296–663. Bézier braces replace staircase contours; the original distinctive MT outline and separate T stem/bar remain. This is a reconstructed small-size derivative, not an authentic designer-supplied vector master or an exact full-logo vector conversion.
- Header and footer share a single brand template: approximately 39px white rounded tile, a proportional 35px symbol, and readable adjacent **MT Software Solutions** text. On dark backgrounds only the adjacent text changes to white; the black mark remains on its white tile. The compact brand stays LTR in both languages. Mobile uses a single-line name with responsive type sizing.
- `logo-full.svg`: exact embedded original JPEG, framed to 744×500 with all original wording and proportions. It is a raster-backed container, **not a true vector conversion**. Shading is retained to protect the thin SOFTWARE SOLUTIONS artwork. Available for larger brand presentations/structured metadata; no longer squeezed into header tiles or an oversized footer panel.
- `favicon.svg`: the same compact native-path symbol on a rounded white square, with additional safe padding. No tiny tagline.
- `favicon-16.png`, `favicon-32.png`, `favicon-48.png`: native-resolution desktop icons.
- `favicon.ico`: indexed 16/32/48px PNG images for compatible desktop browsers.
- `apple-touch-icon.png`: 180px touch icon. Manifest additionally includes 192/512px PNG assets. Icons are ordinary `any` icons, not asserted to be maskable PWA assets.
- Retired `feature-*.svg` and repeated `solution-*.svg` media were removed from active source and excluded from the public build. `brand-assets.cjs` now generates only branding/icons. A localized semantic HTML workflow replaces the decorative assets.

Main brand and icon URLs include content hashes; generated page script/style URLs also include hashes. A new build changes affected URLs, preventing a cached old logo or template from returning after language changes. In-page Contact translations reuse the document's brand revision. Manifest icon references are versioned as well.

## Regeneration and evidence

`npm run build` regenerates branding and illustrative assets using `scripts/brand-assets.cjs`. The pinned build-only `@resvg/resvg-js` 2.6.2 renders the native SVG to deterministic PNGs and the ICO entries. `node scripts/brand-assets.cjs` may also regenerate the source assets directly. No network or AI extraction is required.

The superseded pixel contour trace and rejected image candidate are preserved in the external cleanup archive for provenance and are absent from active source/public output. No original artwork is overwritten.

Before/after English and Arabic desktop/mobile images are in `screenshots/upgrade-before/` and `screenshots/upgrade-after/`. The original/cleaned symbol comparison and native icon preview are in `screenshots/upgrade-after/branding/`. Pixel-level silhouette comparison at source resolution measured approximately 96.8% intersection-over-union at a 128 darkness threshold; small reconstructed contour differences remain. The complete official raster retains exact fidelity. An original professional vector source would still be preferable for large-format reproduction.
