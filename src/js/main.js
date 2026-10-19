/**
 * jeiji.tech — Main JavaScript
 * Handles: theme toggle, scroll effects, terminal animation,
 * project rendering & filtering, reveal animations, mobile nav
 */

import { projects, skills, terminalCommands } from '../data/portfolio.js';

// ============================================================
// Theme Toggle
// ============================================================
function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'dark'); // Default dark

  document.documentElement.setAttribute('data-theme', theme);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    toggle.setAttribute('aria-label', `Switch to ${next === 'dark' ? 'light' : 'dark'} mode`);
  });
}

// ============================================================
// Scroll Progress Bar
// ============================================================
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress-bar');
  if (!bar) return;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

// ============================================================
// Header Scroll Effect
// ============================================================
function initHeaderScroll() {
  const header = document.getElementById('header');
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 20) {
          header.classList.add('header--scrolled');
        } else {
          header.classList.remove('header--scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ============================================================
// Mobile Navigation
// ============================================================
function initMobileNav() {
  const hamburger = document.getElementById('nav-hamburger');
  const links = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('nav__hamburger--open');
    links.classList.toggle('nav__links--mobile-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  links.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('nav__hamburger--open');
      links.classList.remove('nav__links--mobile-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// ============================================================
// Terminal Typing Animation
// ============================================================
function initTerminal() {
  const el = document.getElementById('terminal-text');
  if (!el) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cmdIndex = 0;

  async function typeCommand() {
    const cmd = terminalCommands[cmdIndex % terminalCommands.length];
    el.textContent = '';

    if (prefersReducedMotion) {
      el.textContent = cmd;
      await sleep(3000);
    } else {
      // Type
      for (let i = 0; i <= cmd.length; i++) {
        el.textContent = cmd.slice(0, i);
        await sleep(40 + Math.random() * 30);
      }
      await sleep(2000);
      // Clear
      for (let i = cmd.length; i >= 0; i--) {
        el.textContent = cmd.slice(0, i);
        await sleep(20);
      }
      await sleep(500);
    }

    cmdIndex++;
    typeCommand();
  }

  typeCommand();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================
// Render Projects
// ============================================================
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = projects
    .map(
      (project) => `
    <article class="project-card reveal" data-category="${project.category}" id="project-${project.id}">
      <div class="project-card__header">
        <div class="project-card__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
          </svg>
        </div>
        <div class="project-card__links">
          ${
            project.github
              ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-card__link" aria-label="View ${project.title} on GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>`
              : ''
          }
          ${
            project.demo
              ? `<a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="project-card__link" aria-label="View ${project.title} live demo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
            </a>`
              : ''
          }
        </div>
      </div>
      <h3 class="project-card__title">${project.title}</h3>
      <p class="project-card__subtitle">${project.subtitle}</p>
      <p class="project-card__description">${project.description}</p>
      <div class="project-card__footer">
        ${project.technologies
          .slice(0, 4)
          .map((t) => `<span class="project-card__tech">${t}</span>`)
          .join('')}
        <span class="project-card__status project-card__status--${project.status}">
          ${project.status === 'completed' ? '✓ Completed' : '◉ In Progress'}
        </span>
      </div>
    </article>
  `
    )
    .join('');
}

// ============================================================
// Project Filtering
// ============================================================
function initProjectFilters() {
  const filters = document.querySelectorAll('.projects__filter');
  const cards = () => document.querySelectorAll('.project-card');

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active state
      filters.forEach((f) => f.classList.remove('projects__filter--active'));
      btn.classList.add('projects__filter--active');

      // Filter cards
      cards().forEach((card) => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('project-card--hidden');
        } else {
          card.classList.add('project-card--hidden');
        }
      });
    });
  });
}

// ============================================================
// Render Skills
// ============================================================
const skillIcons = {
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A5.5 5.5 0 004 7.5c0 1.33.47 2.55 1.26 3.5H4a3 3 0 00-1 5.83v.17a3 3 0 004.68 2.49A4.5 4.5 0 0012 22a4.5 4.5 0 004.32-2.51A3 3 0 0021 17v-.17A3 3 0 0020 11h-1.26A5.47 5.47 0 0020 7.5 5.5 5.5 0 0014.5 2h-5z"/></svg>',
  server: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',
  mobile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  tools: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>',
};

function renderSkills() {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;

  grid.innerHTML = skills
    .map(
      (skill) => `
    <div class="skill-card reveal">
      <div class="skill-card__header">
        <div class="skill-card__icon" aria-hidden="true">
          ${skillIcons[skill.icon] || skillIcons.code}
        </div>
        <h3 class="skill-card__title">${skill.category}</h3>
      </div>
      <div class="skill-card__items" role="list">
        ${skill.items.map((item) => `<span class="skill-card__item" role="listitem">${item}</span>`).join('')}
      </div>
    </div>
  `
    )
    .join('');
}

// ============================================================
// Reveal on Scroll (Intersection Observer)
// ============================================================
function initRevealAnimations() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elements = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    elements.forEach((el) => el.classList.add('reveal--visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

// ============================================================
// Active Nav Link
// ============================================================
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              'nav__link--active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 64}px 0px -40% 0px` }
  );

  sections.forEach((section) => observer.observe(section));
}

// ============================================================
// Footer Year
// ============================================================
function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

// ============================================================
// Smooth Scroll for anchor links
// ============================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ============================================================
// Initialize Everything
// ============================================================
function init() {
  initTheme();
  renderProjects();
  renderSkills();
  initScrollProgress();
  initHeaderScroll();
  initMobileNav();
  initTerminal();
  initProjectFilters();
  setFooterYear();
  initSmoothScroll();

  // Delay reveal init so dynamically rendered elements are in the DOM
  requestAnimationFrame(() => {
    initRevealAnimations();
    initActiveNavLink();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
