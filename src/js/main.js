/**
 * jeiji.tech — Main Orchestration Script
 * - Lenis Smooth Scroll & Fixed Top Progress Bar
 * - Auto-Hiding Pill Navbar with directional scroll awareness
 * - Blur-to-Crisp Editorial Text Reveals
 * - Hero Halftone Dot-Matrix Canvas initialization
 * - 3-State Morphing Particle Canvas initialization
 * - Projects rendering, filtering, & minimal rows table
 * - Interactive Terminal & Accordions
 */

import Lenis from 'lenis';
import { HalftonePortrait } from './halftone.js';
import { MorphingParticleCanvas } from './particles.js';
import {
  siteConfig,
  stats,
  projects,
  skillsGrouped,
  education,
  terminalCommands,
} from '../data/portfolio.js';

// ============================================================
// 1. Lenis Smooth Scrolling & Progress Bar
// ============================================================
let lenisInstance = null;

function initSmoothScroll() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  const progressBar = document.getElementById('scroll-progress-bar');

  lenisInstance.on('scroll', ({ scroll, limit }) => {
    if (progressBar && limit > 0) {
      const progress = Math.min(1, Math.max(0, scroll / limit));
      progressBar.style.transform = `scaleX(${progress})`;
    }
  });

  function raf(time) {
    lenisInstance.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          lenisInstance.scrollTo(targetEl, { offset: -30, duration: 1.2 });
        }
      }
    });
  });
}

// ============================================================
// 2. Auto-Hiding Pill Navbar (Scroll Direction Aware)
// ============================================================
function initNavbar() {
  const navbar = document.getElementById('pill-navbar');
  const navLinks = document.querySelectorAll('.pill-navbar__link');
  const toggleBtn = document.getElementById('pill-navbar-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');
  const drawerClose = document.getElementById('mobile-drawer-close');

  let lastScrollY = window.scrollY;
  let isNavHidden = false;

  const onScroll = () => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;

    if (currentScrollY > 90) {
      if (delta > 6 && !isNavHidden) {
        // Scrolling DOWN -> Hide navbar
        navbar.classList.add('pill-navbar--hidden');
        isNavHidden = true;
      } else if (delta < -5 && isNavHidden) {
        // Scrolling UP -> Slide navbar back in immediately
        navbar.classList.remove('pill-navbar--hidden');
        isNavHidden = false;
      }
    } else {
      navbar.classList.remove('pill-navbar--hidden');
      isNavHidden = false;
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile Drawer Toggle
  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.add('mobile-nav-drawer--open');
      document.body.style.overflow = 'hidden';
      toggleBtn.setAttribute('aria-expanded', 'true');
    });

    const closeDrawer = () => {
      drawer.classList.remove('mobile-nav-drawer--open');
      document.body.style.overflow = '';
      toggleBtn.setAttribute('aria-expanded', 'false');
    };

    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);

    drawer.querySelectorAll('.mobile-nav-drawer__link').forEach((link) => {
      link.addEventListener('click', (e) => {
        closeDrawer();
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target && lenisInstance) {
            e.preventDefault();
            lenisInstance.scrollTo(target, { offset: -30 });
          }
        }
      });
    });
  }

  // Active section indicator
  const sections = document.querySelectorAll('section[id]');
  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            const matches = link.dataset.nav === id || link.getAttribute('href') === `#${id}`;
            link.classList.toggle('pill-navbar__link--active', matches);
          });
        }
      });
    },
    { threshold: 0.25, rootMargin: '-60px 0px -40% 0px' }
  );

  sections.forEach((sec) => activeObserver.observe(sec));
}

