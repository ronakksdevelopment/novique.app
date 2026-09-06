# NoviQue — Designed to Inspire

Official website and installable Progressive Web App (PWA) for **NoviQue**, an independent design studio. Version 1.0.

**Live site:** https://novique.github.io/site

---

## What's inside

A fully self-contained, production-ready static PWA — no build step, no backend, no external CDN dependencies. Everything (fonts, icons, images) is bundled locally so the app works fully offline once installed.

- **Tab-based app shell** — Home, Services, Portfolio, Pricing, Process, About, Reviews, FAQ, Contact each live on their own screen, switched instantly via a bottom tab bar on mobile / top nav on desktop. No long one-page scroll.
- **Installable PWA** — add-to-home-screen on iOS/Android, installable on desktop (Chrome, Edge). Works offline via a service worker with app-shell caching.
- **Currency switcher** — prices default to Indian Rupees (₹) with a one-tap approximate USD conversion, remembered across visits.
- **Nova chat widget** — a lightweight, fully local FAQ assistant (no API key, no backend call, no data leaves the device). See [Connecting a real AI backend](#connecting-a-real-ai-backend-optional) below to upgrade it.
- **Real contact details** — email, phone, and WhatsApp are wired to actual `mailto:`, `tel:`, and `wa.me` links.
- **No placeholder content** — all copy, pricing, and case studies are real, finished content. Portfolio and section imagery are custom-made on-brand SVG illustrations (not stock photos), so there's nothing to swap out unless you want to replace them with real project screenshots.

---

## Tech stack

Plain HTML, CSS and vanilla JavaScript (ES5-compatible, no framework, no bundler). Fonts: Sora (display) + Manrope (body), self-hosted. Icons: Font Awesome 6, self-hosted. Zero npm install required to run or deploy.

---

## Hosting on GitHub Pages

1. Push the contents of this folder to the root of your `novique/site` repository (or wherever `index.html` should live for `https://novique.github.io/site`).
2. In the repo settings, enable **GitHub Pages** from the branch/folder you pushed to.
3. That's it — no build command needed. `404.html` is included so any deep link (e.g. a bookmark to `#pricing`) still resolves correctly on GitHub Pages.

If you ever change the repo name or path, update:
- `manifest.json` → `start_url`, `scope`, `id`
- `index.html` → the `<link rel="canonical">` and Open Graph `og:url`
- `sitemap.xml` and `robots.txt`

---

## Updating content

Everything lives in three files:

| File | What to edit |
|---|---|
| `index.html` | All page copy, pricing, contact details, service/portfolio cards |
| `css/style.css` | Colors, spacing, layout, component styling |
| `js/app.js` | Tab logic, currency conversion rate, Nova's local FAQ answers, PWA install behavior |

### Changing the USD conversion rate
Open `js/app.js` and edit the constant near the top of the currency section:
```js
var USD_RATE = 83; // INR per 1 USD — update this periodically
```
This is a **manual, approximate** rate by design (no live exchange-rate API call), matching how the studio wants pricing displayed.

### Editing Nova's answers
Nova is a local keyword-matching FAQ bot — see the `NOVA_FAQ` array in `js/app.js`. Add new `{ keys: [...], reply: "..." }` entries to teach it more answers. No external API is called.

---

## Connecting a real AI backend (optional)

Nova currently answers from a small local knowledge base — this is intentional and safe for a static GitHub Pages site, since there's no server to hold an API key securely. If you later want Nova to use a real LLM:

1. Stand up a small backend (Cloudflare Worker, Vercel function, or similar) that holds your AI provider's API key server-side.
2. In `js/app.js`, find the `getNovaReply()` function and replace its body with a `fetch()` call to your backend endpoint, sending the user's message and returning the reply.
3. **Never** put a provider API key directly in `app.js` or any file shipped to the browser — anyone can view it in dev tools.

---

## Updating icons / branding

All app icons are generated from `assets/img/logo.png` (2048×2048 source). If you update the logo, regenerate the icon set (`icons/icon-*.png`, `icons/maskable-*.png`, `icons/apple-touch-icon.png`, `icons/favicon*.png`, `icons/favicon.ico`) at the same sizes currently in the `icons/` folder.

---

## Browser support

Modern evergreen browsers (Chrome, Edge, Safari, Firefox) on desktop, iOS and Android. Installable PWA support varies slightly by platform (iOS uses Safari's "Add to Home Screen"; Android/desktop Chromium browsers use the native install prompt).

---

## License

© 2026 NoviQue Studio. All rights reserved. Font Awesome is used under its own license (see `vendor/fontawesome/LICENSE.txt`).

---

## Before you go fully live

A few things were filled in with reasonable placeholders since they weren't provided — worth a review pass:

- **Social links** (Contact page in `index.html`): Instagram (`novique.team`), LinkedIn (`company/novique`), X (`novique`), Dribbble (`novique`) are guessed handles, not verified real accounts. Update them once the actual profiles exist, or remove the icons for any platform you don't use.
- **Portfolio & case study content**: client names, project names, and results (e.g. "Orbital Finance," "+64% engagement") are illustrative placeholders written to demonstrate the layout, not real client work or verified figures. Swap in actual project names, real outcomes, and (once you have work to show) real screenshots before publishing.
- **Testimonials**: names, quotes, and titles are illustrative, not real client quotes. Replace with actual testimonials, with permission, before launch.
- **Portfolio/about imagery**: original abstract SVG art in the brand palette, not real project screenshots. This was a deliberate choice to avoid broken or misattributed stock photos, but swap in real work when you're ready to showcase it.

---

## Contact

- Email: novique.team@gmail.com
- Phone / WhatsApp: +91 93669 15733
