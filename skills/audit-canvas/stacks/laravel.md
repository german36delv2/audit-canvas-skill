# Laravel — security checks

Laravel is **first-class** in audit-canvas. Most competing skills target only Next.js + Supabase and miss the patterns below. Cover every item; skip only those that the codebase provably does not use.

## L1 — Mass assignment

- [ ] Every Eloquent model has `$fillable` (preferred) or `$guarded` set explicitly.
- [ ] No controller calls `$model->fill($request->all())` or `$model->update($request->all())` on a model whose `$fillable` includes privileged columns (`role_id`, `is_admin`, `email_verified_at`, `password`, `franchise_id`).
- [ ] Form Requests with `validated()` are preferred over `$request->all()`.
- [ ] Profile / settings update endpoints filter the request to the columns the user is allowed to change.

**Common `before / after`:**
```php
// Before (Critical when role_id is fillable)
public function update(Request $r) { auth()->user()->update($r->all()); }

// After
public function update(ProfileUpdateRequest $r) {
    auth()->user()->update($r->validated());
}
```

## L2 — Authorization

- [ ] Every protected route has middleware (`auth`, `verified`, `can:`) — no relying on the frontend hiding links.
- [ ] Resource controllers use `$this->authorize(...)` against a Policy.
- [ ] Eloquent queries scope by ownership: `->where('user_id', auth()->id())`.
- [ ] No `Model::find($id)` on user-supplied ids without an authorization check (IDOR).
- [ ] Group route middleware actually applies — verify with `php artisan route:list`.

## L3 — SQL and Eloquent

- [ ] No raw `DB::raw('... '. $userInput .' ...')`. Use bindings: `DB::raw('column = ?')` with `setBindings`.
- [ ] No `whereRaw` concatenating input.
- [ ] No `orderBy(request('sort'))` without an allow-list.
- [ ] Pagination column whitelisted.

## L4 — Blade and XSS

- [ ] No `{!! $userInput !!}` on user-controlled values; if needed, sanitize with `Purifier` or `clean()`.
- [ ] `{{-- comments --}}` only — Blade `@php` blocks should not echo unescaped.
- [ ] Email templates HTML-escape merge fields too.

## L5 — File uploads

- [ ] `Storage::putFileAs(...)` with a server-generated filename (UUID), never `$request->file('x')->getClientOriginalName()`.
- [ ] Mime checked via `Validator::make` rules (`mimes:jpg,png,pdf`), not extension only.
- [ ] Files stored under `storage/app/private/...`, served via a controller that authorizes access.
- [ ] Image processing libraries up to date (Intervention 3.x; older `dompdf` 0.x has known SSRF/XSS).

## L6 — Routes and CSRF

- [ ] No state-changing route registered as `GET`.
- [ ] `web` middleware group applied to browser routes (CSRF is in there).
- [ ] API routes that browsers hit use Sanctum / CSRF cookie or a same-origin policy.
- [ ] No global `VerifyCsrfToken::$except` wildcards leaking auth-protected paths.

## L7 — Authentication

- [ ] `bcrypt` or `argon2id` hashing (default; do not override).
- [ ] Password reset tokens delivered out-of-band, single-use, short-lived.
- [ ] `Auth::login($user, $remember)` with `$remember=true` rotates token on logout.
- [ ] No custom `Auth::loginUsingId(request('user_id'))`.

## L8 — Session and cookies

- [ ] `SESSION_DRIVER=cookie` only with `SESSION_ENCRYPT=true` and `SESSION_SECURE_COOKIE=true` over HTTPS.
- [ ] `SESSION_SAME_SITE=lax` minimum (`strict` for admin areas).
- [ ] `APP_KEY` set, 32-byte, not the default placeholder.

## L9 — Configuration / env

- [ ] `APP_DEBUG=false` in production.
- [ ] `config:cache` and `route:cache` after every deploy (also catches calls to `env()` outside config files).
- [ ] No `env()` calls inside controllers or models — caching breaks them silently.

## L10 — Outdated framework

- [ ] Laravel 8/9 is **EOL**. Recommend upgrade path 8 → 9 → 10 → 11.
- [ ] Check `vendor/laravel/framework/src/Illuminate/Foundation/Application.php` for the version constant.
- [ ] List abandoned packages in the report header (`fideloper/proxy`, `fruitcake/laravel-cors`, `barryvdh/laravel-dompdf` 0.x are common in old Laravel apps).

## L11 — Common Laravel pitfalls in vibe-refactored apps

When AI agents touch a Laravel app, watch for:
- A new model added without `$fillable` (defaults to all columns mass-assignable).
- `Model::firstOrCreate($request->all(), $request->all())` introduced in a controller.
- A migration that adds `role_id` but leaves the column mass-assignable.
- Routes added to `routes/api.php` without `auth:sanctum`.
- New `BIND` calls to `request()->merge(['user_id' => auth()->id()])` that get overridden by user input later.
