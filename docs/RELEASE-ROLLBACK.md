# Private releases, recovery and rollback

The October 13 source baseline is `.private/baselines/baseline-2026-10-13.tar.gz`; its SHA-256 and inventory are in the adjacent JSON. This is persistent workspace recovery rather than an old /tmp dependency. Keep `.private` outside public hosting and copy backups to private owner-controlled off-device storage. There is still no Git repository; the existing workspace was preserved.

## Reproducible release

```sh
npm run release
# Use the exact private release path printed by that command:
node scripts/verify-release.cjs /absolute/path/to/.private/releases/release-ID
```

Release runs build/check/unit tests and stops on failure. Runtime archive contains only dist, private server, shared server validation and dependency manifests. Source archive preserves editable implementation and docs. Archives exclude secrets, runtime databases, inquiry/business records, screenshots and node_modules. Manifest hashes every archive and public file. Extraction verification checks hashes, archive entries, bilingual routes and private HTTP boundaries without sending mail. Browser/engine/audit evidence is recorded separately and must accompany a release decision.

The empty-origin local archive deliberately blocks indexing. It is a recovery/review artifact; do not deploy it as a finished launch. After specific authorization and a real HTTPS origin, rebuild/release with that origin and matching runtime configuration. No fixture/test domain is a deployment substitute.

## Source recovery

1. Verify the baseline/source archive checksum against its manifest.
2. Extract into a **new empty private directory**, never directly over the current workspace.
3. Compare the affected source files and retain any newer unrelated owner changes.
4. Install locked dependencies, rebuild and check. Use an unavailable provider for local review.
5. Restore only the intended changed files after inspection, or continue from the separate recovered directory.

Generated HTML and dist can be recreated from source. Do not restore environment files or databases from a code archive; they are not included. Existing historical screenshot reports remain unchanged.

## Hosting rollback, when authorized

Keep at least the last accepted runtime archive, manifest, build origin, Node/dependency lock and a private record of host release configuration. Prepare a new private release directory, verify/extract, install runtime dependencies with `npm ci --omit=dev`, and apply host-managed environment values. Start/check the candidate behind the same trusted HTTPS proxy before switching the host's release pointer. Preserve the previous release directory for rollback.

Rate storage lives **outside every release directory**. All active processes use the same persistent SQLite file in explicit single-instance mode, or the same distributed Redis service and RATE_LIMIT_SALT. Switching the release must not delete, reset or recreate that storage. Backups of databases/secrets need a separate protected procedure and owner-defined retention.

If checks fail, switch back through the host's release mechanism, restart with the previous matching build/runtime origin and preserved salt/storage, then recheck routes, CSP, status and controlled acceptance/receipt if authorized. Do not roll back data stores or DNS automatically. The supplied extraction check is local recovery evidence, not proof of a host's switch/TLS/proxy/inbox behavior.
