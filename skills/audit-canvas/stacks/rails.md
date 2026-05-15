# Rails — security checks

## R1 — Strong parameters
- [ ] Every controller `params.require(:x).permit(:safe, :columns, :only)`.
- [ ] No `permit!` on user-driven params (allows everything).
- [ ] Sensitive columns (`role`, `admin`, `confirmed_at`, `password_digest`) never in `permit` list.

## R2 — ActiveRecord and SQL
- [ ] No `where("name = '#{params[:q]}'")`. Use `where("name = ?", params[:q])` or `where(name: params[:q])`.
- [ ] No `find_by_sql("SELECT ... #{...}")`.
- [ ] `order(params[:sort])` only with allow-list (`%w[name created_at].include?(...)` first).

## R3 — ERB and XSS
- [ ] No `<%= raw something %>` on user input.
- [ ] No `html_safe` on user input.
- [ ] `simple_format`, `sanitize` with explicit allow-listed tags.

## R4 — Authentication / Devise
- [ ] `secret_key_base` in env / credentials, never committed.
- [ ] Devise modules `:lockable`, `:trackable`, `:confirmable` configured for production.
- [ ] No `current_user = User.find(params[:user_id])`.
- [ ] Session store: `:cookie_store` with `secure: true, httponly: true, same_site: :lax` (or `:strict`).

## R5 — Authorization (Pundit / CanCan)
- [ ] Every controller action authorized: `authorize @record` (Pundit) or `load_and_authorize_resource` (CanCan).
- [ ] Policies cover `index?`, `show?`, `create?`, `update?`, `destroy?`.
- [ ] Scope-based queries: `policy_scope(Model)`.

## R6 — Mass assignment via nested attributes
- [ ] `accepts_nested_attributes_for :child` paired with explicit `permit(child_attributes: [:name, ...])`.
- [ ] `_destroy` on nested attributes only allowed where intended.

## R7 — File uploads (Active Storage / CarrierWave / Shrine)
- [ ] `content_type` validated server-side.
- [ ] `direct_upload` URLs are short-lived and scoped.
- [ ] Storage bucket not public unless intended.

## R8 — Rake tasks and migrations
- [ ] No `rake task` that runs arbitrary `system(params[...])`.
- [ ] Migrations don't include literal secrets.

## R9 — Configuration
- [ ] `config.force_ssl = true` in production.
- [ ] `config.action_dispatch.default_headers` includes baseline security headers.
- [ ] `config.consider_all_requests_local = false` in production.
- [ ] `config.action_controller.allow_forgery_protection = true`.

## R10 — Dependencies and version
- [ ] Rails < 7.0 is EOL.
- [ ] Run `bundle audit check --update`.
- [ ] Watch for old `paperclip`, `nokogiri` < 1.13, `rack` < 2.2.x.
