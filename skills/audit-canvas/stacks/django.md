# Django — security checks

## D1 — DEBUG and ALLOWED_HOSTS
- [ ] `DEBUG = False` in production settings.
- [ ] `ALLOWED_HOSTS` is a non-empty allow-list (no `["*"]` in prod).
- [ ] `SECRET_KEY` from environment, not committed.

## D2 — ORM and raw SQL
- [ ] No `.extra(where=[f"... {user_input} ..."])`.
- [ ] No `.raw("SELECT ... %s" % var)`. Use parameters: `Model.objects.raw("SELECT ... WHERE x = %s", [var])`.
- [ ] `objects.filter(...)` arguments not built by string concatenation.
- [ ] `connection.cursor().execute(sql, params)` — never f-string the SQL.

## D3 — Authentication and sessions
- [ ] `django.contrib.auth.backends.ModelBackend` only (no custom backend that skips `check_password`).
- [ ] `SESSION_COOKIE_SECURE = True`, `CSRF_COOKIE_SECURE = True`, `SECURE_HSTS_SECONDS` set.
- [ ] `SECURE_SSL_REDIRECT = True` behind a reverse proxy with `SECURE_PROXY_SSL_HEADER`.
- [ ] `SESSION_COOKIE_HTTPONLY = True`.

## D4 — Authorization
- [ ] Class-based views use `LoginRequiredMixin`, `PermissionRequiredMixin`, or `UserPassesTestMixin`.
- [ ] Function views decorated with `@login_required` / `@permission_required`.
- [ ] DRF viewsets specify `permission_classes`; default permissions in `REST_FRAMEWORK` are not `AllowAny`.
- [ ] Object-level checks use `get_object_or_404(Model, pk=pk, owner=request.user)`.

## D5 — Templates
- [ ] No `{% autoescape off %}` blocks rendering user input.
- [ ] No `|safe` on user-controlled strings.
- [ ] `mark_safe(...)` only on developer-trusted values.
- [ ] HTML emails use the same escaping rules as templates.

## D6 — File handling
- [ ] `FileField` storage uses a non-public path or a signed URL.
- [ ] `default_storage.save` validates extension AND content_type AND content sniff.
- [ ] No `os.path.join(MEDIA_ROOT, request.GET['name'])` (path traversal).

## D7 — Admin
- [ ] `/admin` reachable only over VPN or behind extra auth (basic auth, IP allow-list, mTLS).
- [ ] `is_staff` users restricted; superusers minimal.
- [ ] No `@admin.register` exposing PII tables to non-superusers without `has_*_permission` overrides.

## D8 — Serialization risks
- [ ] No `pickle.loads` on data crossing trust boundaries (cache, message queues).
- [ ] `yaml.safe_load`, never `yaml.load`.
- [ ] Sessions backed by `signed_cookies` only if you understand the rotation requirements.

## D9 — Dependencies and version
- [ ] Django < 4.2 is EOL. 4.2 LTS until 2026-04, then upgrade to 5.x LTS.
- [ ] `requirements.txt` pinned and reviewed with `pip-audit`.

## D10 — DRF specifics
- [ ] Throttling enabled on `DEFAULT_THROTTLE_CLASSES`.
- [ ] `BrowsableAPIRenderer` disabled in production.
- [ ] Filters use `django-filter` allow-lists, not arbitrary `?ordering=` fields.
