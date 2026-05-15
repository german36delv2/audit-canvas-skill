# Firebase — security checks

## F1 — Security Rules
- [ ] `firestore.rules` deny by default; explicit allow per collection.
- [ ] No `match /{document=**} { allow read, write: if true }`.
- [ ] Writes check ownership: `request.auth.uid == resource.data.owner`.
- [ ] No reliance on client-set fields for authorization decisions.
- [ ] Rules include data-shape validation (`request.resource.data.keys().hasOnly([...])`).

## F2 — Storage Rules
- [ ] `storage.rules` deny by default.
- [ ] Per-user paths enforced (`/users/{uid}/...` allowed only if `request.auth.uid == uid`).
- [ ] Max content size enforced.

## F3 — App Check
- [ ] App Check enabled for Firestore, Storage, RTDB, Functions, AI extensions.
- [ ] Debug tokens not committed.

## F4 — Cloud Functions
- [ ] HTTPS callable functions verify `context.auth` for write ops.
- [ ] Background triggers do not trust event payload metadata for auth decisions.
- [ ] Runtime config / env not echoing secrets to logs.

## F5 — Realtime DB
- [ ] Rules separate from Firestore — both audited.
- [ ] No `.read: true, .write: true` at the root.

## F6 — Service accounts
- [ ] Admin SDK service-account JSON not committed.
- [ ] Function runtime service accounts have least privilege (no Editor).
- [ ] Secret Manager used for API keys, not function env.
