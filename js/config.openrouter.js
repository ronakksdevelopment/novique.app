/* ============================================================
   NOVIQUE — OpenRouter API configuration
   ------------------------------------------------------------
   Purpose:
   This file is a placeholder for wiring Nova (the chat widget)
   up to a real AI model via OpenRouter (https://openrouter.ai).
   It is loaded as a separate <script> BEFORE js/app.js, so you
   only ever need to edit THIS file to add/change your API key —
   app.js itself never needs to be touched for that.

   IMPORTANT SECURITY WARNING — please read before adding a key:
   This is a static site with no backend server. Any value you
   put in this file ships to the browser and is fully visible to
   anyone who opens dev tools or "view source" — including your
   OpenRouter API key. This is fine for local testing or a
   private/internal deployment, but is NOT safe for a public
   production site: someone could copy your key and rack up
   usage on your account.

   For a public production site, the safe pattern is:
     1. Leave OPENROUTER_API_KEY empty below (or leave this file
        untouched — Nova will keep using her local FAQ answers).
     2. Stand up a tiny backend (Cloudflare Worker, Vercel/Netlify
        function, etc.) that holds the real key server-side.
     3. Set OPENROUTER_PROXY_URL below to point at that backend
        instead of putting a key here directly.
   See README.md → "Connecting a real AI backend" for more detail.
   ------------------------------------------------------------ */

window.NOVIQUE_AI_CONFIG = {
  /* -----------------------------------------------------------
     OPTION A — Direct browser call (quick testing only, NOT
     recommended for a public/production site — see warning above).
     Paste your OpenRouter API key between the quotes below.
     Get a key at: https://openrouter.ai/keys
  ----------------------------------------------------------- */
  OPENROUTER_API_KEY: "", // e.g. "sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

  /* Which model OpenRouter should use when a key is present.
     Browse available models/ids at: https://openrouter.ai/models */
  OPENROUTER_MODEL: "openai/gpt-4o-mini",

  /* -----------------------------------------------------------
     OPTION B — Safer: call your own backend/proxy instead, and
     let IT hold the real OpenRouter key server-side. If this is
     set (non-empty), app.js will call this URL instead of
     OpenRouter directly, and OPENROUTER_API_KEY above is ignored.
     Your backend should accept { message, history } as JSON and
     return { reply: "..." }.
  ----------------------------------------------------------- */
  OPENROUTER_PROXY_URL: "", // e.g. "https://your-worker.example.workers.dev/chat"

  /* Optional system prompt sent with every request, describing
     how Nova should behave when powered by a real model. */
  SYSTEM_PROMPT:
    "You are Nova, the friendly assistant for NoviQue, an independent design studio founded by Rajdeep Singh. " +
    "Answer questions about NoviQue's services, pricing, process and how to get in touch. " +
    "Keep replies concise and helpful. If you don't know something, direct the person to the Contact tab " +
    "or WhatsApp +91 70059 66672."
};
