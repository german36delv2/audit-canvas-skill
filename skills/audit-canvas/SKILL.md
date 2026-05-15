---
name: audit-canvas
description: Performs a deep security and code-quality audit of a codebase and delivers the report as an interactive Cursor Canvas (with a Markdown fallback for Claude Code and other agents). Covers modern "vibe stacks" (Next.js, Supabase, Firebase, Stripe, Expo) AND legacy server-rendered stacks (Laravel, Rails, Django, Express, FastAPI, WordPress, .NET). Produces severity-ranked findings with concrete reproduction steps and git-applyable patches. Trigger when the user asks for a security audit, vulnerability scan, code review for security, "is this safe to deploy", "audit my codebase", "check for vulnerabilities", "OWASP review", or mentions cybersecurity / security review of any project.
license: MIT
metadata:
  author: Germán Ferrando del Rincón
  version: "0.1.0"
  tags: security, audit, canvas, vibe-coding, owasp, legacy
---

# Audit Canvas

Perform a deep security audit and deliver the result as a **standalone artifact** the user can read on its own — a Cursor `.canvas.tsx` when running inside Cursor, or a Markdown report otherwise.

The report is **the deliverable**. Findings without reproduction steps and a remediation patch do not count.

## Core principles

1. **Stack-aware**: detect the stack first; then load only the relevant reference. Do not run JS-stack checks on a Laravel app or vice versa.
2. **Prove every finding**: file, line, what an attacker can do, and a working reproduction (curl, payload, or step list).
3. **Ship the fix, not the lecture**: every finding ends with a `before / after` snippet AND a self-contained patch the user can review.
4. **Severity is impact-driven, not pattern-driven**: a hardcoded test key in a sample file is not Critical.
5. **Prefer the Canvas in Cursor**: if `cursor/canvas` is the host environment, the deliverable is `.canvas.tsx`. Markdown is a fallback, not the default.

## Audit workflow

Copy this checklist and track progress as you go:

```
Audit progress:
- [ ] Phase 1 — Detect stack and surface area
- [ ] Phase 2 — Run universal checks (secrets, deps, config)
- [ ] Phase 3 — Run stack-specific checks
- [ ] Phase 4 — Run production-readiness checks
- [ ] Phase 5 — Build patches for every Critical/High finding
- [ ] Phase 6 — Render the deliverable (Canvas or Markdown)
```

### Phase 1 — Detect stack and surface area

Read [`stacks/_detect.md`](stacks/_detect.md). It gives you the file signals to identify the stack(s). A repo can be more than one stack (monorepo with Next.js frontend + Laravel backend) — handle each independently.

Capture for the report:

- Languages and versions (e.g. `PHP 7.3 (composer.json)`, `Node 18 (.nvmrc)`).
- Frameworks and versions; flag end-of-life versions explicitly.
- External services in use (Supabase, Firebase, Stripe, AWS, Cloudflare, etc.).
- Deployment surface (Docker, Vercel, Lambda, EC2, on-prem).

### Phase 2 — Universal checks

Run [`checks/universal.md`](checks/universal.md). Applies to any stack:

- Secrets & environment variables
- Dependency vulnerabilities (lockfile age, EOL libraries, known CVEs)
- Repository hygiene (`.env` committed, secrets in git history, `.gitignore` gaps)
- Build / CI configuration (workflow secrets, public artifacts)
- HTTP security headers
- TLS / cookie flags

### Phase 3 — Stack-specific checks

Load the matching file from [`stacks/`](stacks/) for each detected stack. Skip the others.

| Stack            | File                                           | Differentiator focus                                |
| ---------------- | ---------------------------------------------- | --------------------------------------------------- |
| Next.js / React  | [`stacks/nextjs.md`](stacks/nextjs.md)         | RSC trust boundaries, Server Actions, env prefixes  |
| Express / NestJS | [`stacks/express.md`](stacks/express.md)       | middleware ordering, body size, prototype pollution |
| **Laravel**      | [`stacks/laravel.md`](stacks/laravel.md)       | mass-assignment, Eloquent, gate/policy, blade XSS   |
| **Django**       | [`stacks/django.md`](stacks/django.md)         | DEBUG, ALLOWED_HOSTS, ORM raw SQL, admin            |
| **Rails**        | [`stacks/rails.md`](stacks/rails.md)           | strong params, ActiveRecord, ERB raw                |
| FastAPI / Flask  | [`stacks/python-web.md`](stacks/python-web.md) | dependency injection, pickle, jinja2 autoescape     |
| **WordPress**    | [`stacks/wordpress.md`](stacks/wordpress.md)   | nonces, capability checks, plugin auditing          |
| Mobile (RN/Expo) | [`stacks/mobile.md`](stacks/mobile.md)         | secure storage, deep links, certificate pinning     |
| Supabase         | [`stacks/supabase.md`](stacks/supabase.md)     | RLS, service_role exposure                          |
| Firebase         | [`stacks/firebase.md`](stacks/firebase.md)     | security rules, App Check                           |

The bold rows are stacks that competing skills do **not** cover well — they are first-class here.

### Phase 4 — Production-readiness checks

