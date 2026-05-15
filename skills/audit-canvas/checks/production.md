# Production-readiness checks

Run after stack-specific checks. These are pass/fail gates for shipping.

## P1 — Environment separation
- [ ] Distinct `.env` files for dev/staging/prod, never sharing keys.
- [ ] `APP_DEBUG=false` (or framework equivalent) in production.
- [ ] `APP_ENV=production` actually set on the deployment target.
- [ ] Different database / storage / API keys per environment.

## P2 — Rate limiting
- [ ] Login, password reset, registration, and any unauthenticated POST endpoint have rate limits.
- [ ] AI / LLM endpoints have per-user **and** global usage caps.
- [ ] Rate-limit counters are not stored in client cookies (must be server-side).

## P3 — Authentication hardening
- [ ] Strong password policy (length-based, not character-classes).
- [ ] Lockout / exponential backoff after failed logins.
- [ ] MFA available for privileged accounts (admin, billing).
- [ ] Password reset tokens single-use and short-lived.

## P4 — Backup and recovery
- [ ] Database backups automated and tested (restore drill within last 90 days).
- [ ] Backups stored off-platform (not the same S3 account / region as primary).
- [ ] PITR (point-in-time recovery) enabled on the primary database.

## P5 — Observability
- [ ] Structured logging in production.
- [ ] Error tracking with PII scrubbing.
- [ ] Uptime monitoring and on-call routing.
- [ ] Alert on auth failures spike, 5xx spike, queue depth.

## P6 — Data minimization
- [ ] Avoid storing full credit card numbers, government IDs, or biometrics unless required.
- [ ] PII fields encrypted at rest where applicable.
- [ ] User deletion ("right to be forgotten") implemented.

## P7 — Network posture
- [ ] HTTPS enforced (HSTS preload-eligible if public).
- [ ] No internal services reachable from the public internet (admin DBs, queues).
- [ ] Security groups / firewall rules audited.

## P8 — Dependencies pipeline
- [ ] Renovate / Dependabot enabled.
- [ ] Build fails on new High/Critical CVEs.
- [ ] Deployment artifacts produced from CI, not from a developer laptop.

## P9 — Disaster contacts
- [ ] `SECURITY.md` published with disclosure address.
- [ ] On-call rotation documented.
- [ ] Incident-response runbook exists for "all my keys leaked" and "database is down".
