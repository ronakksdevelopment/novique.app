# Changelog

All notable changes to the NoviQue site/app are documented here.

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
