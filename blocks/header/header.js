/**
 * loads and decorates the header — DXP AI design
 * Renders the header HTML directly to match the html-kit design exactly.
 * @param {Element} block The header block element
 */

const isDesktop = window.matchMedia('(min-width: 900px)');

function closeAllDropdowns(nav) {
  nav.querySelectorAll('.nav-item.open').forEach((item) => {
    item.classList.remove('open');
    item.querySelector('a')?.setAttribute('aria-expanded', 'false');
  });
}

function toggleMobileMenu(nav) {
  const menu = nav.querySelector('.nav-mobile-menu');
  const hamburger = nav.querySelector('.nav-hamburger');
  const isOpen = menu.classList.contains('open');
  menu.classList.toggle('open', !isOpen);
  hamburger.classList.toggle('open', !isOpen);
  hamburger.setAttribute('aria-expanded', String(!isOpen));
  hamburger.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  document.body.style.overflowY = isOpen ? '' : 'hidden';
}

export default async function decorate(block) {
  block.textContent = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';

  wrapper.innerHTML = `
    <div class="nav-inner">
      <!-- Logo -->
      <a href="/" class="nav-logo" aria-label="DXP AI – home">
        <div class="nav-logo-text">
          <span class="nav-logo-brand">DXP AI</span>
          <span class="nav-logo-sub">Powered by ZensAI</span>
        </div>
      </a>

      <!-- Desktop nav -->
      <nav class="nav-desktop" aria-label="Main navigation">
        <div class="nav-item nav-drop">
          <a href="/platform" aria-expanded="false" aria-haspopup="true">
            Platform
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" class="nav-chevron"><polyline points="6 9 12 15 18 9"/></svg>
          </a>
          <div class="nav-dropdown" role="menu">
            <a href="/platform" class="nav-dd-item" role="menuitem">
              <div class="nav-dd-icon">⚡</div>
              <div class="nav-dd-text">
                <div class="nav-dd-title">Platform Overview</div>
                <div class="nav-dd-desc">End-to-end DXP capabilities</div>
              </div>
            </a>
            <a href="/ai-capabilities" class="nav-dd-item" role="menuitem">
              <div class="nav-dd-icon">🤖</div>
              <div class="nav-dd-text">
                <div class="nav-dd-title">AI Capabilities</div>
                <div class="nav-dd-desc">ZensAI-powered intelligence</div>
              </div>
            </a>
            <a href="/integrations" class="nav-dd-item" role="menuitem">
              <div class="nav-dd-icon">🔗</div>
              <div class="nav-dd-text">
                <div class="nav-dd-title">Integrations</div>
                <div class="nav-dd-desc">Connect your enterprise stack</div>
              </div>
            </a>
            <a href="/security" class="nav-dd-item" role="menuitem">
              <div class="nav-dd-icon">🛡️</div>
              <div class="nav-dd-text">
                <div class="nav-dd-title">Security</div>
                <div class="nav-dd-desc">Enterprise-grade trust</div>
              </div>
            </a>
          </div>
        </div>

        <div class="nav-item">
          <a href="/solutions">Solutions</a>
        </div>

        <div class="nav-item">
          <a href="/why-dxp">Why DXP AI</a>
        </div>

        <div class="nav-item nav-drop">
          <a href="/resources" aria-expanded="false" aria-haspopup="true">
            Resources
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" class="nav-chevron"><polyline points="6 9 12 15 18 9"/></svg>
          </a>
          <div class="nav-dropdown" role="menu">
            <a href="/blog" class="nav-dd-item" role="menuitem">
              <div class="nav-dd-icon">📝</div>
              <div class="nav-dd-text">
                <div class="nav-dd-title">Blog &amp; Articles</div>
                <div class="nav-dd-desc">Insights &amp; best practices</div>
              </div>
            </a>
            <a href="/case-studies" class="nav-dd-item" role="menuitem">
              <div class="nav-dd-icon">📊</div>
              <div class="nav-dd-text">
                <div class="nav-dd-title">Case Studies</div>
                <div class="nav-dd-desc">Customer success stories</div>
              </div>
            </a>
            <a href="/documentation" class="nav-dd-item" role="menuitem">
              <div class="nav-dd-icon">📚</div>
              <div class="nav-dd-text">
                <div class="nav-dd-title">Documentation</div>
                <div class="nav-dd-desc">API docs &amp; guides</div>
              </div>
            </a>
          </div>
        </div>

        <div class="nav-item">
          <a href="/pricing">Pricing</a>
        </div>

        <div class="nav-item">
          <a href="/about">About</a>
        </div>
      </nav>

      <!-- Desktop actions -->
      <div class="nav-actions">
        <a href="/contact" class="nav-btn-login">Login</a>
        <a href="/contact" class="nav-btn-demo">Request Demo</a>
      </div>

      <!-- Hamburger -->
      <button class="nav-hamburger" aria-label="Open navigation" aria-expanded="false" aria-controls="nav-mobile-menu" type="button">
        <span></span><span></span><span></span>
      </button>
    </div>

    <!-- Mobile menu -->
    <div class="nav-mobile-menu" id="nav-mobile-menu" role="navigation" aria-label="Mobile navigation">
      <a href="/">Home</a>
      <a href="/platform">Platform</a>
      <a href="/ai-capabilities">AI Capabilities</a>
      <a href="/solutions">Solutions</a>
      <a href="/why-dxp">Why DXP AI</a>
      <a href="/pricing">Pricing</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
      <div class="nav-mobile-divider" aria-hidden="true"></div>
      <div class="nav-mobile-cta">
        <a href="/contact" class="nav-btn-demo">Request a Demo →</a>
      </div>
    </div>
  `;

  // Dropdown hover + focus behaviour (desktop)
  wrapper.querySelectorAll('.nav-drop').forEach((item) => {
    const link = item.querySelector('a');

    item.addEventListener('mouseenter', () => {
      if (!isDesktop.matches) return;
      closeAllDropdowns(wrapper);
      item.classList.add('open');
      link?.setAttribute('aria-expanded', 'true');
    });

    item.addEventListener('mouseleave', () => {
      if (!isDesktop.matches) return;
      item.classList.remove('open');
      link?.setAttribute('aria-expanded', 'false');
    });

    // keyboard — Enter/Space on the parent link toggles dropdown
    link?.addEventListener('keydown', (e) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        const isOpen = item.classList.contains('open');
        closeAllDropdowns(wrapper);
        if (!isOpen) {
          item.classList.add('open');
          link.setAttribute('aria-expanded', 'true');
        }
      }
      if (e.code === 'Escape') {
        closeAllDropdowns(wrapper);
        link.focus();
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) closeAllDropdowns(wrapper);
  });

  // Hamburger toggle
  const hamburger = wrapper.querySelector('.nav-hamburger');
  hamburger.addEventListener('click', () => toggleMobileMenu(wrapper));

  // Scroll effect — add .scrolled class to wrapper
  const onScroll = () => {
    wrapper.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reset mobile state on resize to desktop
  isDesktop.addEventListener('change', () => {
    if (isDesktop.matches) {
      const menu = wrapper.querySelector('.nav-mobile-menu');
      menu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflowY = '';
    }
  });

  block.append(wrapper);
}
