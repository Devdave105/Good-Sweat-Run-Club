/* =============================================
   GOOD SWEAT — SCRIPT.JS
   All interactivity: AOS, Swiper, Countdown,
   Counters, FAQ, Lightbox, Modal, Popup, etc.
============================================= */

'use strict';

/* ===== AOS INIT ===== */
document.addEventListener('DOMContentLoaded', function () {

  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60
  });

  /* ===== FOOTER YEAR ===== */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== STICKY NAVBAR ===== */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', function () {
    const current = window.scrollY;
    if (current > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = current;
  }, { passive: true });

  /* ===== HAMBURGER MENU ===== */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  function closeNav() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.contains('active');
    if (isOpen) {
      closeNav();
    } else {
      hamburger.classList.add('active');
      navLinks.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  });

  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (navLinks.classList.contains('active') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      closeNav();
    }
  });

  /* ===== SMOOTH SCROLL ===== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ===== HERO SWIPER ===== */
  const heroSwiper = new Swiper('.hero-swiper', {
    loop: true,
    speed: 900,
    autoplay: {
      delay: 5500,
      disableOnInteraction: false,
    },
    parallax: true,
    pagination: {
      el: '.hero-pagination',
      clickable: true,
    },
    effect: 'fade',
    fadeEffect: { crossFade: true },
    keyboard: { enabled: true },
    a11y: {
      prevSlideMessage: 'Previous slide',
      nextSlideMessage: 'Next slide',
    },
  });

  /* ===== TESTIMONIAL SWIPER ===== */
  const testimonialSwiper = new Swiper('.testimonial-swiper', {
    loop: true,
    speed: 700,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
    },
    slidesPerView: 1,
    spaceBetween: 24,
    pagination: {
      el: '.testimonial-pagination',
      clickable: true,
    },
    navigation: {
      prevEl: '.testimonial-prev',
      nextEl: '.testimonial-next',
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 2 },
    },
    a11y: true,
  });

  /* ===== COUNTDOWN TIMER ===== */
  function getNextLastSaturday() {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth() + 1, 0); // last day of current month
    // Get last Saturday of current month
    while (target.getDay() !== 6) target.setDate(target.getDate() - 1);
    target.setHours(5, 30, 0, 0);
    // If past, go to next month
    if (target <= now) {
      target.setMonth(target.getMonth() + 1);
      target.setDate(1);
      const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0);
      while (lastDay.getDay() !== 6) lastDay.setDate(lastDay.getDate() - 1);
      lastDay.setHours(5, 30, 0, 0);
      return lastDay;
    }
    return target;
  }

  const cdDays  = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins  = document.getElementById('cd-mins');
  const cdSecs  = document.getElementById('cd-secs');

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    const now   = new Date().getTime();
    const event = getNextLastSaturday().getTime();
    const diff  = event - now;

    if (diff <= 0) {
      cdDays.textContent = cdHours.textContent = cdMins.textContent = cdSecs.textContent = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    cdDays.textContent  = pad(d);
    cdHours.textContent = pad(h);
    cdMins.textContent  = pad(m);
    cdSecs.textContent  = pad(s);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ===== ANIMATED COUNTERS ===== */
  function animateCounter(el, loop) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2200;
    const steps    = Math.round(duration / 16);
    let current    = 0;
    let step       = 0;

    function tick() {
      step++;
      // Ease-out curve
      const progress = 1 - Math.pow(1 - step / steps, 3);
      current = Math.floor(progress * target);
      el.textContent = current;

      if (step < steps) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
        // If loop flag, restart after a short pause
        if (loop) {
          setTimeout(function () {
            step = 0; current = 0;
            el.textContent = 0;
            requestAnimationFrame(tick);
          }, 1200);
        }
      }
    }

    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll('.counter');
  let countersStarted = false;

  function checkCounters() {
    if (countersStarted) return;
    const heroBottom = document.querySelector('.hero-bottom');
    if (!heroBottom) return;
    const rect = heroBottom.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      countersStarted = true;
      counters.forEach(function(c) {
        // Only the 500 runners counter loops continuously
        const shouldLoop = parseInt(c.getAttribute('data-target'), 10) === 500;
        animateCounter(c, shouldLoop);
      });
      window.removeEventListener('scroll', checkCounters);
    }
  }

  window.addEventListener('scroll', checkCounters, { passive: true });
  setTimeout(checkCounters, 800);

  /* ===== FAQ ACCORDION ===== */
  const faqItems   = document.querySelectorAll('.faq-item:not(.faq-hidden)');
  const faqToggle  = document.getElementById('faq-toggle');
  const hiddenFaqs = document.querySelectorAll('.faq-item.faq-hidden');
  let faqOpen = false;

  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  if (faqToggle) {
    faqToggle.addEventListener('click', function () {
      faqOpen = !faqOpen;
      hiddenFaqs.forEach(item => {
        item.style.display = faqOpen ? 'block' : 'none';
      });
      this.classList.toggle('open', faqOpen);
      this.innerHTML = faqOpen
        ? 'Show Less <i class="fa-solid fa-chevron-down"></i>'
        : 'Show More Questions <i class="fa-solid fa-chevron-down"></i>';
    });
  }

  /* ===== LOCATIONS SHOW MORE ===== */
  const locShowBtn  = document.getElementById('loc-show-btn');
  const locBtnText  = document.getElementById('loc-btn-text');
  const locBtnIcon  = document.getElementById('loc-btn-icon');
  const hiddenCards = document.querySelectorAll('.loc-hidden');
  let locsVisible   = false;

  if (locShowBtn) {
    locShowBtn.addEventListener('click', function () {
      locsVisible = !locsVisible;

      hiddenCards.forEach(function (card, i) {
        if (locsVisible) {
          card.style.display = 'block';
          // Trigger AOS re-init on newly visible cards
          setTimeout(function () {
            card.classList.add('aos-animate');
          }, i * 80);
        } else {
          card.style.display = 'none';
          card.classList.remove('aos-animate');
        }
      });

      this.classList.toggle('open', locsVisible);
      locBtnText.textContent = locsVisible ? 'Show Less Locations' : 'View All 8 Locations';
    });
  }

  /* ===== BACK TO TOP ===== */
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function () {
      const src = this.getAttribute('data-img');
      lightboxImg.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  /* ===== JOIN MODAL ===== */
  const joinModal    = document.getElementById('join-modal');
  const modalClose   = document.getElementById('modal-close');
  const step1        = document.getElementById('modal-step-1');
  const step2        = document.getElementById('modal-step-2');
  const step3        = document.getElementById('modal-step-3');
  const formNextBtn  = document.getElementById('form-next-btn');
  const submitJoinBtn = document.getElementById('submit-join-btn');
  const agreeCheck   = document.getElementById('agree-check');

  function openModal() {
    joinModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Reset to step 1
    step1.classList.remove('hidden');
    step2.classList.add('hidden');
    step3.classList.add('hidden');
  }

  function closeModal() {
    joinModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // All join triggers
  document.querySelectorAll('.open-join-modal, #open-join-modal').forEach(el => {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  });

  modalClose.addEventListener('click', closeModal);
  joinModal.addEventListener('click', function (e) {
    if (e.target === joinModal) closeModal();
  });

  // Step 1 → Step 2
  if (formNextBtn) {
    formNextBtn.addEventListener('click', function () {
      const name     = document.getElementById('join-name').value.trim();
      const location = document.getElementById('join-location').value;
      const phone    = document.getElementById('join-phone').value.trim();
      const source   = document.getElementById('join-source').value;

      if (!name || !location || !phone || !source) {
        showFieldError('Please fill in all fields before continuing.');
        return;
      }

      if (!/^[0-9+\s()-]{7,15}$/.test(phone)) {
        showFieldError('Please enter a valid phone number.');
        return;
      }

      step1.classList.add('hidden');
      step2.classList.remove('hidden');
    });
  }

  // Step 2 → Step 3 + WhatsApp redirect
  if (submitJoinBtn) {
    submitJoinBtn.addEventListener('click', function () {
      if (!agreeCheck.checked) {
        showFieldError('Please agree to the community guidelines to continue.');
        return;
      }

      const name     = document.getElementById('join-name').value.trim();
      const location = document.getElementById('join-location').value;
      const phone    = document.getElementById('join-phone').value.trim();
      const source   = document.getElementById('join-source').value;

      step2.classList.add('hidden');
      step3.classList.remove('hidden');

      const msg = encodeURIComponent(
        `Hi! I just joined Good Sweat.\n\nName: ${name}\nLocation: ${location}\nPhone: ${phone}\nHow I heard: ${source}\n\nExcited to be part of the community!`
      );

      setTimeout(function () {
        window.open(`https://wa.me/2349032188849?text=${msg}`, '_blank', 'noopener,noreferrer');
      }, 2200);
    });
  }

  function showFieldError(msg) {
    let err = document.querySelector('.field-error-msg');
    if (err) err.remove();
    err = document.createElement('p');
    err.className = 'field-error-msg';
    err.style.cssText = 'color:#ff4d4d;font-size:0.85rem;margin-top:-8px;margin-bottom:12px;font-family:Poppins,sans-serif;';
    err.textContent = msg;
    const box = document.querySelector('.modal-step:not(.hidden)');
    if (box) box.insertBefore(err, box.querySelector('button.btn'));
    setTimeout(() => { if (err.parentNode) err.remove(); }, 3500);
  }

  /* ===== EXTERNAL LINKS — REPLACE THESE WITH YOUR REAL URLS ===== */
  // ---------------------------------------------------------------
  // STEP 1: Replace REGISTER_URL with your Next Run registration link
  // STEP 2: Replace VOLUNTEER_URL with your volunteer sign-up link
  // The actual URLs are never visible in the page source — only triggered on button click
  // ---------------------------------------------------------------
  const REGISTER_URL  = 'https://event.getbookt.io/good-sweat-run-club-uyo-2168?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAdGRleARRh15leHRuA2FlbQIxMQBzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAaeFJWrCM4-8Z0fpve7YvMcEuZmsR_RovGV7GszYsepezTHYLQYhzdvdvKJ_jg_aem_5TB49Ka0EJDdUYdUeHBesg';  // e.g. https://forms.gle/xxxxx
  const VOLUNTEER_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfbjQI-0tpWXdX1_9E77yKEJXG0-IgodTBLxLtu7K_LyGjUSg/viewform?fbclid=PAdGRleARRiAlleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAaciAmUalF1B6H7-nqxX16EP7KtD-hzjCQW8WXnjuiPWIMkQ6g8oD35CTcZLyA_aem_GMecoNHP5Nd9EoVMRguvmw';        // e.g. https://forms.gle/yyyyy

  document.querySelectorAll('.register-btn').forEach(function(btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (REGISTER_URL && !REGISTER_URL.startsWith('YOUR_')) {
        window.open(REGISTER_URL, '_blank', 'noopener,noreferrer');
      }
    });
  });

  document.querySelectorAll('.volunteer-btn').forEach(function(btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (VOLUNTEER_URL && !VOLUNTEER_URL.startsWith('YOUR_')) {
        window.open(VOLUNTEER_URL, '_blank', 'noopener,noreferrer');
      }
    });
  });

  /* ===== POPUP BANNER ===== */
  const popupBanner = document.getElementById('popup-banner');
  const popupClose  = document.getElementById('popup-close');
  const POPUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

  function showPopup() {
    // Don't interrupt if user is reading above fold
    popupBanner.classList.add('visible');
    playNotificationSound();

    setTimeout(function () {
      popupBanner.classList.remove('visible');
    }, 8000);
  }

  function playNotificationSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // AudioContext may not be available — silent fail
    }
  }

  popupClose.addEventListener('click', function () {
    popupBanner.classList.remove('visible');
  });

  // Show after 3s on first load, then every 5 mins
  setTimeout(showPopup, 3000);
  setInterval(showPopup, POPUP_INTERVAL);

  /* ===== BUTTON RIPPLE EFFECT ===== */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* ===== ESCAPE KEY HANDLERS ===== */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal();
      closeLightbox();
      closeNav();
      popupBanner.classList.remove('visible');
    }
  });

  /* ===== LAZY LOADING FALLBACK ===== */
  if ('IntersectionObserver' in window) {
    const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    const imgObserver = new IntersectionObserver(function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            imgObserver.unobserve(img);
          }
        }
      });
    }, { rootMargin: '200px 0px' });
    lazyImgs.forEach(img => imgObserver.observe(img));
  }

  /* ===== VIDEO POSTER LOAD ===== */
  document.querySelectorAll('video').forEach(video => {
    video.addEventListener('play', function () {
      heroSwiper.autoplay.stop();
    });
    video.addEventListener('pause', function () {
      heroSwiper.autoplay.start();
    });
  });

  /* ===== BUILDING CARDS — always visible, GSAP only enhances ===== */
  document.querySelectorAll('.building-card').forEach(function(card) {
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
    card.style.visibility = 'visible';
  });

  /* ===== GSAP ENHANCED ANIMATIONS (if loaded) ===== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Building cards — animate only if below viewport on page load
    var buildingGrid = document.querySelector('.building-grid');
    if (buildingGrid) {
      var gridRect = buildingGrid.getBoundingClientRect();
      if (gridRect.top > window.innerHeight) {
        var buildingCards = gsap.utils.toArray('.building-card');
        gsap.set(buildingCards, { opacity: 0, y: 48 });
        ScrollTrigger.create({
          trigger: buildingGrid,
          start: 'top 88%',
          onEnter: function() {
            gsap.to(buildingCards, {
              opacity: 1, y: 0,
              duration: 0.65, stagger: 0.13,
              ease: 'power2.out',
              clearProps: 'all'
            });
          },
          once: true
        });
      }
    }

    // Brand message — safe scroll-check before hiding
    var bmMain = document.querySelector('.bm-main');
    if (bmMain && bmMain.getBoundingClientRect().top > window.innerHeight) {
      gsap.set('.bm-main', { opacity: 0, y: 60 });
      ScrollTrigger.create({
        trigger: '.brand-message-section',
        start: 'top 83%',
        onEnter: function() {
          gsap.to('.bm-main', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', clearProps: 'all' });
        },
        once: true
      });
    }

    // Green lines
    var bmLines = document.querySelectorAll('.bm-line');
    if (bmLines.length && bmLines[0].getBoundingClientRect().top > window.innerHeight) {
      gsap.set('.bm-line', { scaleX: 0, transformOrigin: 'center' });
      ScrollTrigger.create({
        trigger: '.brand-message-section',
        start: 'top 80%',
        onEnter: function() {
          gsap.to('.bm-line', { scaleX: 1, duration: 0.6, stagger: 0.2, ease: 'power2.inOut', clearProps: 'all' });
        },
        once: true
      });
    }

    // Hero entrance — fromTo always resolves to final visible state
    gsap.fromTo('.hero-title',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: 'power3.out', clearProps: 'all' }
    );
    gsap.fromTo('.hero-sub',
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, delay: 0.5, ease: 'power3.out', clearProps: 'all' }
    );
    gsap.fromTo('.hero-btns',
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.72, ease: 'power2.out', clearProps: 'all' }
    );
  }

  console.log('%cGood Sweat — Built with purpose. Run with pride.', 'color:#00C853;font-size:14px;font-weight:bold;font-family:Poppins,sans-serif;');
});