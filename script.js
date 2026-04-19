/* ========================================================
   GOOD SWEAT RUN CLUB UYO — script.js  v2
   Modules: SweatModal | Navbar | Hamburger | SmoothScroll |
            ScrollReveal | BackToTop | Ticker | Videos |
            LocationForm | MembershipForm | Reviews |
            RulesModal | LocationExpand
======================================================== */
(function () {
  'use strict';

  const WA = '2349032188849';

  /* ─── UTILS ─── */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];
  const waUrl = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

  function lockScroll() { document.body.style.overflow = 'hidden'; }
  function unlockScroll() { document.body.style.overflow = ''; }

  /* ─── 1. WHY SWEAT MODAL ─── */
  function initSweatModal() {
    const modal    = $('#sweatModal');
    const backdrop = $('#sweatBackdrop');
    const closeBtn = $('#sweatClose');
    const skipBtn  = $('#sweatSkip');
    const joinBtn  = $('#sweatJoinBtn');
    if (!modal) return;

    function open() {
      modal.classList.add('open');
      backdrop.classList.add('open');
      lockScroll();
    }
    function close() {
      modal.classList.remove('open');
      backdrop.classList.remove('open');
      unlockScroll();
    }

    // Delay open so hero loads first
    setTimeout(open, 1200);

    closeBtn && closeBtn.addEventListener('click', close);
    skipBtn  && skipBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);
    joinBtn  && joinBtn.addEventListener('click', close); // will navigate via href

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('open')) close();
    });
  }

  /* ─── 2. NAVBAR SCROLL ─── */
  function initNavbar() {
    const nav = $('#navbar');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 56);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─── 3. HAMBURGER / MOBILE MENU ─── */
  function initHamburger() {
    const btn  = $('#hamburger');
    const menu = $('#mobileMenu');
    const links = $$('.mobile-link');
    const joinMobile = $('.mobile-join-btn');
    if (!btn || !menu) return;

    let isOpen = false;

    function open() {
      isOpen = true;
      btn.classList.add('active');
      menu.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Close menu');
      lockScroll();
    }

    function close() {
      isOpen = false;
      btn.classList.remove('active');
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open menu');
      unlockScroll();
    }

    btn.addEventListener('click', () => isOpen ? close() : open());

    // Close on any nav link click
    [...links, joinMobile].forEach(el => el && el.addEventListener('click', close));

    // Outside click
    document.addEventListener('click', e => {
      if (isOpen && !menu.contains(e.target) && !btn.contains(e.target)) close();
    });

    // Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) { close(); btn.focus(); }
    });
  }

  /* ─── 4. SMOOTH SCROLL ─── */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href === '#') return;
        const target = $(href);
        if (!target) return;
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
      });
    });
  }

  /* ─── 5. SCROLL REVEAL ─── */
  function initScrollReveal() {
    const els = $$('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    els.forEach(el => io.observe(el));
  }

  /* ─── 6. BACK TO TOP ─── */
  function initBackToTop() {
    const btn = $('#backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ─── 7. TICKER PAUSE ON HOVER ─── */
  function initTicker() {
    const inner = $('.ticker-inner');
    if (!inner) return;
    inner.addEventListener('mouseenter', () => inner.style.animationPlayState = 'paused');
    inner.addEventListener('mouseleave', () => inner.style.animationPlayState = 'running');
  }

  /* ─── 8. VIDEO GRID — click to play/unmute ─── */
  function initVideos() {
    $$('.video-item').forEach(item => {
      const vid = item.querySelector('video');
      const cover = item.querySelector('.video-cover');
      if (!vid || !cover) return;

      item.addEventListener('click', () => {
        const playing = item.classList.contains('playing');

        if (playing) {
          vid.pause(); vid.muted = true;
          item.classList.remove('playing');
          cover.style.opacity = '1'; cover.style.pointerEvents = 'all';
        } else {
          // Pause all others
          $$('.video-item.playing').forEach(other => {
            const ov = other.querySelector('video');
            const oc = other.querySelector('.video-cover');
            if (ov) { ov.pause(); ov.muted = true; }
            if (oc) { oc.style.opacity = '1'; oc.style.pointerEvents = 'all'; }
            other.classList.remove('playing');
          });
          vid.muted = false;
          vid.play().catch(() => {});
          item.classList.add('playing');
          cover.style.opacity = '0'; cover.style.pointerEvents = 'none';
        }
      });

      vid.addEventListener('ended', () => {
        item.classList.remove('playing');
        vid.muted = true;
        cover.style.opacity = '1'; cover.style.pointerEvents = 'all';
      });
    });
  }

  /* ─── 9. LOCATION CARDS — show 3, CTA reveals 4th ─── */
  function initLocationExpand() {
    const btn = $('#seeAllLocationsBtn');
    const hidden = $$('.hidden-card');
    if (!btn || !hidden.length) return;

    let expanded = false;
    btn.addEventListener('click', () => {
      expanded = !expanded;
      hidden.forEach(card => {
        if (expanded) {
          card.style.display = 'block';
          requestAnimationFrame(() => card.classList.add('visible'));
        } else {
          card.style.display = 'none';
          card.classList.remove('visible');
        }
      });
      btn.textContent = expanded ? 'Show Less' : 'View All Locations';
    });
  }

  /* ─── 10. LOCATION FORM OVERLAY ─── */
  function initLocationForm() {
    const overlay = $('#locOverlay');
    const closeBtn = $('#locClose');
    const nameSpan = $('#formLocName');
    const hiddenInput = $('#locHidden');
    const form = $('#locationForm');
    if (!overlay) return;

    function openForm(locationName) {
      if (nameSpan) nameSpan.textContent = locationName;
      if (hiddenInput) hiddenInput.value = locationName;
      overlay.classList.add('open');
      lockScroll();
    }
    function closeForm() {
      overlay.classList.remove('open');
      unlockScroll();
    }

    // Card buttons
    $$('.card-btn').forEach(btn => {
      btn.addEventListener('click', () => openForm(btn.dataset.location || 'a Location'));
    });

    closeBtn && closeBtn.addEventListener('click', closeForm);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeForm(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeForm();
    });

    form && form.addEventListener('submit', e => {
      e.preventDefault();
      const name     = $('#locName')?.value.trim();
      const phone    = $('#locPhone')?.value.trim();
      const location = hiddenInput?.value;
      if (!name || !phone) { alert('Please fill in all fields.'); return; }
      const msg = `Hello Good Sweat Run Club Uyo,\n\nI'd like to join the *${location}* location.\n\nName: ${name}\nPhone: ${phone}\n\nPlease add me to the group. Thank you!`;
      window.open(waUrl(msg), '_blank');
      form.reset();
      closeForm();
    });
  }

  /* ─── 11. MEMBERSHIP FORM ─── */
  function initMembershipForm() {
    const form = $('#membershipForm');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name     = $('#memName')?.value.trim();
      const phone    = $('#memPhone')?.value.trim();
      const level    = $('#memLevel')?.value;
      const location = $('#memLocation')?.value;
      if (!name || !phone || !level || !location) { alert('Please fill in all fields.'); return; }
      const msg = `Hello Good Sweat Run Club Uyo,\n\nI'd like to become a member.\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Level:* ${level}\n*Location:* ${location}\n\nPlease reach out to onboard me. Thank you!`;
      window.open(waUrl(msg), '_blank');
      form.reset();
    });
  }

  /* ─── 12. REVIEWS — 3 visible, CTA shows 5 more ─── */
  function initReviews() {
    const btn = $('#seeMoreBtn');
    const hidden = $$('.hidden-review');
    if (!btn || !hidden.length) return;

    let expanded = false;
    btn.addEventListener('click', () => {
      expanded = !expanded;
      hidden.forEach((card, i) => {
        if (expanded) {
          card.style.display = 'block';
          requestAnimationFrame(() => {
            card.classList.add('reveal');
            setTimeout(() => card.classList.add('visible'), i * 80);
          });
        } else {
          card.style.display = 'none';
          card.classList.remove('visible');
        }
      });
      btn.textContent = expanded ? 'Show Less Reviews' : 'See More Reviews';
    });
  }

  /* ─── 13. RULES MODAL ─── */
  function initRulesModal() {
    const openBtn    = $('#openRulesBtn');
    const modal      = $('#rulesModal');
    const closeBtn   = $('#closeModal');
    const agreeCheck = $('#agreeCheck');
    const continueBtn= $('#continueBtn');
    if (!modal) return;

    function open() { modal.classList.add('open'); lockScroll(); }
    function close() {
      modal.classList.remove('open'); unlockScroll();
      if (agreeCheck) agreeCheck.checked = false;
      if (continueBtn) continueBtn.disabled = true;
    }

    openBtn  && openBtn.addEventListener('click', open);
    closeBtn && closeBtn.addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('open')) close();
    });

    agreeCheck && continueBtn && agreeCheck.addEventListener('change', () => {
      continueBtn.disabled = !agreeCheck.checked;
    });
    continueBtn && continueBtn.addEventListener('click', () => {
      if (!continueBtn.disabled) close();
    });
  }

  /* ─── 14. HERO VIDEO AUTOPLAY (iOS fix) ─── */
  function initHeroVideo() {
    const vid = $('.hero-video');
    vid && vid.play().catch(() => {});
  }

  /* ─── INIT ─── */
  function init() {
    initSweatModal();
    initNavbar();
    initHamburger();
    initSmoothScroll();
    initScrollReveal();
    initBackToTop();
    initTicker();
    initVideos();
    initLocationExpand();
    initLocationForm();
    initMembershipForm();
    initReviews();
    initRulesModal();
    initHeroVideo();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();

})();