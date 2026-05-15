# WordPress — security checks

WordPress is rarely covered by AI security skills, yet it powers a huge portion of vibe-refactored sites. Cover these explicitly.

## W1 — Core / plugins / themes versions
- [ ] WordPress core on the latest minor (`includes/version.php` → `$wp_version`).
- [ ] All active plugins on latest. Check `wp-content/plugins/*/<plugin>.php` for version headers.
- [ ] Theme functions.php / parent theme up to date.
- [ ] No `wp-content/plugins/` plugin marked "abandoned" on wordpress.org.

## W2 — wp-config.php
- [ ] `define('DB_PASSWORD', ...)` not committed (file should be excluded).
- [ ] `define('AUTH_KEY', ...)` and the other 7 salts populated and unique per environment (`api.wordpress.org/secret-key/1.1/salt/`).
- [ ] `define('DISALLOW_FILE_EDIT', true);` set (no plugin/theme editor in admin).
- [ ] `define('WP_DEBUG_DISPLAY', false);` and `define('WP_DEBUG_LOG', true);` for production.
- [ ] `define('FORCE_SSL_ADMIN', true);`.

## W3 — File permissions and write paths
- [ ] `wp-config.php` is `0640` and owned by the deploy user.
- [ ] `wp-content/uploads/` not executable; web server config blocks `*.php` execution there.
- [ ] No writable web root in production beyond `uploads/`.

## W4 — Custom plugin / theme code
- [ ] Every action / AJAX handler checks `check_admin_referer()` or `wp_verify_nonce()`.
- [ ] Capability checks: `current_user_can('edit_others_posts')` etc., never trust `is_user_logged_in()` alone.
- [ ] All input through `sanitize_text_field`, `esc_url_raw`, `wp_kses_post`. Output through `esc_html`, `esc_attr`, `esc_url`.
- [ ] Direct DB queries use `$wpdb->prepare(...)` — never string concatenation.
- [ ] REST routes register `permission_callback` (do not use `__return_true` for write endpoints).
- [ ] `the_content` / `do_shortcode` calls do not run on user input.

## W5 — Public surface
- [ ] `/xmlrpc.php` disabled or rate-limited (it is a brute-force vector).
- [ ] `/wp-login.php` rate-limited (Cloudflare, fail2ban, plugin).
- [ ] `/wp-admin/` IP-restricted when feasible.
- [ ] `?author=N` enumeration redirected (`add_filter('redirect_canonical', ...)`).
- [ ] REST `/wp-json/wp/v2/users` not exposing PII (filter or block).

## W6 — Plugin auditing
- [ ] List active plugins. For each, check Wordfence / WPScan vulnerability database.
- [ ] Note plugins that haven't released in > 2 years.
- [ ] No nulled / pirated plugins (very common malware vector).

## W7 — Hosting and PHP version
- [ ] PHP >= 8.1.
- [ ] `expose_php = Off` in php.ini.
- [ ] `display_errors = Off` in production.

## W8 — Backups and restores
- [ ] Automated backups (database + uploads) outside the same hosting account.
- [ ] Restore tested in the last 90 days.

## W9 — Multisite specifics (if applicable)
- [ ] Super-admin separation respected.
- [ ] Cross-site cookies (`COOKIE_DOMAIN`, `COOKIEPATH`) configured.
