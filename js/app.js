/* ============================================================
   NOVIQUE — app.js
   Tab navigation · Currency switch · Nova chat · PWA install
   Production build, v1.0
   ============================================================ */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     0. Utility
  --------------------------------------------------------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function showToast(message, icon) {
    var toast = $('#toast');
    var text = $('#toastText');
    if (!toast || !text) return;
    text.textContent = message;
    var i = toast.querySelector('i');
    if (i) i.className = 'fa-solid ' + (icon || 'fa-circle-check');
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { toast.classList.remove('show'); }, 2800);
  }

  /* Set current year(s) */
  var yearNow = new Date().getFullYear();
  $all('#yearHome, #yearContact').forEach(function (el) { el.textContent = yearNow; });

  /* ---------------------------------------------------------
     1. Loader — hide once DOM is ready
  --------------------------------------------------------- */
  window.addEventListener('load', function () {
    setTimeout(function () {
      var loader = $('#loader');
      if (loader) loader.classList.add('hidden');
    }, 350);
  });

  /* ---------------------------------------------------------
     2. TAB NAVIGATION (app-shell, no long scroll)
  --------------------------------------------------------- */
  var pages = $all('.page');
  var tabButtons = $all('[data-tab]');
  var tabLinks = $all('[data-tab-link]');
  var mainEl = $('#main');

  function activateTab(tabName, opts) {
    opts = opts || {};
    var target = document.getElementById('page-' + tabName);
    if (!target) return;

    pages.forEach(function (p) { p.classList.remove('active'); });
    target.classList.add('active');
    target.scrollTop = 0;

    tabButtons.forEach(function (btn) {
      var isMatch = btn.getAttribute('data-tab') === tabName;
      btn.classList.toggle('active', isMatch);
    });

    if (!opts.silent) {
      try { history.replaceState(null, '', '#' + tabName); } catch (e) {}
    }

    closeMoreSheet();
    updatePageUpArrowVisibility();
  }

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tab = btn.getAttribute('data-tab');
      if (tab) activateTab(tab);
    });
  });

  tabLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var tab = link.getAttribute('data-tab-link');
      if (tab) activateTab(tab);
    });
  });

  /* Deep-link support: novique.github.io/site#pricing etc. */
  function initFromHash() {
    var hash = (location.hash || '').replace('#', '');
    var valid = pages.some(function (p) { return p.id === 'page-' + hash; });
    activateTab(valid ? hash : 'home', { silent: true });
  }
  initFromHash();
  window.addEventListener('hashchange', initFromHash);

  /* ---------------------------------------------------------
     3. MORE SHEET (bottom sheet for overflow tabs, mobile)
  --------------------------------------------------------- */
  var moreBackdrop = $('#moreSheetBackdrop');
  var moreTabBtn = $('#moreTabBtn');
  var moreSheetEl = moreBackdrop ? $('.more-sheet', moreBackdrop) : null;

  function openMoreSheet() {
    if (!moreBackdrop) return;
    moreBackdrop.classList.add('open');
    if (moreSheetEl) moreSheetEl.setAttribute('aria-hidden', 'false');
    if (moreTabBtn) moreTabBtn.classList.add('active');
  }
  function closeMoreSheet() {
    if (!moreBackdrop) return;
    moreBackdrop.classList.remove('open');
    if (moreSheetEl) moreSheetEl.setAttribute('aria-hidden', 'true');
    if (moreTabBtn) moreTabBtn.classList.remove('active');
  }
  if (moreTabBtn) {
    moreTabBtn.addEventListener('click', function () {
      moreBackdrop.classList.contains('open') ? closeMoreSheet() : openMoreSheet();
    });
  }
  if (moreBackdrop) {
    moreBackdrop.addEventListener('click', function (e) {
      if (e.target === moreBackdrop) closeMoreSheet();
    });
  }
  $all('.more-sheet-item[data-tab]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      activateTab(btn.getAttribute('data-tab'));
    });
  });

  /* Highlight active item inside the More sheet when relevant */
  var moreTabs = ['process', 'about', 'testimonials', 'faq', 'contact'];
  var originalActivateTab = activateTab;
  activateTab = function (tabName, opts) {
    originalActivateTab(tabName, opts);
    $all('.more-sheet-item[data-tab]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });
    if (moreTabBtn) {
      moreTabBtn.classList.toggle('active', moreTabs.indexOf(tabName) !== -1 && !moreBackdrop.classList.contains('open') ? false : moreTabBtn.classList.contains('active'));
    }
  };

  /* ---------------------------------------------------------
     4. PAGE UP-ARROW (per active page, scroll to top)
  --------------------------------------------------------- */
  var pageUpBtn = $('#pageUpTop');

  function getActivePage() {
    return $('.page.active');
  }

  function updatePageUpArrowVisibility() {
    var active = getActivePage();
    if (!pageUpBtn || !active) return;
    var show = active.scrollTop > 320;
    pageUpBtn.classList.toggle('show', show);
  }

  pages.forEach(function (page) {
    page.addEventListener('scroll', function () {
      if (page.classList.contains('active')) updatePageUpArrowVisibility();
    }, { passive: true });
  });

  if (pageUpBtn) {
    pageUpBtn.addEventListener('click', function () {
      var active = getActivePage();
      if (active) active.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------------
     5. CURRENCY SWITCHER (INR default · USD approx display)
  --------------------------------------------------------- */
  var USD_RATE = 83; // approx display-only conversion, INR per USD
  var currentCurrency = 'INR';
  var currencySwitch = $('#currencySwitch');
  var currencyTrigger = $('#currencyTrigger');
  var currencyPanel = $('#currencyPanel');
  var currencyTriggerLabel = $('#currencyTriggerLabel');

  function formatINR(amount) {
    return '₹' + Number(amount).toLocaleString('en-IN');
  }
  function formatUSDApprox(inrAmount) {
    var usd = Math.round(inrAmount / USD_RATE);
    return '~$' + usd.toLocaleString('en-US') + ' USD';
  }

  function applyCurrency(currency) {
    currentCurrency = currency;
    $all('.price-inr[data-inr]').forEach(function (el) {
      var inr = parseFloat(el.getAttribute('data-inr'));
      if (isNaN(inr)) return;
      el.textContent = currency === 'INR' ? formatINR(inr) : formatUSDApprox(inr);
    });
    $all('.price-usd-line[data-inr]').forEach(function (el) {
      var inr = parseFloat(el.getAttribute('data-inr'));
      if (isNaN(inr)) return;
      if (currency === 'INR') {
        el.style.display = '';
        el.textContent = 'approx. ' + formatUSDApprox(inr).replace('~', '');
      } else {
        el.style.display = 'none';
      }
    });
    if (currencyTriggerLabel) {
      currencyTriggerLabel.textContent = currency === 'INR' ? '₹ INR' : '$ USD';
    }
    var introText = $('#pricingIntroText');
    if (introText) {
      introText.textContent = currency === 'INR'
        ? 'Prices shown in Indian Rupees (₹). Switch to USD from the currency selector at the top for an approximate conversion.'
        : 'Showing an approximate USD conversion. Our default pricing and final invoices are in Indian Rupees (₹) — switch back anytime from the currency selector at the top.';
    }
    $all('.currency-option').forEach(function (opt) {
      var isActive = opt.getAttribute('data-currency') === currency;
      opt.classList.toggle('active', isActive);
      opt.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    try { localStorage.setItem('novique_currency', currency); } catch (e) {}
  }

  if (currencyTrigger) {
    currencyTrigger.addEventListener('click', function () {
      var isOpen = currencySwitch.classList.toggle('open');
      currencyTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }
  $all('.currency-option').forEach(function (opt) {
    opt.addEventListener('click', function () {
      var currency = opt.getAttribute('data-currency');
      applyCurrency(currency);
      currencySwitch.classList.remove('open');
      currencyTrigger.setAttribute('aria-expanded', 'false');
      showToast('Prices updated to ' + currency, 'fa-coins');
    });
  });
  document.addEventListener('click', function (e) {
    if (currencySwitch && !currencySwitch.contains(e.target)) {
      currencySwitch.classList.remove('open');
      if (currencyTrigger) currencyTrigger.setAttribute('aria-expanded', 'false');
    }
  });

  /* Restore saved currency preference, default INR */
  (function initCurrency() {
    var saved = 'INR';
    try { saved = localStorage.getItem('novique_currency') || 'INR'; } catch (e) {}
    applyCurrency(saved);
  })();

  /* ---------------------------------------------------------
     6. COUNTER ANIMATION (stat numbers)
  --------------------------------------------------------- */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;
    var duration = 1200;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var countersAnimated = {};
  function animateVisibleCounters(container) {
    $all('.counter', container).forEach(function (el) {
      var key = el.getAttribute('data-target') + '-' + (el.parentElement ? el.parentElement.className : '');
      if (el._counted) return;
      el._counted = true;
      animateCounter(el);
    });
  }
  // Animate counters the first time home/about pages become active
  var countersInit = { home: false, about: false };
  var origActivate2 = activateTab;
  activateTab = function (tabName, opts) {
    origActivate2(tabName, opts);
    if ((tabName === 'home' || tabName === 'about') && !countersInit[tabName]) {
      countersInit[tabName] = true;
      var pg = document.getElementById('page-' + tabName);
      animateVisibleCounters(pg);
    }
  };
  // Trigger for initial page (home) on load
  setTimeout(function () {
    var homePage = document.getElementById('page-home');
    if (homePage && homePage.classList.contains('active') && !countersInit.home) {
      countersInit.home = true;
      animateVisibleCounters(homePage);
    }
  }, 300);

  /* ---------------------------------------------------------
     7. PORTFOLIO FILTER
  --------------------------------------------------------- */
  var filterBtns = $all('.filter-btn');
  var projectCards = $all('.project-card');
  var portfolioEmpty = $('#portfolioEmpty');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      var visibleCount = 0;
      projectCards.forEach(function (card) {
        var match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('show', match);
        if (match) visibleCount++;
      });
      if (portfolioEmpty) portfolioEmpty.style.display = visibleCount === 0 ? 'block' : 'none';
    });
  });

  /* ---------------------------------------------------------
     8. FAQ ACCORDION
  --------------------------------------------------------- */
  $all('[data-faq-toggle]').forEach(function (head) {
    head.addEventListener('click', function () {
      var item = head.closest('.faq-item');
      if (!item) return;
      var wasOpen = item.classList.contains('open');
      $all('.faq-item.open').forEach(function (openItem) { openItem.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ---------------------------------------------------------
     9. CASE STUDY ACCORDION
  --------------------------------------------------------- */
  $all('[data-case-toggle]').forEach(function (head) {
    head.addEventListener('click', function () {
      var item = head.closest('.case-item');
      if (!item) return;
      var wasOpen = item.classList.contains('open');
      $all('.case-item.open').forEach(function (openItem) { openItem.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ---------------------------------------------------------
     10. CONTACT FORM — opens mail client with prefilled details
     (Static PWA: no backend, so we hand off to the user's email app.)
  --------------------------------------------------------- */
  var contactForm = $('#contactForm');
  var formSuccess = $('#formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#fname').value.trim();
      var email = $('#femail').value.trim();
      var phone = $('#fphone') ? $('#fphone').value.trim() : '';
      var service = $('#fservice').value;
      var budget = $('#fbudget').value;
      var message = $('#fmessage').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields', 'fa-triangle-exclamation');
        return;
      }

      var subject = 'Project Inquiry from ' + name + ' — ' + service;
      var body =
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        (phone ? 'Phone: ' + phone + '\n' : '') +
        'Service Needed: ' + service + '\n' +
        'Estimated Budget: ' + budget + '\n\n' +
        'Project Details:\n' + message;

      var mailto = 'mailto:novique.team@gmail.com' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      window.location.href = mailto;

      if (formSuccess) formSuccess.classList.add('show');
      showToast('Opening your email app…', 'fa-envelope');
      setTimeout(function () {
        contactForm.reset();
      }, 400);
    });
  }

  /* ---------------------------------------------------------
     11. NOVA CHAT WIDGET
     No backend is wired up yet. Nova answers from a small local
     knowledge base about NoviQue (services, pricing, process,
     contact) so the widget is fully functional out of the box.
     To connect a real AI backend later: replace getNovaReply()
     with a fetch() call to your own server endpoint — never put
     a provider API key directly in client-side code.
  --------------------------------------------------------- */
  var launcher = $('#novaLauncher');
  var novaWindow = $('#novaWindow');
  var closeBtn = $('#novaCloseBtn');
  var clearBtn = $('#novaClearBtn');
  var body = $('#novaBody');
  var form = $('#novaForm');
  var input = $('#novaInput');
  var sendBtn = $('#novaSend');
  var faqRow = $('#novaFaq');
  var dot = $('#novaDot');
  var scrollTopBtn = $('#novaScrollTop');

  var STORAGE_KEY = 'novique_nova_chat_v1';
  var history = [];
  var isOpen = false;
  var hasGreeted = false;

  function loadHistory() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) history = JSON.parse(raw) || [];
    } catch (e) { history = []; }
  }
  function saveHistory() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(history)); } catch (e) {}
  }

  function renderMessage(role, text) {
    var msg = document.createElement('div');
    msg.className = 'nova-msg ' + role;
    msg.textContent = text;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  function renderAllHistory() {
    body.innerHTML = '';
    history.forEach(function (m) { renderMessage(m.role, m.content); });
    var userHasReplied = history.some(function (m) { return m.role === 'user'; });
    if (faqRow) faqRow.style.display = userHasReplied ? 'none' : 'flex';
  }

  function openNova() {
    isOpen = true;
    launcher.classList.add('open');
    launcher.setAttribute('aria-expanded', 'true');
    novaWindow.classList.add('open');
    novaWindow.setAttribute('aria-hidden', 'false');
    if (dot) dot.classList.remove('show');
    if (!hasGreeted && history.length === 0) {
      hasGreeted = true;
      pushMessage('assistant', "Hi, I'm Nova from NoviQue. Ask me about our services, pricing, or how to get started — or tap a quick question below.", { keepFaq: true });
    }
    setTimeout(function () { input && input.focus(); }, 300);
  }
  function closeNova() {
    isOpen = false;
    launcher.classList.remove('open');
    launcher.setAttribute('aria-expanded', 'false');
    novaWindow.classList.remove('open');
    novaWindow.setAttribute('aria-hidden', 'true');
  }

  if (launcher) {
    launcher.addEventListener('click', function () { isOpen ? closeNova() : openNova(); });
  }
  if (closeBtn) closeBtn.addEventListener('click', closeNova);

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      history = [];
      saveHistory();
      body.innerHTML = '';
      if (faqRow) faqRow.style.display = 'flex';
      hasGreeted = false;
      showToast('Chat cleared', 'fa-broom');
    });
  }

  if (body && scrollTopBtn) {
    body.addEventListener('scroll', function () {
      scrollTopBtn.classList.toggle('show', body.scrollTop > 240);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', function () {
      body.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function pushMessage(role, content, opts) {
    opts = opts || {};
    history.push({ role: role, content: content });
    saveHistory();
    renderMessage(role, content);
    if (faqRow && !opts.keepFaq) faqRow.style.display = 'none';
  }

  /* --- Local knowledge base --- */
  var NOVA_FAQ = [
    { keys: ['service', 'offer', 'what do you do', 'what can you build'],
      reply: "We design and build websites, mobile apps, UI/UX, and brand identities, plus AI solutions, digital marketing and SEO. Tell me a bit about your project and I can point you to the right service." },
    { keys: ['cost', 'price', 'pricing', 'how much', 'budget'],
      reply: "Our plans start around ₹79,999 for a Starter website and ₹2,19,999 for our Growth package, with custom quotes for larger builds. Check the Pricing tab for full details, or tell me your project and I'll suggest a fit." },
    { keys: ['how long', 'timeline', 'turnaround', 'duration'],
      reply: "Most projects run 2 to 16 weeks depending on scope. A simple marketing site is on the faster end, a full app or brand system takes longer. Once we know your goals we can give you an exact timeline." },
    { keys: ['start', 'get started', 'begin', 'kick off'],
      reply: "Easiest way is the Contact tab. Share a little about your project and goals, and our team will follow up within one business day to set up a call." },
    { keys: ['location', 'located', 'where are you', 'based'],
      reply: "NoviQue is a remote-first studio based in India, working with clients everywhere. Location is never a barrier to working together." },
    { keys: ['support', 'maintenance', 'after launch'],
      reply: "Yes, every plan includes a support window after launch, and we offer ongoing maintenance and SEO retainers for continued care." },
    { keys: ['contact', 'email', 'phone', 'whatsapp', 'reach'],
      reply: "You can reach us anytime at novique.team@gmail.com, call or WhatsApp us at +91 93669 15733, or use the Contact tab to send a project inquiry directly." },
    { keys: ['currency', 'inr', 'usd', 'dollar', 'rupee'],
      reply: "Prices are listed in Indian Rupees (₹) by default. You can switch to an approximate USD view using the currency selector at the top of the app." },
    { keys: ['payment', 'pay', 'invoice'],
      reply: "Most engagements are split into three milestones: 40% at kickoff, 30% at design approval, and 30% at launch. We accept UPI, bank transfer and major cards." },
    { keys: ['own', 'ownership', 'source code', 'rights'],
      reply: "Yes, full ownership of designs, source code and assets transfers to you once final payment is received. No licensing fees, no lock-in." }
  ];

  function getNovaReply(userText) {
    var lower = userText.toLowerCase();
    for (var i = 0; i < NOVA_FAQ.length; i++) {
      var entry = NOVA_FAQ[i];
      for (var j = 0; j < entry.keys.length; j++) {
        if (lower.indexOf(entry.keys[j]) !== -1) return entry.reply;
      }
    }
    return "Good question. I don't have an exact answer for that yet, but the team can help directly — reach out at novique.team@gmail.com, WhatsApp +91 93669 15733, or use the Contact tab and we'll follow up within one business day.";
  }

  function showTyping() {
    var typing = document.createElement('div');
    typing.className = 'nova-msg assistant';
    typing.id = 'novaTyping';
    typing.textContent = 'Typing…';
    body.appendChild(typing);
    body.scrollTop = body.scrollHeight;
  }
  function hideTyping() {
    var typing = document.getElementById('novaTyping');
    if (typing) typing.remove();
  }

  function handleSend(text) {
    text = (text || '').trim();
    if (!text) return;
    pushMessage('user', text);
    input.value = '';
    autoResize();
    sendBtn.disabled = true;
    showTyping();
    setTimeout(function () {
      hideTyping();
      var reply = getNovaReply(text);
      pushMessage('assistant', reply);
      sendBtn.disabled = false;
    }, 500 + Math.random() * 400);
  }

  function autoResize() {
    if (!input) return;
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 90) + 'px';
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      handleSend(input.value);
    });
  }
  if (input) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend(input.value);
      }
    });
    input.addEventListener('input', autoResize);
  }
  if (faqRow) {
    faqRow.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-q]');
      if (!btn) return;
      handleSend(btn.getAttribute('data-q'));
    });
  }

  loadHistory();
  if (history.length > 0) {
    renderAllHistory();
    hasGreeted = true;
    if (dot) dot.classList.add('show');
  }

  /* ---------------------------------------------------------
     12. PWA INSTALL PROMPT
  --------------------------------------------------------- */
  var deferredPrompt = null;
  var installBanner = $('#installBanner');
  var installAcceptBtn = $('#installAcceptBtn');
  var installDismissBtn = $('#installDismissBtn');
  var installBtnTop = $('#installBtnTop');
  var moreInstallBtn = $('#moreInstallBtn');
  var INSTALL_DISMISS_KEY = 'novique_install_dismissed';

  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    if (isStandalone()) return;
    var dismissed = false;
    try { dismissed = sessionStorage.getItem(INSTALL_DISMISS_KEY) === '1'; } catch (err) {}
    if (!dismissed && installBanner) {
      setTimeout(function () { installBanner.classList.add('show'); }, 2200);
    }
    if (installBtnTop) installBtnTop.style.display = 'flex';
  });

  function promptInstall() {
    if (!deferredPrompt) {
      showToast('Use your browser menu to install this app', 'fa-circle-info');
      return;
    }
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function (choice) {
      if (choice.outcome === 'accepted') {
        showToast('Installing NoviQue…', 'fa-download');
      }
      deferredPrompt = null;
      if (installBanner) installBanner.classList.remove('show');
    });
  }

  if (installAcceptBtn) installAcceptBtn.addEventListener('click', promptInstall);
  if (installBtnTop) installBtnTop.addEventListener('click', promptInstall);
  if (moreInstallBtn) moreInstallBtn.addEventListener('click', promptInstall);
  if (installDismissBtn) {
    installDismissBtn.addEventListener('click', function () {
      installBanner.classList.remove('show');
      try { sessionStorage.setItem(INSTALL_DISMISS_KEY, '1'); } catch (e) {}
    });
  }
  window.addEventListener('appinstalled', function () {
    if (installBanner) installBanner.classList.remove('show');
    if (installBtnTop) installBtnTop.style.display = 'none';
    showToast('NoviQue installed. Welcome!', 'fa-circle-check');
  });

  /* ---------------------------------------------------------
     13. OFFLINE / ONLINE BANNER
  --------------------------------------------------------- */
  var offlineBanner = $('#offlineBanner');
  function updateOnlineStatus() {
    if (!offlineBanner) return;
    if (!navigator.onLine) {
      offlineBanner.classList.add('show');
    } else {
      offlineBanner.classList.remove('show');
    }
  }
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();

  /* ---------------------------------------------------------
     14. SERVICE WORKER REGISTRATION
  --------------------------------------------------------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function (err) {
        console.warn('Service worker registration failed:', err);
      });
    });
  }

})();
