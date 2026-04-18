/* =============================================
   GOOD SWEAT RUN CLUB — SCRIPT.JS
   ============================================= */

'use strict';

// =============================================
// NAVBAR — Scroll + Mobile Toggle
// =============================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navBackdrop = document.getElementById('navBackdrop');
const navLinkItems = document.querySelectorAll('.nav-links .nav-link');

// Sticky nav on scroll
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Open/close helpers
function openNav() {
  navToggle.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  navLinks.classList.add('open');
  navBackdrop.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navLinks.classList.remove('open');
  navBackdrop.classList.remove('show');
  document.body.style.overflow = '';
}

// Toggle on button click
navToggle.addEventListener('click', () => {
  navLinks.classList.contains('open') ? closeNav() : openNav();
});

// Close when a link is tapped
navLinkItems.forEach(link => link.addEventListener('click', closeNav));

// Close on backdrop click
navBackdrop.addEventListener('click', closeNav);

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) closeNav();
});


// =============================================
// SCROLL REVEAL — IntersectionObserver
// =============================================
const revealElements = document.querySelectorAll(
  '.reveal-up, .reveal-left, .reveal-right, .reveal-scale'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));


// =============================================
// HERO REVEAL — on load
// =============================================
window.addEventListener('load', () => {
  const heroReveal = document.querySelectorAll('.hero .reveal-up');
  // Trigger hero reveals without intersection (already in view)
  setTimeout(() => {
    heroReveal.forEach(el => el.classList.add('in-view'));
  }, 200);
});


// =============================================
// COUNTER ANIMATION
// =============================================
const counters = document.querySelectorAll('.stat-num[data-target]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();

  const step = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };

  requestAnimationFrame(step);
}


// =============================================
// PARALLAX — Mission background
// =============================================
const missionBg = document.querySelector('.mission-bg-parallax');

if (missionBg) {
  const parallaxHandler = () => {
    const section = missionBg.parentElement;
    const rect = section.getBoundingClientRect();
    const viewH = window.innerHeight;

    if (rect.top < viewH && rect.bottom > 0) {
      // -0.3 to 0.3 range mapped to translate
      const progress = (viewH - rect.top) / (viewH + rect.height);
      const translate = (progress - 0.5) * 80;
      missionBg.style.transform = `translateY(${translate}px)`;
    }
  };

  window.addEventListener('scroll', parallaxHandler, { passive: true });
  parallaxHandler();
}


// =============================================
// CONTACT FORM — Submission Handler
// =============================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    // Simulate async submission
    setTimeout(() => {
      // Replace form with success message
      contactForm.innerHTML = `
        <div class="form-success show">
          <div class="form-success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h4>You're In!</h4>
          <p>Welcome to Good Sweat Run Club. We'll be in touch soon. Get those running shoes ready.</p>
        </div>
      `;
    }, 1400);
  });
}


// =============================================
// SMOOTH ACTIVE NAV LINK — on scroll
// =============================================
const sections = document.querySelectorAll('section[id]');

const activeNavObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => activeNavObserver.observe(section));


// =============================================
// GALLERY — Lightbox (basic)
// =============================================
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const src = img?.src;
    const caption = item.querySelector('.gallery-overlay span')?.textContent;

    if (!src) return;

    // Create lightbox
    const lb = document.createElement('div');
    lb.style.cssText = `
      position:fixed; inset:0; z-index:9999;
      background:rgba(0,0,0,0.92);
      display:flex; flex-direction:column;
      align-items:center; justify-content:center;
      cursor:pointer; padding:2rem;
      animation: lbFadeIn 0.3s ease;
    `;

    const lbImg = document.createElement('img');
    lbImg.src = src;
    lbImg.style.cssText = `
      max-width:90vw; max-height:80vh;
      object-fit:contain; border-radius:8px;
      box-shadow:0 40px 120px rgba(0,0,0,0.8);
    `;

    const lbCap = document.createElement('p');
    lbCap.textContent = caption || '';
    lbCap.style.cssText = `
      font-family: 'Montserrat', sans-serif;
      font-size:0.7rem; font-weight:700;
      letter-spacing:0.2em; text-transform:uppercase;
      color:#D4AF37; margin-top:1.5rem;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
      position:absolute; top:1.5rem; right:2rem;
      background:none; border:none; color:#fff;
      font-size:2.5rem; cursor:pointer; line-height:1;
      font-family: 'Montserrat', sans-serif;
    `;

    lb.appendChild(lbImg);
    lb.appendChild(lbCap);
    lb.appendChild(closeBtn);
    document.body.appendChild(lb);
    document.body.style.overflow = 'hidden';

    const close = () => {
      document.body.removeChild(lb);
      document.body.style.overflow = '';
    };

    lb.addEventListener('click', close);
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); }, { once: true });
  });
});

// Inject lightbox keyframe CSS
const lbStyle = document.createElement('style');
lbStyle.textContent = `
  @keyframes lbFadeIn { from { opacity:0 } to { opacity:1 } }
  .nav-link.active { color: #D4AF37 !important; }
`;
document.head.appendChild(lbStyle);