// ============================================================
// 3. Blur-to-Crisp Text Reveals
// ============================================================
function initBlurReveals() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const headings = document.querySelectorAll('.reveal-blur');

  if (prefersReducedMotion) {
    headings.forEach((h) => h.classList.add('reveal-blur--visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-blur--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  headings.forEach((h) => observer.observe(h));
}

// ============================================================
// 4. Hero Stats Strip
// ============================================================
function renderHeroStats() {
  const container = document.getElementById('hero-stats-container');
  if (!container) return;

  container.innerHTML = stats
    .map(
      (s) => `
    <div class="hero-stat-block">
      <div class="hero-stat-block__value">
        <span>${s.value}</span>
        <span class="hero-stat-block__operator">${s.operator}</span>
      </div>
      <div class="hero-stat-block__label">${s.label}</div>
      <div class="hero-stat-block__desc">${s.desc}</div>
    </div>
  `
    )
    .join('');
}

// ============================================================
// 5. Render Projects & Filter Logic
// ============================================================
function renderProjects(filter = 'all') {
  const grid = document.getElementById('projects-grid');
  const table = document.getElementById('project-rows-table');
  if (!grid) return;

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  // 2-Column Sharp-Cornered Project Cards
  grid.innerHTML = filtered
    .map(
      (p) => `
    <article class="project-card" data-category="${p.category}" id="card-${p.id}">
      <span class="corner-cross corner-cross--tl">+</span>
      <span class="corner-cross corner-cross--tr">+</span>
      <span class="corner-cross corner-cross--bl">+</span>
      <span class="corner-cross corner-cross--br">+</span>

      <div class="project-card__top">
        <span>[${p.code}] // ARTIFACT</span>
        <span class="project-card__metric-badge">■ ${p.metrics}</span>
      </div>

      <div>
        <h3 class="project-card__title">${p.title}</h3>
        <div class="project-card__subtitle">${p.italicSubtitle}</div>
        <p class="project-card__description">${p.description}</p>
      </div>

      <div>
        <div class="project-card__tags">
          ${p.technologies.map((t) => `<span class="tech-tag">${t}</span>`).join('')}
        </div>

        <div class="project-card__footer">
          <div class="project-card__status">
            <span class="project-card__status-dot"></span>
            <span>${p.status}</span>
          </div>
          <a href="${p.github || 'https://github.com/haseebjahangir26'}" target="_blank" rel="noopener noreferrer" class="project-card__link">
            <span>${p.linkText || 'Inspect Code'}</span>
            <span class="arrow-nudge">↗</span>
          </a>
        </div>
      </div>
    </article>
  `
    )
    .join('');

  // Minimal Fast-Scan Rows Table
  if (table) {
    table.innerHTML = projects
      .map(
        (p) => `
      <div class="project-row" data-category="${p.category}">
        <span class="project-row__code">[${p.code}]</span>
        <span class="project-row__title">${p.title}</span>
        <span class="project-row__meta">${p.technologies.slice(0, 3).join(', ')}</span>
        <a href="${p.github || 'https://github.com/haseebjahangir26'}" target="_blank" rel="noopener noreferrer" class="project-row__action">
          <span>VIEW</span> <span class="arrow-nudge">↗</span>
        </a>
      </div>
    `
      )
      .join('');
  }
}

function initProjectFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      buttons.forEach((b) => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
      renderProjects(filter);
      updateSwipeDotsCount();
    });
  });
}

function updateSwipeDotsCount() {
  const grid = document.getElementById('projects-grid');
  const dotsContainer = document.querySelector('.mobile-swipe-hint__dots');
  if (!grid || !dotsContainer) return;
  const cards = grid.querySelectorAll('.project-card');
  dotsContainer.innerHTML = Array.from(cards)
    .map((_, i) => `<span class="swipe-dot ${i === 0 ? 'swipe-dot--active' : ''}"></span>`)
    .join('');
}

function initProjectSwipeListener() {
  const grid = document.getElementById('projects-grid');
  const dotsContainer = document.querySelector('.mobile-swipe-hint__dots');
  if (!grid || !dotsContainer) return;

  grid.addEventListener(
    'scroll',
    () => {
      const cards = grid.querySelectorAll('.project-card');
      if (!cards.length) return;
      const cardWidth = cards[0].offsetWidth + 16;
      const activeIndex = Math.min(cards.length - 1, Math.max(0, Math.round(grid.scrollLeft / cardWidth)));

      const dots = dotsContainer.querySelectorAll('.swipe-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('swipe-dot--active', idx === activeIndex);
      });
    },
    { passive: true }
  );
}

// ============================================================
// 6. Interactive Developer Terminal
// ============================================================
function initTerminal() {
  const el = document.getElementById('terminal-text');
  if (!el) return;

  let cmdIndex = 0;
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function typeLoop() {
    if (!isMotionActive) {
      el.textContent = terminalCommands[cmdIndex % terminalCommands.length];
      return;
    }

    const cmd = terminalCommands[cmdIndex % terminalCommands.length];
    el.textContent = '';

    // Typing
    for (let i = 0; i <= cmd.length; i++) {
      if (!isMotionActive) {
        el.textContent = cmd;
        return;
      }
      el.textContent = cmd.slice(0, i);
      await sleep(35 + Math.random() * 25);
    }
    await sleep(2600);

    // Backspacing
    for (let i = cmd.length; i >= 0; i--) {
      if (!isMotionActive) {
        el.textContent = cmd;
        return;
      }
      el.textContent = cmd.slice(0, i);
      await sleep(15);
    }
    await sleep(400);

    cmdIndex++;
    if (isMotionActive) {
      typeLoop();
    }
  }

  typeLoop();
  window.__resumeTerminal = typeLoop;
}

