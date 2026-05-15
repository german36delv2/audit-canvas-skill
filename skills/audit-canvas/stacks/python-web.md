# FastAPI / Flask — security checks

## P1 — Auth dependencies
- [ ] FastAPI: every protected route has `Depends(get_current_user)` or equivalent.
- [ ] No path that omits the dependency by accident — `dependencies=[Depends(...)]` at the router level.
- [ ] Flask: every blueprint with `@login_required` or `@require_oauth(...)`.
- [ ] OAuth scopes checked, not just presence of token.

## P2 — Input validation
- [ ] Pydantic / Marshmallow models cover every request body and query param.
- [ ] No `**request.json` spread into ORM models without filtering (mass-assignment).
- [ ] No `request.json["role"]` trusted.

## P3 — Database
- [ ] SQLAlchemy: `text("... :param")` with bound params, never f-strings.
- [ ] Async sessions closed properly; no leak of connections.
- [ ] Alembic migrations don't include literal secrets.

## P4 — Serialization
- [ ] `pickle.loads` not on untrusted data (cache, queues, cookies).
- [ ] `yaml.safe_load` only.
- [ ] `xml.etree.ElementTree` replaced with `defusedxml` for untrusted XML.

## P5 — Templating
- [ ] Jinja2 `autoescape=True` (default in Flask but verify override).
- [ ] No `| safe` on user-controlled values.
- [ ] No `Markup(...)` wrap of user input.

## P6 — File handling
- [ ] `werkzeug.utils.secure_filename` applied to uploads.
- [ ] Path joins use `pathlib.Path.resolve()` + base-prefix check.
- [ ] No `open(user_supplied_path)`.

## P7 — Subprocess and shell
- [ ] `subprocess.run([...], shell=False)` with arg list, never `shell=True` + concat.
- [ ] No `os.system(user_input)`.

## P8 — CORS / CSRF
- [ ] `CORSMiddleware` `allow_origins` not `["*"]` with credentials.
- [ ] CSRF for browser-issued state-changing requests (not pure SPA-with-token).

## P9 — Secrets
- [ ] `python-dotenv` not loading `.env` in tests with real secrets.
- [ ] No `print(token)` in handlers.

## P10 — Versions
- [ ] Python 3.9+ recommended; 3.8 EOL 2024-10.
- [ ] FastAPI / Starlette current; Flask 2.3+.
- [ ] `pip-audit` or `safety` clean.
