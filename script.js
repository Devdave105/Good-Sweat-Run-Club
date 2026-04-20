/* ================================================================
   GOOD SWEAT RUN CLUB UYO — script.js v5
   Fixed: videos load immediately with real src, clean play/pause
================================================================ */
(function () {
  'use strict';

  const WA   = '2349032188849';
  const $    = (s, c) => (c || document).querySelector(s);
  const $$   = (s, c) => [...(c || document).querySelectorAll(s)];
  const wa   = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  const lock = () => (document.body.style.overflow = 'hidden');
  const free = () => (document.body.style.overflow = '');

  function openModal (bk, m) { bk.classList.add('on'); m.classList.add('on'); lock(); }
  function closeModal(bk, m) { bk.classList.remove('on'); m.classList.remove('on'); free(); }

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
      { h: 'Run With Purpose.<br /><em>Grow With Community.</em>',
        s: 'Join 500+ runners in Uyo building discipline, health, and real connection — one Saturday at a time.' },
      { h: 'Every Step Forward<br /><em>Is a Victory.</em>',
        s: 'Beginners welcome. Advanced runners thrive. Good Sweat meets you where you are — and pushes you further.' },
      { h: 'Uyo Wakes at 6 AM.<br /><em>So Should You.</em>',
        s: 'Four locations. One community. Every Saturday we hit the streets and remind ourselves what we are made of.' }
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
      hero.addEventListener('touchend',   e => {
        const dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 44) { dx < 0 ? next() : goTo(cur - 1); resetTimer(); }
      });
    }
    startTimer();
  }

  /* ══════════════════════════════════════════
     2. VIDEOS  — unified, bulletproof system
     Each video has a play button overlay.
     Click → loads (if needed) → unmutes → plays.
     Click again → pauses. Only one unmuted at a time.
  ══════════════════════════════════════════ */
  function initVideos() {
    // Map of: { btn selector, video selector }
    const pairs = [
      { b: '.vbp', v: '.vid-break video'   },   // Video 1: cinematic break
      { b: '.vvp', v: '.vol-vid'           },   // Video 2: volunteer section
      { b: '.gvp', v: '.g-vid-item video'  },   // Video 3: gallery inline
      { b: '.vap', v: '.vid-accent video'  },   // Video 4: accent between sections
    ];

    pairs.forEach(({ b, v }) => {
      const btn = $(b);
      const vid = $(v);
      if (!btn || !vid) return;

      // Make sure the video is properly loaded
      // (src is already set in HTML, preload=metadata)
      // Attempt silent autoplay muted in background for ambient feel
      vid.muted = true;
      vid.play().catch(() => {
        // Autoplay blocked — video will play on user click instead
      });

      btn.addEventListener('click', () => {
        const isPlaying = !vid.paused && !vid.ended;

        if (isPlaying && !vid.muted) {
          // Already playing with sound — pause it
          vid.pause();
          showBtn(btn);
        } else if (isPlaying && vid.muted) {
          // Playing silently (ambient) — unmute it, show as "playing"
          pauseAllOthers(vid);
          vid.muted = false;
          hideBtn(btn);
        } else {
          // Paused — start playing with sound
          pauseAllOthers(vid);
          vid.muted = false;
          vid.play().then(() => {
            hideBtn(btn);
          }).catch(() => {
            // If play is blocked, try muted first
            vid.muted = true;
            vid.play().catch(() => {});
            hideBtn(btn);
          });
        }

        // When video ends or is paused externally — show button again
        vid.onpause = () => { showBtn(btn); };
        vid.onended = () => { showBtn(btn); vid.muted = true; };
      });
    });

    function pauseAllOthers(currentVid) {
      $$('video').forEach(v => {
        if (v !== currentVid) {
          v.pause();
          v.muted = true;
        }
      });
      // Reset all other buttons to visible
      $$('.vid-play-btn').forEach(b => showBtn(b));
    }

    function hideBtn(btn) {
      btn.style.opacity = '0';
      btn.style.pointerEvents = 'none';
      btn.style.transform = 'translate(-50%,-50%) scale(.8)';
    }

    function showBtn(btn) {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'all';
      btn.style.transform = 'translate(-50%,-50%) scale(1)';
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
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
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
    row.addEventListener('mouseenter', () => (row.style.animationPlayState = 'paused'));
    row.addEventListener('mouseleave', () => (row.style.animationPlayState = 'running'));
  }

  /* ══════════════════════════════════════════
     9. LOCATION CARDS — 3 shown, CTA shows 4th
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

    const open  = loc => {
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

    openBtn && openBtn.addEventListener('click', () => openModal(bk, modal));
    closeB  && closeB.addEventListener('click',  () => { closeModal(bk, modal); reset(); });
    bk.addEventListener('click', () => { closeModal(bk, modal); reset(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('on')) { closeModal(bk, modal); reset(); }
    });
    chk  && cont && chk.addEventListener('change', () => (cont.disabled = !chk.checked));
    cont && cont.addEventListener('click', () => {
      if (!cont.disabled) { closeModal(bk, modal); reset(); }
    });
  }

  /* ══════════════════════════════════════════
     14. WHY SWEAT MODAL — fires after 3 minutes
         (180,000 ms = 3 min)
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

    // 3 minutes after page load
    setTimeout(open, 180000);

    closeB && closeB.addEventListener('click', close);
    skip   && skip.addEventListener('click',   close);
    join   && join.addEventListener('click',   close);
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