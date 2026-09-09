# Security policy

## Supported versions

| Version | Supported |
|---|---|
| `{{SLUG}}-vN` (latest) | ✅ |
| older `{{SLUG}}-v*` | ❌ |

The cache-bump rule (see `CLAUDE.md` §B.1) is what makes "supported"
meaningful: a `VERSION` bump in `sw.js` is the only mechanism that
forces installed PWAs to pick up the new code. We support the
**latest deployed `VERSION` only**; older versions are not patched.

## Reporting a vulnerability

Please **do not** file a public issue for suspected security
problems. Email <maintainer-email> instead, with:

- A short description of the issue
- Steps to reproduce (browser, OS, URL)
- A screenshot or console log if applicable
- Whether you want public credit in the fix

We will respond within **72 hours** with a triage note and a fix
timeline. Critical issues (XSS, RCE, account compromise, anything
that breaks the no-telemetry promise) are patched within 7 days;
non-critical within 30 days.

## Threat model

{{DISPLAY_EN}} is a fully client-side static site. There is no
backend, no database, no telemetry, no third-party runtime, no
accounts. The threat model is essentially:

- "What a malicious offline page on the same origin could do to
  this app's `localStorage`."
- "What a malicious page on a different origin could do via
  shared APIs (the `Permissions-Policy` and CSP headers in
  `_headers` are designed to limit this)."
- "What a malicious actor could do by tampering with the deployed
  files at the CDN edge."

The browser's same-origin policy, sandboxed iframes, the
`Permissions-Policy` and the strict CSP mitigate (1) and (2). For
(3), the Cloudflare Git connector enforces a single-source-of-truth
deploy: only the `main` branch of `{{GIT_ORG}}/{{REPO}}` is
deployed; deploy keys are rotated through the Cloudflare
dashboard, not stored in the repo.

## Out-of-scope

- Vulnerabilities in the user's browser (we ship plain HTML/CSS/JS;
  report to the browser vendor).
- Vulnerabilities in Cloudflare's Workers runtime (report to
  Cloudflare).
- Self-XSS (a user pasting malicious code into their own browser
  console).

## See also

- [`CLOUDFLARE.md`](CLOUDFLARE.md) — the deploy runbook.
- [`_headers`](_headers) — the HTTP security headers in effect.
- `CLAUDE.md` §B — the suite-wide policies (no telemetry, WCAG
  AAA, public-facing wording).
