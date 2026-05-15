# Mobile (React Native / Expo) — security checks

## M1 — Secret storage
- [ ] Tokens stored in `expo-secure-store` / `react-native-keychain` — never `AsyncStorage`.
- [ ] No API keys hardcoded in JS bundle. RN bundles are easy to extract; assume any string in source ships to the device.

## M2 — API key isolation
- [ ] Third-party API keys (OpenAI, Stripe secret, etc.) live behind a backend proxy, never on device.
- [ ] Public-by-design keys (Firebase web apiKey, Stripe publishable) acceptable in code.

## M3 — Deep links
- [ ] Universal Links / App Links configured with verified domain associations.
- [ ] `Linking.addEventListener` validates URL origin and parameters before acting.
- [ ] No deep link triggers state-changing actions without auth re-check.

## M4 — Network
- [ ] HTTPS-only; ATS exceptions justified.
- [ ] Certificate pinning considered for high-risk apps.

## M5 — Build / OTA
- [ ] EAS Update / CodePush channels separated by environment.
- [ ] No `console.log` of tokens shipping in release builds.
- [ ] Release builds strip debug symbols / source maps from distribution unless uploaded privately.

## M6 — Permissions
- [ ] App requests only the permissions used.
- [ ] Camera / mic / location requests have clear user-facing rationale.

## M7 — WebViews
- [ ] `WebView` does not enable `javaScriptEnabled` for untrusted origins.
- [ ] `originWhitelist` set; no `["*"]`.
- [ ] No bridge that eval's messages from web content.
