# Changelog

All notable changes to the NoviQue site/app are documented here.

## [1.5.0] — 2026-09-06

Visual/animation refresh on top of the 1.0 tab-based app shell — same structure and content, new type and motion system.

### Added
- Switched typeface pairing to **Permanent Marker** (display) + **Kalam** (body), self-hosted — replacing Sora/Manrope. No Google Fonts CDN dependency.
- Updated color system to the deeper `#1A1A19` background palette.
- Full icon animation system: hover "flourish" wiggle on nav links, buttons, service/stat icons; tuned Font Awesome fa-beat/fa-bounce/fa-shake/fa-spin durations; slight hand-drawn tilt on icon containers.
- Selective "sketchy" hand-drawn wobble filter (SVG `feTurbulence`/`feDisplacementMap`) on larger decorative icons (service cards, mini-cards, founder avatar) — skipped on small nav/tab-bar glyphs to keep those crisp.
- Ambient floating-card and orb-glow motion behind the home hero visual.
- Fully animated Nova chat widget: breathing/rippling launcher, spin-in open/close icon, avatar sway, status-dot pulse, message slide-in, send-button pulse while a reply is pending.
- Hand-drawn pencil cursor with trailing wobble ring and click-scribble burst, shipped as a standalone `js/doodle-cursor.js` module — desktop/fine-pointer only, degrades to the system cursor on touch devices and for reduced-motion users.
- `prefers-reduced-motion` fallbacks added for every new animation.

### Changed
- Bumped service worker cache version to `v1.5.0` and refreshed its cached-asset list (old Sora/Manrope font paths removed, `doodle-cursor.js` added) so installed PWAs pick up the new build instead of serving stale v1.0 assets.
- `manifest.json` `background_color`/`theme_color` and the `<meta name="theme-color">` tag updated to match the new palette.
- README's AI backend section corrected to describe editing `js/config.openrouter.js` (the actual, current mechanism) instead of `app.js` directly.

### Security
- Confirmed no API key of any kind is present in any shipped file. `js/config.openrouter.js` ships with `OPENROUTER_API_KEY` and `OPENROUTER_PROXY_URL` both empty, exactly as delivered — fill in your own key or proxy URL there if you want Nova to use a real model.

## [Unreleased-content, folded into 1.5.0] — content & feature updates

### Added
- New **Members** tab: founder card (Rajdeep Singh, Founder) plus an "Apply to join" form that submits directly to WhatsApp.
- **OpenRouter AI backend support** for Nova: `js/config.openrouter.js` is a dedicated, separate config file for an API key or a proxy URL — no editing of `app.js` required. Falls back to the local FAQ bot automatically if unconfigured.
- `.github/workflows/build-apk.yml`: automatic Android APK build & GitHub Release on tag push, via Bubblewrap — no local Android SDK setup needed.

### Changed
- Pricing: new launch offers — Website ₹8,000 (20% off first project, 2 free updates/week), Mobile App ₹10,000 (4 free updates/month, free publishing, free lifetime hosting). Premium/custom tier and add-ons unchanged.
- Contact WhatsApp/phone number updated to +91 70059 66672 across the site.
- About page now credits Rajdeep Singh as Founder.
- Fixed install prompt banner rendering underneath the bottom tab bar on some mobile browsers — the app now measures the tab bar's real height at runtime instead of relying on a fixed guess.

## [1.0.0] — 2026-09-06

Initial production release.

### Added
- Full tab-based PWA rebuild (Home, Services, Portfolio, Pricing, Process, About, Reviews, FAQ, Contact) — replacing the original long-scroll one-page demo.
- Installable PWA support: manifest, service worker with offline app-shell caching, install banner/prompt, iOS/Android/desktop install support.
- Currency switcher: INR (default) with approximate USD conversion, persisted across sessions.
- Nova chat widget rebuilt as a self-contained local FAQ assistant — no external API key, works offline, persists conversation locally.
- Page-level and chat-level "scroll to top" controls.
- Full self-hosting of fonts (Sora, Manrope) and icons (Font Awesome) — zero external CDN dependency.
- Custom on-brand SVG illustrations replacing all stock photography across hero, about, portfolio and case study sections.
- Real studio contact details throughout: novique.team@gmail.com, +91 93669 15733 (call + WhatsApp).
- 404 fallback page for GitHub Pages deep-link support.
- `robots.txt`, `sitemap.xml`, full Open Graph/Twitter meta tags.

### Fixed (from original demo)
- Removed a hardcoded, publicly exposed third-party AI API key.
- Fixed desktop navigation incorrectly rendering on mobile viewports.
- Fixed install banner intercepting taps on the bottom tab bar.
- Fixed Nova's quick-question chips being hidden immediately after the greeting message that referenced them.
- Fixed chat history not re-rendering when reopening the widget or reloading the page.
- Fixed the pricing page's currency note not updating when USD was selected.
