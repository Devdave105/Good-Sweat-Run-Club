/* ================================================================
   GOOD SWEAT RUN CLUB UYO — script.js v6
   Videos: 3-state cycle  →  Play (with sound)  →  Mute  →  Pause
================================================================ */
(function () {
  'use strict';

  const WA   = '2349032188849';
  const $    = (s, c) => (c || document).querySelector(s);
  const $$   = (s, c) => [...(c || document).querySelectorAll(s)];
  const wa   = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  const lock = () => { document.body.style.overflow = 'hidden'; };
  const free = () => { document.body.style.overflow = ''; };

  function openModal (bk, m) { bk.classList.add('on');    m.classList.add('on');    lock(); }
  function closeModal(bk, m) { bk.classList.remove('on'); m.classList.remove('on'); free(); }

  /* ─────────────────────────────────────────
     SVG ICONS
  ───────────────────────────────────────── */
  const ICON_PLAY  = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <polygon points="6,3 20,12 6,21" fill="var(--gold)"/>
  </svg>`;

  const ICON_MUTE  = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 5L6 9H2v6h4l5 4V5z" fill="var(--gold)"/>
    <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"
          stroke="var(--gold)" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`;

  const ICON_PAUSE = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6"  y="4" width="4" height="16" rx="1" fill="var(--gold)"/>
    <rect x="14" y="4" width="4" height="16" rx="1" fill="var(--gold)"/>
  </svg>`;

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
        s: 'Join 500+ runners in Uyo building discipline, health, and real connection — one Saturday at a time.'
      },
      {
        h: 'Every Step Forward<br /><em>Is a Victory.</em>',
        s: 'Beginners welcome. Advanced runners thrive. Good Sweat meets you where you are — and pushes you further.'
      },
      {
        h: 'Uyo Wakes at 6 AM.<br /><em>So Should You.</em>',
        s: 'Four locations. One community. Every Saturday we hit the streets and remind ourselves what we are made of.'
      }
    ];

    let cur = 0, timer;

    function goTo(idx) {
      slides[cur].classList.remove('is-active');
      dots[cur].classList.remove('is-active');
      cur = (idx + slides.length) % slides.length;
      slides[cur].classList.add('is-active');
      dots[cur].classList.add('is-active');

      if (hHead && hSub) {
        const tx = 'opacity .55s ease, transform .55s ease';
        hHead.style.cssText = 'opacity:0;transform:translateY(14px)';
        hSub.style.cssText  = 'opacity:0;transform:translateY(10px)';
        setTimeout(() => {
          hHead.innerHTML  = copy[cur].h;
          hSub.textContent = copy[cur].s;
          hHead.style.cssText = `transition:${tx};opacity:1;transform:none`;
          hSub.style.cssText  = `transition:${tx};transition-delay:.12s;opacity:1;transform:none`;
        }, 200);
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

    const hero = $('.hero');
    if (hero) {
      let sx = 0;
      hero.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
      hero.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 44) { dx < 0 ? next() : goTo(cur - 1); resetTimer(); }
      });
    }

    startTimer();
  }

  /* ══════════════════════════════════════════
     2. VIDEOS — 3-state cycle per button
     ┌──────────────────────────────────────┐
     │  State 0 (PAUSED/MUTED)              │
     │    Button shows: PLAY icon           │
     │    Click → play with sound → State 1 │
     ├──────────────────────────────────────┤
     │  State 1 (PLAYING + SOUND)           │
     │    Button shows: MUTE icon           │
     │    Click → mute, keep playing        │
     │                         → State 2    │
     ├──────────────────────────────────────┤
     │  State 2 (PLAYING + MUTED)           │
     │    Button shows: PAUSE icon          │
     │    Click → pause + mute  → State 0   │
     └──────────────────────────────────────┘
  ══════════════════════════════════════════ */
  function initVideos() {

    const pairs = [
      { b: '.vbp', v: '.vid-break video'  },
      { b: '.vvp', v: '.vol-vid'          },
      { b: '.gvp', v: '.g-vid-item video' },
      { b: '.vap', v: '.vid-accent video' },
    ];

    pairs.forEach(({ b, v }) => {
      const btn = $(b);
      const vid = $(v);
      if (!btn || !vid) return;

      // Muted ambient loop on page load
      vid.muted = true;
      vid.loop  = true;
      vid.play().catch(() => {});

      // Set initial icon
      btn.innerHTML = ICON_PLAY;

      btn.addEventListener('click', () => {
        const playing = !vid.paused;
        const muted   = vid.muted;

        if (!playing) {
          /* ── STATE 0 → STATE 1: play with sound ── */
          muteAllOthers(vid, btn);
          vid.muted = false;
          vid.play().catch(() => {
            // Autoplay blocked — play muted instead, stay at state 2
            vid.muted = true;
            vid.play().catch(() => {});
            btn.innerHTML = ICON_PAUSE;
          });
          btn.innerHTML = ICON_MUTE;

        } else if (playing && !muted) {
          /* ── STATE 1 → STATE 2: mute, keep playing ── */
          vid.muted = true;
          btn.innerHTML = ICON_PAUSE;

        } else {
          /* ── STATE 2 → STATE 0: pause and mute ── */
          vid.pause();
          vid.muted = true;
          btn.innerHTML = ICON_PLAY;
        }
      });

      // If video ends naturally, reset to state 0
      vid.addEventListener('ended', () => {
        vid.muted = true;
        btn.innerHTML = ICON_PLAY;
      });
    });

    /* Mute all other videos and reset their buttons to PLAY icon */
    function muteAllOthers(currentVid, currentBtn) {
      pairs.forEach(({ b, v }) => {
        const otherBtn = $(b);
        const otherVid = $(v);
        if (!otherBtn || !otherVid || otherVid === currentVid) return;
        otherVid.muted = true;
        if (!otherVid.paused) {
          // Keep them looping silently in background
          otherBtn.innerHTML = ICON_PAUSE;
        } else {
          otherBtn.innerHTML = ICON_PLAY;
        }
      });
    }
  }

  /* ══════════════════════════════════════════
     3. NAVBAR SCROLL
  ══════════════════════════════════════════ */
  function initNav() {
    const nav = $('#nav');
    if (!nav) return;
    const fn = () => nav.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
  }

  /* ══════════════════════════════════════════
     4. HAMBURGER / PANEL
  ══════════════════════════════════════════ */
  function initBurger() {
    const btn   = $('#burger');
    const panel = $('#panel');
    const links = $$('.pm-a');
    if (!btn || !panel) return;
    let on = false;

    const open = () => {
      on = true;
      btn.classList.add('on');
      panel.classList.add('on');
      panel.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
      lock();
    };
    const close = () => {
      on = false;
      btn.classList.remove('on');
      panel.classList.remove('on');
      panel.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      free();
    };

    btn.addEventListener('click', () => (on ? close() : open()));
    links.forEach(l => l.addEventListener('click', close));
    document.addEventListener('click', e => {
      if (on && !panel.contains(e.target) && !btn.contains(e.target)) close();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && on) { close(); btn.focus(); }
    });
  }

  /* ══════════════════════════════════════════
     5. SMOOTH SCROLL
  ══════════════════════════════════════════ */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href === '#') return;
        const target = $(href);
        if (!target) return;
        e.preventDefault();
        const navH = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
        ) || 68;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - navH,
          behavior: 'smooth'
        });
      });
    });
  }

  /* ══════════════════════════════════════════
     6. SCROLL REVEAL
  ══════════════════════════════════════════ */
  function initReveal() {
    const els = $$('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
  }

  /* ══════════════════════════════════════════
     7. BACK TO TOP
  ══════════════════════════════════════════ */
  function initBtt() {
    const btn = $('#btt');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('on', window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ══════════════════════════════════════════
     8. TICKER PAUSE ON HOVER
  ══════════════════════════════════════════ */
  function initTicker() {
    const row = $('#tickerRow');
    if (!row) return;
    row.addEventListener('mouseenter', () => { row.style.animationPlayState = 'paused'; });
    row.addEventListener('mouseleave', () => { row.style.animationPlayState = 'running'; });
  }

  /* ══════════════════════════════════════════
     9. LOCATION CARDS — 3 shown, CTA reveals 4th
  ══════════════════════════════════════════ */
  function initLocCards() {
    const btn    = $('#seeAllBtn');
    const hidden = $$('.lcard-hidden');
    if (!btn || !hidden.length) return;
    let on = false;
    btn.addEventListener('click', () => {
      on = !on;
      hidden.forEach(c => {
        if (on) {
          c.style.display = 'block';
          requestAnimationFrame(() => c.classList.add('reveal', 'in'));
        } else {
          c.style.display = 'none';
          c.classList.remove('reveal', 'in');
        }
      });
      btn.textContent = on ? 'Show Less' : 'View All Locations';
    });
  }

  /* ══════════════════════════════════════════
     10. LOCATION JOIN OVERLAY
  ══════════════════════════════════════════ */
  function initLocOverlay() {
    const overlay  = $('#locOv');
    const closeBtn = $('#locOvClose');
    const nameSpan = $('#ovLocName');
    const hiddenIn = $('#lHidden');
    const form     = $('#locForm');
    if (!overlay) return;

    const open = loc => {
      if (nameSpan) nameSpan.textContent = loc;
      if (hiddenIn) hiddenIn.value = loc;
      overlay.classList.add('on');
      lock();
    };
    const close = () => { overlay.classList.remove('on'); free(); };

    $$('.lc-btn').forEach(b =>
      b.addEventListener('click', () => open(b.dataset.loc || 'a Location'))
    );
    closeBtn && closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('on')) close();
    });

    form && form.addEventListener('submit', e => {
      e.preventDefault();
      const name  = $('#lName')?.value.trim();
      const phone = $('#lPhone')?.value.trim();
      const loc   = hiddenIn?.value;
      if (!name || !phone) { alert('Please fill in all fields.'); return; }
      const msg = `Hello Good Sweat Run Club Uyo,\n\nI'd like to join the *${loc}* location.\n\nName: ${name}\nPhone: ${phone}\n\nPlease add me. Thank you!`;
      window.open(wa(msg), '_blank');
      form.reset();
      close();
    });
  }

  /* ══════════════════════════════════════════
     11. MEMBERSHIP FORM
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
     12. REVIEWS — 3 shown, CTA reveals 5 more
  ══════════════════════════════════════════ */
  function initReviews() {
    const btn    = $('#moreRvBtn');
    const hidden = $$('.rv-hidden');
    if (!btn || !hidden.length) return;
    let on = false;
    btn.addEventListener('click', () => {
      on = !on;
      hidden.forEach((r, i) => {
        if (on) {
          r.style.display = 'block';
          setTimeout(() => r.classList.add('reveal', 'in'), i * 60);
        } else {
          r.style.display = 'none';
          r.classList.remove('reveal', 'in');
        }
      });
      btn.textContent = on ? 'Show Less Reviews' : 'See More Reviews';
    });
  }

  /* ══════════════════════════════════════════
     13. RULES MODAL
  ══════════════════════════════════════════ */
  function initRules() {
    const openBtn = $('#openRules');
    const bk      = $('#rulesBk');
    const modal   = $('#rulesModal');
    const closeB  = $('#rulesClose');
    const chk     = $('#rmChk');
    const cont    = $('#rmContinue');
    if (!modal || !bk) return;

    const reset = () => {
      if (chk)  chk.checked = false;
      if (cont) cont.disabled = true;
    };

    openBtn && openBtn.addEventListener('click', ()  => openModal(bk, modal));
    closeB  && closeB.addEventListener ('click', ()  => { closeModal(bk, modal); reset(); });
    bk.addEventListener('click', ()                  => { closeModal(bk, modal); reset(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('on')) { closeModal(bk, modal); reset(); }
    });
    chk  && cont && chk.addEventListener('change', () => { cont.disabled = !chk.checked; });
    cont && cont.addEventListener('click', () => {
      if (!cont.disabled) { closeModal(bk, modal); reset(); }
    });
  }

  /* ══════════════════════════════════════════
     14. WHY SWEAT MODAL — fires after 3 minutes
  ══════════════════════════════════════════ */
  function initSweatModal() {
    const bk     = $('#swBk');
    const modal  = $('#swModal');
    const closeB = $('#swClose');
    const skip   = $('#swSkip');
    const join   = $('#swJoin');
    if (!modal || !bk) return;

    const open  = () => openModal(bk, modal);
    const close = () => closeModal(bk, modal);

    setTimeout(open, 180000); // 3 minutes

    closeB && closeB.addEventListener('click', close);
    skip   && skip.addEventListener  ('click', close);
    join   && join.addEventListener  ('click', close);
    bk.addEventListener('click', close);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('on')) close();
    });
  }

  /* ══════════════════════════════════════════
     INIT
  ══════════════════════════════════════════ */
  function init() {
    initSlider();
    initVideos();
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