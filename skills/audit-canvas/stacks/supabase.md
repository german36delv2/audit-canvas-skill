# Supabase — security checks

## S1 — Service role key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` only used server-side.
- [ ] Never wrapped behind `NEXT_PUBLIC_` / `VITE_` / `EXPO_PUBLIC_` prefix.
- [ ] No `createClient(url, serviceRoleKey)` in code that runs in the browser, mobile, or edge functions reachable from the public.

## S2 — Row Level Security
- [ ] RLS **enabled** on every table that contains user data: `ALTER TABLE x ENABLE ROW LEVEL SECURITY;`.
- [ ] Policies cover SELECT, INSERT, UPDATE, DELETE — not just SELECT.
- [ ] Policies use `auth.uid()` and never `true` for write operations.
- [ ] No policy has `using (true)` on a private table.

## S3 — Storage policies
- [ ] Bucket privacy correct (public vs private).
- [ ] Storage policies check ownership before allowing read/write.
- [ ] Signed URLs short-lived.

## S4 — Edge functions
- [ ] Verify JWT (`Authorization: Bearer ...`) at function start.
- [ ] No service-role usage from a function callable by anonymous clients without explicit auth check first.
- [ ] CORS configured properly (origin allow-list).

## S5 — Auth settings (Studio)
- [ ] Email confirmation enabled (or justified disabled).
- [ ] Anonymous sign-ins disabled in production unless intended.
- [ ] Site URL and redirect URLs allow-list match production domains only.
- [ ] Password policy minimum length >= 12.

## S6 — Realtime
- [ ] Channels broadcast scoped by user id, not global.
- [ ] No leaking of others' rows via Postgres Changes when RLS missing.

## S7 — Migrations
- [ ] Migrations checked in.
- [ ] No `GRANT ALL PRIVILEGES` to `anon` or `authenticated` roles.
