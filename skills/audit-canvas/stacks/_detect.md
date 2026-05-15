# Stack detection signals

Read these files (if they exist) and infer every stack present in the repo. A repo can have several at once (monorepo).

## Signals

| Stack | Strong signal | Secondary signal |
|---|---|---|
| Next.js | `next.config.{js,ts,mjs}`, `app/` or `pages/` dir | `next` in `package.json` |
| Vite / React SPA | `vite.config.*`, `index.html` at root with `src/main.tsx` | `vite` + `react` in `package.json` |
| Express | `app.use(`, route definitions in `*.js`/`*.ts` | `express` in `package.json` |
| NestJS | `nest-cli.json`, `*.module.ts` | `@nestjs/core` |
| **Laravel** | `artisan`, `composer.json` with `"laravel/framework"` | `app/`, `routes/web.php` |
| **Django** | `manage.py`, `settings.py`, `wsgi.py`, `asgi.py` | `INSTALLED_APPS` |
| **Rails** | `config/application.rb`, `Gemfile` with `rails` | `app/controllers/` + `app/models/` |
| FastAPI | `from fastapi import` in main module | `fastapi` in `requirements.txt` / `pyproject.toml` |
| Flask | `from flask import Flask` | `flask` in `requirements.txt` |
| **WordPress** | `wp-config.php`, `wp-content/` | `wp-includes/` |
| Mobile (RN) | `app.json` + `metro.config.js`, `ios/`/`android/` | `react-native` |
| Mobile (Expo) | `app.json` with `expo` key, `expo` in deps | `eas.json` |
| Supabase | `supabase/` dir, `@supabase/*` deps | `service_role` references |
| Firebase | `firebase.json`, `firestore.rules` | `firebase-admin` deps |
| Stripe | `stripe` in deps | `STRIPE_SECRET_KEY` env refs |

## Versions to capture

For every stack found, record the version and whether it's EOL. Common pitfalls:

- PHP < 8.1 → EOL.
- Laravel < 10 → out of support.
- Node < 18 → EOL.
- Django < 4.2 → EOL (4.2 is LTS until 2026-04).
- Rails < 7.0 → EOL.
- Next.js < 14 → security fixes only via upgrade.
- WordPress core older than current minor — every minor often patches CVEs.

Mark EOL versions as **Critical** under "Stack maturity" in the report header, even before running other checks. EOL software receives no security fixes.

## Output

After Phase 1, emit a `Detected stacks` block before continuing:

```
Detected stacks:
- Laravel 8.83 (PHP 7.3) — EOL ⚠
- Livewire 2.5 — outdated
- Docker (compose v3) — review network mode
External services:
- MySQL 5.7 — EOL
- Cloudflare (CDN)
```
