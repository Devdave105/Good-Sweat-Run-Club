/* ================================================================
   GOOD SWEAT RUN CLUB UYO — script.js v4
   Modular · Lazy video loading · Why-Sweat modal at 3 min
================================================================ */
(function () {
  'use strict';

  const WA   = '2349032188849';
  const $    = (s, c) => (c || document).querySelector(s);
  const $$   = (s, c) => [...(c || document).querySelectorAll(s)];
  const wa   = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  const lock = () => (document.body.style.overflow = 'hidden');
  const free = () => (document.body.style.overflow = '');

  /* ─── helper: open/close backdrop + modal ─── */
  function openModal(bk, modal) { bk.classList.add('on'); modal.classList.add('on'); lock(); }
  function closeModal(bk, modal) { bk.classList.remove('on'); modal.classList.remove('on'); free(); }

  /* ══════════════════════════════════════════
     1. HERO SLIDER
  ══════════════════════════════════════════ */
  function initSlider() {
    const slides = $$('.hslide');
    const dots   = $$('.hdot');
    const hHead  = $('#hHead');
    const hSub   = $('#hSub');
    if (!slides.length) return;

    const copy = [
      {
        h: 'Run With Purpose.<br /><em>Grow With Community.</em>',
        s: 'Join 500+ runners in Uyo building discipline, health, and real human connection — one Saturday at a time.'
      },
      {
        h: 'Every Step Forward<br /><em>Is a Victory.</em>',
        s: 'Beginners welcome. Advanced runners thrive. Good Sweat meets you exactly where you are — and pushes you further.'
      },
      {
        h: 'Uyo Wakes at 6 AM.<br /><em>So Should You.</em>',
        s: 'Four locations. One community. Every Saturday we hit the streets and remind ourselves what we are made of.'
      }
    ];

    let cur = 0;
    let timer;

    function goTo(idx) {
      slides[cur].classList.remove('is-active');
      dots[cur].classList.remove('is-active');
      cur = (idx + slides.length) % slides.length;
      slides[cur].classList.add('is-active');
      dots[cur].classList.add('is-active');

      if (hHead && hSub) {
        const tx = 'opacity .55s ease, transform .55s ease';
        hHead.style.cssText = 'opacity:0;transform:translateY(16px)';
        hSub.style.cssText  = 'opacity:0;transform:translateY(12px)';
        setTimeout(() => {
          hHead.innerHTML  = copy[cur].h;
          hSub.textContent = copy[cur].s;
          hHead.style.cssText = `transition:${tx};opacity:1;transform:none`;
          hSub.style.cssText  = `transition:${tx};transition-delay:.12s;opacity:1;transform:none`;
        }, 220);
      }
    }

    function next() { goTo(cur + 1); }
    function startTimer() { timer = setInterval(next, 5800); }
    function resetTimer() { clearInterval(timer); startTimer(); }

    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetTimer(); }));
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { next(); resetTimer(); }
      if (e.key === 'ArrowLeft')  { goTo(cur - 1); resetTimer(); }
    });

    // Touch swipe
    const hero = $('.hero');
    if (hero) {
      let sx = 0;
      hero.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
      hero.addEventListener('touchend',   e => {
        const dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 48) { dx < 0 ? next() : goTo(cur - 1); resetTimer(); }
      });
    }

    startTimer();
  }

  /* ══════════════════════════════════════════
     2. LAZY VIDEO LOAD (all videos)
     Loads actual src only when near viewport
  ══════════════════════════════════════════ */
  function initLazyVideos() {
    const videos = $$('video[data-src]');
    if (!videos.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const vid = en.target;
          // Copy data-src to src
          vid.src = vid.dataset.src;
          // Also update <source> children if present
          $$('source[data-src]', vid).forEach(s => { s.src = s.dataset.src; });
          vid.load();
          // Auto-play muted ambient videos
          if (vid.muted) {
            vid.play().catch(() => {});
          }
          io.unobserve(vid);
        }
      });
    }, { rootMargin: '200px' });

    videos.forEach(v => io.observe(v));
  }

  /* ══════════════════════════════════════════
     3. VIDEO PLAY BUTTONS (click to unmute/play)
  ══════════════════════════════════════════ */
  function initVideoButtons() {
    // Full-width video break
    const vbBtn = $('.vbp');
    const vbVid = $('.vid-break video');
    bindVidBtn(vbBtn, vbVid);

    // Volunteer section
    const vvBtn = $('.vvp');
    const vvVid = $('.vol-vid');
    bindVidBtn(vvBtn, vvVid);

    // Gallery inline video
    const gvBtn = $('.gvp');
    const gvVid = $('.g-vid-item video');
    bindVidBtn(gvBtn, gvVid);

    // Accent video
    const vaBtn = $('.vap');
    const vaVid = $('.vid-accent video');
    bindVidBtn(vaBtn, vaVid);

    function bindVidBtn(btn, vid) {
      if (!btn || !vid) return;
      const wrap = btn.closest('[class]');
      btn.addEventListener('click', () => {
        if (vid.paused) {
          // Pause all other non-muted playing videos
          $$('video').forEach(v => { if (v !== vid && !v.muted) { v.pause(); v.muted = true; } });
          vid.muted = false;
          vid.play().catch(() => {});
          btn.style.opacity = '0';
          btn.style.pointerEvents = 'none';
          if (wrap) wrap.classList.add('vid-playing');
          vid.addEventListener('pause', () => {
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'all';
            if (wrap) wrap.classList.remove('vid-playing');
          }, { once: true });
        } else {
          vid.pause();
          vid.muted = true;
          btn.style.opacity = '1';
          btn.style.pointerEvents = 'all';
          if (wrap) wrap.classList.remove('vid-playing');
        }
      });
    }
  }

  /* ══════════════════════════════════════════
     4. NAVBAR
  ══════════════════════════════════════════ */
  function initNav() {
    const nav = $('#nav');
    if (!nav) return;
    const fn = () => nav.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
  }

  /* ══════════════════════════════════════════
     5. HAMBURGER / PANEL
  ══════════════════════════════════════════ */
  function initBurger() {
    const btn   = $('#burger');
    const panel = $('#panel');
    const links = $$('.pm-a');
    if (!btn || !panel) return;
    let on = false;

    function open()  { on = true;  btn.classList.add('on'); panel.classList.add('on'); panel.setAttribute('aria-hidden','false'); btn.setAttribute('aria-expanded','true');  lock(); }
    function close() { on = false; btn.classList.remove('on'); panel.classList.remove('on'); panel.setAttribute('aria-hidden','true');  btn.setAttribute('aria-expanded','false'); free(); }

    btn.addEventListener('click', () => on ? close() : open());
    links.forEach(l => l.addEventListener('click', close));
    document.addEventListener('click', e => { if (on && !panel.contains(e.target) && !btn.contains(e.target)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && on) { close(); btn.focus(); } });
  }

  /* ══════════════════════════════════════════
     6. SMOOTH SCROLL
  ══════════════════════════════════════════ */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href === '#') return;
        const t = $(href);
        if (!t) return;
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
        window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
      });
    });
  }

  /* ══════════════════════════════════════════
     7. SCROLL REVEAL
  ══════════════════════════════════════════ */
  function initReveal() {
    const els = $$('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -44px 0px' });
    els.forEach(el => io.observe(el));
  }

  /* ══════════════════════════════════════════
     8. BACK TO TOP
  ══════════════════════════════════════════ */
  function initBtt() {
    const btn = $('#btt');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('on', window.scrollY > 500), { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ══════════════════════════════════════════
     9. TICKER PAUSE ON HOVER
  ══════════════════════════════════════════ */
  function initTicker() {
    const row = $('#tickerRow');
    if (!row) return;
    row.addEventListener('mouseenter', () => (row.style.animationPlayState = 'paused'));
    row.addEventListener('mouseleave', () => (row.style.animationPlayState = 'running'));
  }

  /* ══════════════════════════════════════════
     10. LOCATION CARDS — show 3, CTA expands 4th
  ══════════════════════════════════════════ */
  function initLocCards() {
    const btn    = $('#seeAllBtn');
    const hidden = $$('.lcard-hidden');
    if (!btn || !hidden.length) return;
    let on = false;
    btn.addEventListener('click', () => {
      on = !on;
      hidden.forEach(c => {
        if (on) { c.style.display = 'block'; requestAnimationFrame(() => c.classList.add('reveal', 'in')); }
        else    { c.style.display = 'none';  c.classList.remove('reveal', 'in'); }
      });
      btn.textContent = on ? 'Show Less' : 'View All Locations';
    });
  }

  /* ══════════════════════════════════════════
     11. LOCATION JOIN OVERLAY
  ══════════════════════════════════════════ */
  function initLocOverlay() {
    const overlay  = $('#locOv');
    const closeBtn = $('#locOvClose');
    const nameSpan = $('#ovLocName');
    const hidden   = $('#lHidden');
    const form     = $('#locForm');
    if (!overlay) return;

    function open(loc) { if (nameSpan) nameSpan.textContent = loc; if (hidden) hidden.value = loc; overlay.classList.add('on'); lock(); }
    function close()   { overlay.classList.remove('on'); free(); }

    $$('.lc-btn').forEach(b => b.addEventListener('click', () => open(b.dataset.loc || 'a Location')));
    closeBtn && closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('on')) close(); });

    form && form.addEventListener('submit', e => {
      e.preventDefault();
      const name  = $('#lName')?.value.trim();
      const phone = $('#lPhone')?.value.trim();
      const loc   = hidden?.value;
      if (!name || !phone) { alert('Please fill in all fields.'); return; }
      const msg = `Hello Good Sweat Run Club Uyo,\n\nI'd like to join the *${loc}* location.\n\nName: ${name}\nPhone: ${phone}\n\nPlease add me. Thank you!`;
      window.open(wa(msg), '_blank');
      form.reset();
      close();
    });
  }

  /* ══════════════════════════════════════════
     12. MEMBERSHIP FORM
  ══════════════════════════════════════════ */
  function initMemForm() {
    const form = $('#memForm');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name  = $('#mName')?.value.trim();
      const phone = $('#mPhone')?.value.trim();
      const level = $('#mLevel')?.value;
      const loc   = $('#mLoc')?.value;
      if (!name || !phone || !level || !loc) { alert('Please fill in all fields.'); return; }
      const msg = `Hello Good Sweat Run Club Uyo,\n\nI'd like to become a member.\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Level:* ${level}\n*Location:* ${loc}\n\nPlease reach out to onboard me. Thank you!`;
      window.open(wa(msg), '_blank');
      form.reset();
    });
  }

  /* ══════════════════════════════════════════
     13. REVIEWS EXPAND
  ══════════════════════════════════════════ */
  function initReviews() {
    const btn    = $('#moreRvBtn');
    const hidden = $$('.rv-hidden');
    if (!btn || !hidden.length) return;
    let on = false;
    btn.addEventListener('click', () => {
      on = !on;
      hidden.forEach((r, i) => {
        if (on) { r.style.display = 'block'; setTimeout(() => r.classList.add('reveal', 'in'), i * 60); }
        else    { r.style.display = 'none';  r.classList.remove('reveal', 'in'); }
      });
      btn.textContent = on ? 'Show Less Reviews' : 'See More Reviews';
    });
  }

  /* ══════════════════════════════════════════
     14. RULES MODAL
  ══════════════════════════════════════════ */
  function initRules() {
    const openBtn = $('#openRules');
    const bk      = $('#rulesBk');
    const modal   = $('#rulesModal');
    const closeB  = $('#rulesClose');
    const chk     = $('#rmChk');
    const cont    = $('#rmContinue');
    if (!modal || !bk) return;

    openBtn  && openBtn.addEventListener('click', () => openModal(bk, modal));
    closeB   && closeB.addEventListener('click',  () => { closeModal(bk, modal); if (chk) chk.checked = false; if (cont) cont.disabled = true; });
    bk.addEventListener('click', () => { closeModal(bk, modal); if (chk) chk.checked = false; if (cont) cont.disabled = true; });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('on')) { closeModal(bk, modal); if (chk) chk.checked = false; if (cont) cont.disabled = true; } });
    chk  && cont && chk.addEventListener('change',  () => (cont.disabled = !chk.checked));
    cont && cont.addEventListener('click', () => { if (!cont.disabled) { closeModal(bk, modal); if (chk) chk.checked = false; cont.disabled = true; } });
  }

  /* ══════════════════════════════════════════
     15. WHY SWEAT MODAL — fires after 3 minutes
  ══════════════════════════════════════════ */
  function initSweatModal() {
    const bk     = $('#swBk');
    const modal  = $('#swModal');
    const closeB = $('#swClose');
    const skip   = $('#swSkip');
    const join   = $('#swJoin');
    if (!modal || !bk) return;

    function open()  { openModal(bk, modal); }
    function close() { closeModal(bk, modal); }

    // Fire after 3 minutes (180,000 ms)
    setTimeout(open, 180000);

    closeB && closeB.addEventListener('click', close);
    skip   && skip.addEventListener('click',   close);
    join   && join.addEventListener('click',   close); // navigates via href
    bk.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('on')) close(); });
  }

  /* ══════════════════════════════════════════
     INIT ALL
  ══════════════════════════════════════════ */
  function init() {
    initSlider();
    initLazyVideos();
    initVideoButtons();
    initNav();
    initBurger();
    initSmoothScroll();
    initReveal();
    initBtt();
    initTicker();
    initLocCards();
    initLocOverlay();
    initMemForm();
    initReviews();
    initRules();
    initSweatModal();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

})();