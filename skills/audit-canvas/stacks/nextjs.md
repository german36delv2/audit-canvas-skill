# Next.js / React — security checks

## N1 — Environment variables
- [ ] No `NEXT_PUBLIC_*` holds anything actually secret. The prefix ships to the client bundle.
- [ ] `process.env.SECRET_*` accessed only in Server Components, Route Handlers, Server Actions, or middleware.
- [ ] `next.config.js` `env` field does not leak server-only values.

## N2 — Server Actions
- [ ] Every Server Action verifies the caller (`auth()` / `getSession()` first).
- [ ] No Server Action trusts a `userId` argument from the client.
- [ ] Mutations validate input with Zod / Yup / Valibot before touching the DB.
- [ ] Re-validation paths (`revalidatePath`, `revalidateTag`) do not leak across tenants.

## N3 — Route Handlers (`app/api/.../route.ts`)
- [ ] Auth check at the top of the handler.
- [ ] Body parsing length-limited; no unbounded `await req.json()` on large payloads.
- [ ] Sensitive endpoints check method (`if (req.method !== 'POST')` or rely on the per-method export).
- [ ] CORS (`Access-Control-Allow-Origin`) not wildcarded for credentialed requests.

## N4 — Middleware
- [ ] `middleware.ts` matcher actually covers the routes you think it does — log it.
- [ ] No auth check that returns `NextResponse.next()` regardless of result.
- [ ] Edge runtime middleware does not call Node-only APIs that throw silently.

## N5 — Client / Server boundary
- [ ] `'use server'` files only export server-safe functions.
- [ ] Server-only modules cannot be imported into a client component (`'use client'`); guard with `import 'server-only'`.
- [ ] Sensitive utilities (DB, secrets) imported only inside server contexts.

## N6 — Data fetching
- [ ] No raw SQL string interpolation in `route.ts` or Server Components.
- [ ] Prisma `$queryRaw` / `$executeRaw` use parameterized template literals (`$queryRaw\`SELECT ... ${Prisma.sql\`...\`}\``).
- [ ] `cookies()` / `headers()` calls not memoized accidentally across users.

## N7 — Auth providers
- [ ] NextAuth: `secret` set, `JWT.encode/decode` not overridden insecurely.
- [ ] Clerk / Auth0: middleware applied to expected paths; no `/admin` left public.
- [ ] Magic link / OTP rate-limited.

## N8 — Static export / rewrites
- [ ] `next.config.js` `rewrites` / `redirects` do not proxy arbitrary user-controlled hosts.
- [ ] Public assets do not include source maps in production unless desired (`productionBrowserSourceMaps`).

## N9 — Image and link
- [ ] `next/image` `domains` / `remotePatterns` allow-list narrow.
- [ ] No `dangerouslyAllowSVG` without `contentDispositionType`.

## N10 — Versions
- [ ] Next < 14 has known issues (Server Actions, image optimizer SSRF in older 13.x). Stay on the latest minor of 14 or 15.
- [ ] React < 18.x — upgrade.
- [ ] Note any `@latest` in package.json scripts.