Run [`checks/production.md`](checks/production.md): logging of secrets, error pages leaking stack traces, debug endpoints reachable, source maps in production, CORS wildcards, rate limiting, backup posture.

### Phase 5 — Build patches

For every Critical and High finding, produce a patch. Use the format in [`templates/patch-template.diff`](templates/patch-template.diff). The patch must:

- Be unified diff format (works with `git apply`).
- Touch only the files needed for that single finding.
- Include surrounding context lines so the patch applies on small drift.
- Be saved (or shown) with a stable id like `audit-canvas/patches/C1-mass-assignment.patch`.

If a finding cannot be safely auto-patched (architectural change, requires migration, ambiguous business logic), state that explicitly and provide the manual remediation steps instead.

### Phase 6 — Render the deliverable

Decide which output to produce based on the host:

```
IF the host is Cursor and `cursor/canvas` imports are available
  -> render the Canvas (see templates/canvas-report.tsx)
ELSE
  -> render the Markdown report (see templates/markdown-report.md)
```

In Cursor, write the canvas to `~/.cursor/projects/<workspace>/canvases/<repo-name>-security-audit.canvas.tsx` (this is the only path Cursor's canvas server picks up). Read [`templates/canvas-report.tsx`](templates/canvas-report.tsx) for the structure to follow; do not invent components — only use the `cursor/canvas` SDK.

In Claude Code or any non-canvas host, write `audit-canvas-report.md` at the repository root using [`templates/markdown-report.md`](templates/markdown-report.md). Also drop the patch files under `audit-canvas/patches/`.

After writing the deliverable, append `audit-canvas/` to `.gitignore` if the user does not commit reports — the patches and report contain reproduction payloads.

## Severity scale

| Level        | Criteria                                                                            | Example                                                |
| ------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **Critical** | Unauthenticated full takeover, data exfil at scale, key exposure                    | service_role key in client bundle                      |
| **High**     | Authenticated privilege escalation, mass-assignment of role, IDOR on sensitive data | `$user->update($request->all())` lets `role_id` be set |
| **Medium**   | Information disclosure, weak crypto with mitigations, CSRF on non-sensitive         | debug endpoint reachable in prod                       |
| **Low**      | Hardening / defense-in-depth                                                        | missing security headers                               |
| **Quality**  | Maintainability or correctness, not security                                        | unused code, magic numbers                             |

Cap each report's "Critical" section at the **truly critical** items. If everything is critical, nothing is.

## Operating rules

- Read code before claiming a vulnerability. No findings based on filename heuristics alone.
- Do **not** modify production code while auditing. Patches are emitted as `.patch` files; the user applies them.
- Do **not** include PoCs that destroy data (no `DROP TABLE` reproductions). Use safe equivalents (`SELECT version()`).
- If the repository is large, audit critical paths first: auth, payments, file upload, admin, public API. Skip vendor / node_modules / build output.
- Track findings in a list as you go and renumber at the end (`C1, C2, … H1, H2, …`).

## Output structure (both Canvas and Markdown)

1. **Header** — repo name, scope audited, stack snapshot.
2. **Executive summary** — counts per severity, top three risks in plain language, deploy verdict.
3. **Stack maturity** — table of components with EOL / outdated flags.
4. **Findings by severity** — Critical → High → Medium → Low. Each finding: id, title, file:line, impact, reproduction, before/after, patch reference.
5. **Production-readiness** — checklist with pass/fail.
6. **Recommendations** — ordered action plan (now / this week / this quarter).

## When the user pushes back

- "It's just a side project" → still report the secrets and the public exploits; downgrade hardening items.
- "We'll fix it later" → pin the Critical items at the top of the recommendations, with concrete deadlines.
- "Skip the patches, just list issues" → fine, but still keep the reproduction. Diagnoses without proof are not actionable.

## References

- [`stacks/_detect.md`](stacks/_detect.md) — stack detection signals.
- [`stacks/laravel.md`](stacks/laravel.md), [`stacks/django.md`](stacks/django.md), [`stacks/rails.md`](stacks/rails.md), [`stacks/wordpress.md`](stacks/wordpress.md) — legacy server-rendered stacks (first-class).
- [`stacks/nextjs.md`](stacks/nextjs.md), [`stacks/express.md`](stacks/express.md), [`stacks/python-web.md`](stacks/python-web.md), [`stacks/mobile.md`](stacks/mobile.md), [`stacks/supabase.md`](stacks/supabase.md), [`stacks/firebase.md`](stacks/firebase.md) — modern vibe stacks.
- [`checks/universal.md`](checks/universal.md) — secrets, deps, config, headers.
- [`checks/production.md`](checks/production.md) — production-readiness gate.
- [`templates/canvas-report.tsx`](templates/canvas-report.tsx) — Cursor canvas template (default deliverable in Cursor).
- [`templates/markdown-report.md`](templates/markdown-report.md) — Markdown fallback.
- [`templates/patch-template.diff`](templates/patch-template.diff) — patch format.
- [`scripts/detect_stack.sh`](scripts/detect_stack.sh) — non-LLM stack detector.
- [`scripts/run_static_checks.sh`](scripts/run_static_checks.sh) — optional `gitleaks` / `semgrep` / dependency audit runner.
