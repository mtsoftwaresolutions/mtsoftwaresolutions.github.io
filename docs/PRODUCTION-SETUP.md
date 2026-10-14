# Production setup

Status: prepared for production configuration. No live deployment or real test email has been performed. The owner explicitly chose to configure production email/hosting later.

## Supported deployment

Use a Node.js 22.16+ process (a maintained Node LTS is recommended) behind an HTTPS reverse proxy. The process serves only the generated `dist/` website and `/api/contact` endpoints. No database of inquiries, authentication, or CMS is needed.

1. Install with `npm ci`.
2. Copy `.env.example` to `.env` locally, or use the host's encrypted environment variables. Never commit the filled file.
3. Set `SITE_URL` to the final HTTPS origin, without a path, e.g. your actual company domain. This value is public and is required both during build and at runtime. Subdirectory hosting is not supported by this Node deployment; the original file routes remain unchanged.
4. Run `npm run build`. It includes canonical/hreflang, Open Graph image URLs, Organization JSON-LD, sitemap, and matching JSON-LD CSP hashes only when the actual origin is configured. Without SITE_URL, robots disallows indexing and the sitemap is empty.
5. Run `npm run check` and `npm test`.
6. Configure the email sender and rate storage below.
7. Start `NODE_ENV=production npm start` with the same SITE_URL. Startup rejects a build produced for another origin. Set HOST to the host-required binding (typically 0.0.0.0 inside a container), and PORT as needed.
8. Preserve hashed query parameters on static-asset URLs when configuring the proxy/CDN; they distinguish brand/template/style revisions. The build-only SVG renderer must be installed during build (`npm ci`); it is not needed by the runtime server. Configure TLS on the reverse proxy, forwarding requests to Node. Security headers, CSP, HSTS, gzip, ETags, and revalidation are emitted by Node. The `_headers` file is also generated for static hosts that support that convention, but static-only hosting needs its own real API integration; uploading dist alone does not enable sending.

Do not upload the entire working directory as public files. The build copies only website routes and assets. Server source, scripts, documentation, screenshots, dependency files, secrets, recovery archives, and runtime rate storage are excluded from public serving. The deployment process may need server source and dependencies privately; keep them outside the public web root.

## Real email sending

The implemented provider is [Resend](https://resend.com/docs/api-reference/emails/send-email).

- Create or use an existing Resend account.
- Verify the sending domain with the provider's required DNS records.
- Set RESEND_API_KEY using host secret management.
- Set CONTACT_FROM to a verified sender email address on that domain, without a display-name wrapper.
- Recipient is fixed in server code: mtsscorporate@gmail.com.
- Visitor email is Reply-To, never From. The notification contains validated fields and submission language as UTF-8 plain text.
- `/api/contact/status` reports configuration presence only. It does not certify sender verification or live delivery.
- Submit one controlled inquiry after setup; verify endpoint acceptance and receipt in the company mailbox (including spam). This is required before calling Contact production-ready.
- On provider/network failure, the endpoint returns a failure and the browser retains input. Success means provider acceptance, not guaranteed inbox delivery.
- Idempotency keys prevent repeat email delivery when an unchanged inquiry is retried. They are passed to Resend and expire according to provider behavior. There is no automatic retry loop.

When configuration is absent, the preview disables online sending and prioritizes localized direct email and phone, with a collapsed disabled form. Configured Contact HTML enables native submission before JavaScript runs. No mock sender can be activated by an environment variable. Test mocks exist only as dependency injection in test code or browser request interception.

## Abuse protection and deployment topology

Every request is bounded to 32 KiB and validated. Honeypot attempts are rejected. Origin must exactly match SITE_URL; no cross-origin CORS access is enabled. The API uses no cookies, login, or sessions, so the same-origin POST check is the relevant browser CSRF boundary.

Set RATE_LIMIT_SALT to a random server secret of at least 32 characters. This makes temporary connection identifiers HMACs rather than stored IP addresses. Each connection may attempt five submissions per fifteen minutes, including invalid attempts. Expired SQLite entries are removed when requests arrive. No message text is stored in the rate database or application logs. Only fixed failure categories are logged; host access logs and provider/mailbox retention are managed separately.

Two deployment modes are supported:

- **Single instance:** set DEPLOYMENT_MODE=single-instance and RATE_LIMIT_DB to a persistent writable SQLite path outside dist. Keep one application instance; multiple local Node processes may share that same SQLite file with atomic transactions. Replicas with independent disks must not use this mode. Persist storage across restarts and protect it with filesystem permissions.
- **Distributed/serverless:** set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN. All instances must share the same Redis service and RATE_LIMIT_SALT. Rate consumption is one atomic EVAL with expiration. See [Upstash REST API](https://upstash.com/docs/redis/features/restapi). Real remote Redis was not contacted in local verification; its request/response contract was simulated.

If rate storage fails, sending fails closed. Production startup requires distributed Redis or an explicit single-instance choice. The supplied server is a Node HTTP process, not an already-configured serverless deployment adapter.

Leave TRUST_PROXY unset unless a trusted reverse proxy is the only route to Node and sanitizes the X-Forwarded-For header. TRUST_PROXY=1 selects the rightmost forwarded client address, suitable for one trusted proxy. Direct clients must not be able to forge that header at the origin. Configure private network/firewall access accordingly.

## Smoke checks and rollback

After a deployment is explicitly authorized:

- Verify all bilingual routes, nested 404 pages, logo, menu, system typography, and security headers over HTTPS.
- Check `/api/contact/status`, submit a controlled test, and verify actual receipt.
- Verify origin rejection, rate limiting, and failure messaging without exposing visitor data.
- Rerun browser checks against TEST_URL set to the production origin; Contact requests in that suite are simulated and do not send real emails.
- Review the Privacy wording against the business's actual retention and provider arrangements.

Retain the previous deployment artifact and environment settings. To roll back, restore the prior artifact/server version through the host's release mechanism and preserve the rate storage. The owner has provided a Git checkout in the relocated project. This task has not committed, pushed or deployed it.

## Corporate-only release

The current build has 32 company/service documents and no showcase routes, scripts or screenshots. See RELEASE-ROLLBACK.md for `npm run release` and extraction verification. Never expose `.private/` or `business-operations/`. Keep rate storage outside versioned release directories and preserve it and RATE_LIMIT_SALT on rollback. Removed showcase URLs must remain localized 404 after deployment.
