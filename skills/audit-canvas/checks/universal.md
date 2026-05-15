# Universal checks

Run these regardless of stack. Skip a row only when the repo provably does not include the asset (e.g. no Dockerfile → no Docker checks).

## U1 — Secrets and environment

- [ ] `.env*` is in `.gitignore`. If not: **Critical** if any real secret is committed, otherwise **High**.
- [ ] Search the working tree for: `sk-`, `sk_live_`, `pk_live_`, `AKIA`, `AIza`, `xoxb-`, `ghp_`, `glpat-`, JWTs (`eyJ`), 40-char hex (often AWS secret), `service_role`, `BEGIN PRIVATE KEY`, `BEGIN RSA`. Flag any hit outside `.env` example files.
- [ ] Search **git history** with `git log -p --all` for the same patterns. Committed secrets must be rotated, not just removed.
- [ ] Check public env-var prefixes leaking server secrets: `NEXT_PUBLIC_`, `VITE_`, `EXPO_PUBLIC_`, `REACT_APP_`. Anything secret behind these prefixes is **Critical** — it ships in the bundle.
- [ ] `.env.example` should not contain real values; only placeholders.

## U2 — Dependencies

- [ ] Lockfile present and consistent (`package-lock.json`/`yarn.lock`/`pnpm-lock.yaml`/`composer.lock`/`Gemfile.lock`/`poetry.lock`/`requirements.txt` pinned).
- [ ] Run (or recommend running) the platform's audit tool:
  - `npm audit --omit=dev` / `pnpm audit` / `yarn npm audit`
  - `composer audit`
  - `bundler-audit`
  - `pip-audit` or `safety`
- [ ] Flag any direct dependency that's EOL or marked `abandoned` on packagist / `unmaintained` on npm.
- [ ] Note any `@latest` or unpinned version in scripts.

## U3 — Repository hygiene

- [ ] No backup files committed: `*.sql`, `*.bak`, `*.swp`, `dump-*`, `*-backup`, `*.zip` over 1 MB.
- [ ] No personal data fixtures with real emails / phone numbers.
- [ ] No production database snapshots in `seeds/` or `tests/`.
- [ ] No `.DS_Store`, `Thumbs.db`, or IDE folders unless explicitly desired.

## U4 — CI / deploy configuration

- [ ] Workflow files (`.github/workflows/`, `.gitlab-ci.yml`, `bitbucket-pipelines.yml`) do not echo secrets.
- [ ] Deployment manifests (`vercel.json`, `netlify.toml`, `fly.toml`, `Dockerfile`, k8s) do not bake secrets into images.
- [ ] No `--privileged` containers without justification.
- [ ] Dockerfile uses pinned base images (`node:18.20.4-alpine` not `node:latest`).
- [ ] `.dockerignore` excludes `.env`, `node_modules`, `.git`.

## U5 — HTTP security headers

Check the framework's response headers (run the app or read middleware):

- [ ] `Strict-Transport-Security`
- [ ] `Content-Security-Policy` (or document why missing)
- [ ] `X-Frame-Options` or `frame-ancestors` in CSP
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy`
- [ ] `Permissions-Policy` for sensors

Missing headers are **Low** individually, **Medium** if all of them are missing.

## U6 — Cookies and sessions

- [ ] Session / auth cookies set `Secure`, `HttpOnly`, `SameSite=Lax|Strict`.
- [ ] No long-lived cookies without rotation.
- [ ] CSRF protection enabled for state-changing requests in browser-driven apps.

## U7 — Logging and error reporting

- [ ] Errors do not return stack traces to users in production.
- [ ] Logs do not include passwords, tokens, full request bodies for sensitive endpoints.
- [ ] Error tracking (Sentry, Bugsnag, etc.) scrubbing rules configured.

## U8 — File uploads (when feature exists)

- [ ] Mime/extension validated server-side, not just client-side.
- [ ] Stored outside the public web root, or served via a controller that sets `Content-Disposition: attachment` and checks MIME.
- [ ] Antivirus / scanning step considered for user-uploaded executables / archives.
- [ ] Size limit enforced.

## U9 — Public exposure

- [ ] No `/admin` reachable without auth.
- [ ] No debug endpoints (`/debug`, `/_profiler`, `/__init`, `/laravel-telescope`, `/horizon` without auth) reachable in production.
- [ ] No source maps in production builds unless explicitly intended.
- [ ] `robots.txt` does not list secret URLs.

## U10 — Cryptography defaults

- [ ] No MD5/SHA1 used for passwords or tokens.
- [ ] Password hashing uses bcrypt/argon2/scrypt with sane cost.
- [ ] Random tokens use a CSPRNG (`crypto.randomBytes`, `random_bytes`, `secrets.token_urlsafe`), not `Math.random()`/`rand()`/`time()`.
