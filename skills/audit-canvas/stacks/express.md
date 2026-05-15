# Express / NestJS — security checks

## E1 — Middleware ordering
- [ ] `helmet()` registered early.
- [ ] `cors()` configured with explicit `origin` allow-list (no `*` for credentialed routes).
- [ ] Auth middleware before route handlers, after body parsing, after CORS.
- [ ] Error handler registered last and does not echo stack traces in production.

## E2 — Body and payload limits
- [ ] `express.json({ limit: '1mb' })` — never default unbounded.
- [ ] `multer` storage limited and disk path outside web root.
- [ ] No `app.use(express.urlencoded({ extended: true }))` without limit.

## E3 — Routes
- [ ] No state-changing route on `GET`.
- [ ] CSRF (`csurf` or double-submit cookie) on browser-driven forms.
- [ ] `/admin` mounted behind auth + role check.
- [ ] `/health` and `/metrics` either auth'd or scoped to internal network.

## E4 — Authentication
- [ ] JWT verification uses `jsonwebtoken.verify(...)`, never `decode()`.
- [ ] `iss`, `aud`, `exp` checked.
- [ ] No `algorithms: ['none']` accepted.
- [ ] Sessions (`express-session`) with `secret` from env, `cookie.secure`, `cookie.httpOnly`, `cookie.sameSite`.

## E5 — Authorization
- [ ] Per-route guards (NestJS) or per-handler middleware (Express).
- [ ] No `req.body.userId` trusted for ownership checks; always `req.user.id`.
- [ ] IDOR checks: every fetch by id includes ownership filter.

## E6 — Database
- [ ] ORM used safely (Prisma / TypeORM / Sequelize) — no `entityManager.query("... " + input)`.
- [ ] Mongoose: no `find(req.body)` (allows operators like `$ne`); use explicit fields.
- [ ] Pagination caps maximum `take` / `limit`.

## E7 — Prototype pollution
- [ ] User input merged into objects via `Object.assign(target, src)` only after schema validation.
- [ ] No `lodash.merge` / `merge-deep` on untrusted input without a deny-list for `__proto__`, `constructor`, `prototype`.
- [ ] `qs` parser depth limited (`app.set('query parser', ...)` or `qs.parse(... { depth: 5 })`).

## E8 — File system and shell
- [ ] No `child_process.exec(... + req.body)`. Use `execFile` with arg array.
- [ ] No `fs.readFile(path.join(BASE, req.params.name))` without `path.resolve` + base-prefix check.
- [ ] No `eval`, `Function(...)`, `vm.runInThisContext` on user input.

## E9 — Logging and errors
- [ ] No request body logged for `/auth/*`, `/billing/*`.
- [ ] Errors return generic messages to clients; details to the logger.

## E10 — Versions
- [ ] Node < 18 EOL.
- [ ] Express 4.x is fine; 5.x check breaking changes.
- [ ] NestJS keep with the active major.