// ============================================================
// 7. Academic Foundation & Coursework + Skills Accordions
// ============================================================
function renderAcademicDetails() {
  const courseContainer = document.getElementById('course-list-container');
  const skillsContainer = document.getElementById('skills-chip-container');

  if (courseContainer) {
    courseContainer.innerHTML = education.coursework
      .map(
        (c) => `
      <li class="course-badge">
        <div class="course-badge__code">${c.code} // CORE CURRICULUM</div>
        <div class="course-badge__name">${c.name}</div>
        <div class="course-badge__desc">${c.desc}</div>
      </li>
    `
      )
      .join('');
  }

  if (skillsContainer) {
    skillsContainer.innerHTML = skillsGrouped
      .map((group) =>
        group.skills.map((skill) => `<span class="skill-chip">${skill}</span>`).join('')
      )
      .join('');
  }
}

function initAccordions() {
  const triggers = document.querySelectorAll('.accordion-trigger');
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      if (!item) return;

      const isOpen = item.classList.toggle('accordion-item--open');
      trigger.setAttribute('aria-expanded', String(isOpen));
    });
  });
}

// ============================================================
// 8. Transmission Email Copy Action
// ============================================================
function initEmailCopy() {
  const copyBtn = document.getElementById('email-copy-btn');
  const toast = document.getElementById('toast-feedback');
  if (!copyBtn || !toast) return;

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      toast.classList.add('toast-feedback--visible');
      setTimeout(() => {
        toast.classList.remove('toast-feedback--visible');
      }, 2500);
    } catch {
      window.location.href = `mailto:${siteConfig.email}`;
    }
  });
}

// ============================================================
// 9. Scroll to Top Button & Footer Year
// ============================================================
function initFooter() {
  const scrollTopBtn = document.getElementById('scroll-to-top');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      if (lenisInstance) {
        lenisInstance.scrollTo(0, { duration: 1.4 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ============================================================
// 10. Fixed Bottom-Right Motion Control Toggle
// ============================================================
let halftoneInstance = null;
let particlesInstance = null;
let isMotionActive = true;

function initMotionControl() {
  const btn = document.getElementById('motion-toggle-btn');
  const bullet = document.getElementById('motion-toggle-bullet');
  const text = document.getElementById('motion-toggle-text');
  if (!btn) return;

  const stored = localStorage.getItem('motion');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  isMotionActive = stored ? stored === 'on' : !prefersReduced;

  function updateMotionState(active) {
    if (active) {
      document.documentElement.removeAttribute('data-motion');
      btn.classList.remove('fixed-motion-toggle--off');
      btn.setAttribute('aria-pressed', 'true');
      if (bullet) {
        bullet.textContent = '■';
        bullet.style.color = 'var(--accent-orange)';
      }
      if (text) {
        text.textContent = 'MOTION ON';
        text.style.color = 'var(--text-primary)';
      }

      // Resume particle & canvas engines
      halftoneInstance?.resumeMotion?.();
      particlesInstance?.resumeMotion?.();
      window.__resumeTerminal?.();
    } else {
      document.documentElement.setAttribute('data-motion', 'off');
      btn.classList.add('fixed-motion-toggle--off');
      btn.setAttribute('aria-pressed', 'false');
      if (bullet) {
        bullet.textContent = '□';
        bullet.style.color = 'var(--text-mono)';
      }
      if (text) {
        text.textContent = 'MOTION OFF';
        text.style.color = 'var(--text-mono)';
      }

      // Freeze particle undulating movement while keeping full page scroll & swipe active
      halftoneInstance?.pauseMotion?.();
      particlesInstance?.pauseMotion?.();
    }
  }

  // Initial setup
  updateMotionState(isMotionActive);

  btn.addEventListener('click', () => {
    isMotionActive = !isMotionActive;
    localStorage.setItem('motion', isMotionActive ? 'on' : 'off');
    updateMotionState(isMotionActive);
  });
}

// ============================================================
// Main Execution
// ============================================================
function init() {
  initSmoothScroll();
  initNavbar();
  initBlurReveals();
  renderHeroStats();
  renderProjects();
  initProjectFilters();
  initProjectSwipeListener();
  initTerminal();
  renderAcademicDetails();
  initAccordions();
  initEmailCopy();
  initFooter();

  // Initialize Canvases
  try {
    halftoneInstance = new HalftonePortrait('halftone-canvas', '/hero-character.jpg');
  } catch (err) {
    console.error('Halftone initialization error:', err);
  }

  try {
    particlesInstance = new MorphingParticleCanvas('particle-canvas');
  } catch (err) {
    console.error('MorphingParticleCanvas initialization error:', err);
  }

  // Initialize Motion Control Toggle
  initMotionControl();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
