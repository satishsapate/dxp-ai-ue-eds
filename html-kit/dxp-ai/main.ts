/**
 * DXP AI — Site Entry Point
 * Webpack entry for dxp-ai site. Imports all site-level SCSS and
 * initialises header behaviours (scroll detection + hamburger toggle).
 */
import './main.scss';

(function (): void {
  // Header: add .scrolled class on scroll
  const header = document.querySelector<HTMLElement>('.site-header[data-component="dxp-ai-header"]');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // Hamburger menu toggle
  const hamburger = document.getElementById('dxp-ai-hamburger');
  const mobileMenu = document.getElementById('dxp-ai-mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      const next = !isExpanded;
      hamburger.setAttribute('aria-expanded', String(next));
      hamburger.classList.toggle('open', next);
      mobileMenu.classList.toggle('open', next);
      mobileMenu.setAttribute('aria-hidden', String(!next));
    });
  }
}());
