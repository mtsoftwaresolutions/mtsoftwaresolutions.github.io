# Repository cleanup — 14 October 2026

Website source is preserved; dependencies/generated output and historical/private artifacts have been removed from the upload set. The original company logo, current assets, shared templates, bilingual pages, backend, tests, locked dependency manifest and operating documentation remain.

## Removed from the project and Git index

- `node_modules/` (227MiB): reproducible with `npm ci`.
- `dist/` (1.5MiB): reproducible with `npm run build`.
- Screenshots/reports (232MiB): moved to external private recovery storage.
- Private business drafts, prior release/baseline files, `docs/archive` and old reference/conversion documents: moved outside.
- Unused custom fonts, retired `logo-web` derivatives and obsolete logo-tracing script: preserved outside; not used by the current website.
- Finder `.DS_Store` metadata and unused empty template directory: removed.

15,657 already-tracked disposable/archive files were removed from the Git upload index. `.gitignore` also excludes future dependencies, build output, screenshots, runtime state, secrets, private artifacts and operations files. Keeping files in `.gitignore` alone does not remove files that were already tracked.

## Recovery location

`/Users/mohamedtamer0/Desktop/Work/MTSS Private Archive/cleanup-2026-10-14-121434/`

- `preserved-files/`: original reports/screenshots, business materials, private release/baseline directory and retired files, retaining their relative layout.
- `source-before-cleanup.tar.gz`: editable source, generated locale pages and documentation before removal.
- `git-before-cleanup.bundle`: complete pre-cleanup Git references/commits, verified before cleanup.
- `working-changes.patch`, `staged-changes.patch`, `manifest.json`: owner changes, original HEAD and recovery hashes.
- `clean-*.log`: installation/build/check/test results for an isolated copy of the cleaned source.

Recover into a separate private directory first; do not overwrite the active checkout. `git clone git-before-cleanup.bundle restored-project` recovers the original committed state; source archive and patches preserve later local changes. No files were uploaded and no remote reference was changed.

## Verification and next use

An isolated copy of the cleaned source completed `npm ci`, `npm run build`, `npm run check` and all 20 unit groups. It generated the same 32 company/service documents, with 1,362 links/anchors and 224 asset references passing checks. Active assets and the original logo hash are preserved.

The active project deliberately has no dependency/build directories after cleanup. To run it again:

```sh
npm ci
npm run build
npm run dev
```

## Git history

The heavy files were already inside the last local commit (`ebc7b61`). A read-only remote check confirmed the remote main tip was `420664a`, with that local commit not published at the time of inspection. Cleaning the files/index does not by itself remove those blobs from history. The existing local commit/history is preserved pending the owner's explicit choice about cleaning that commit; no reset, rewrite, commit or force push has been performed.

A source-only ZIP excludes `.git` and all local/private artifacts and can be used as a small upload/export independently of Git history. Git's existing metadata still accounts for approximately 185MiB of the local directory while the actual retained website files total about 1.6MiB.
