/**
 * Header block — content loaded from /nav page authored in AEM.
 * Structure of /nav page (3 sections):
 *   Section 0: Brand — <p><a href="/">DXP AI</a></p><p>Powered by ZensAI</p>
 *   Section 1: Nav list — <ul> with nested <ul> for dropdowns
 *   Section 2: Tools — <p><em><a>Login</a></em></p><p><a>Request Demo</a></p>
 */

const isDesktop = window.matchMedia('(min-width: 900px)');

// Design-system embellishments for known dropdown links (icon + description).
// Authors control which links exist; JS provides visual treatment.
const NAV_ITEM_META = {
  '/platform': { icon: '⚡', desc: 'End-to-end DXP capabilities' },
  '/ai-capabilities': { icon: '🤖', desc: 'ZensAI-powered intelligence' },
  '/integrations': { icon: '🔗', desc: 'Connect your enterprise stack' },
  '/security': { icon: '🛡️', desc: 'Enterprise-grade trust' },
  '/blog': { icon: '📝', desc: 'Insights & best practices' },
  '/case-studies': { icon: '📊', desc: 'Customer success stories' },
  '/documentation': { icon: '📚', desc: 'API docs & guides' },
};

function closeAllDropdowns(nav) {
  nav.querySelectorAll('.nav-item.open').forEach((item) => {
    item.classList.remove('open');
    item.querySelector('.nav-drop-toggle')?.setAttribute('aria-expanded', 'false');
  });
}

function toggleMobileMenu(wrapper) {
  const menu = wrapper.querySelector('.nav-mobile-menu');
  const hamburger = wrapper.querySelector('.nav-hamburger');
  const isOpen = menu.classList.contains('open');
  menu.classList.toggle('open', !isOpen);
  hamburger.classList.toggle('open', !isOpen);
  hamburger.setAttribute('aria-expanded', String(!isOpen));
  hamburger.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  document.body.style.overflowY = isOpen ? '' : 'hidden';
}

function buildDropdownItems(ul) {
  return [...ul.querySelectorAll(':scope > li')].map((li) => {
    const a = li.querySelector('a');
    if (!a) return '';
    const href = a.getAttribute('href') || '#';
    const text = a.textContent.trim();
    const meta = NAV_ITEM_META[href] || {};
    return `<a href="${href}" class="nav-dd-item" role="menuitem">
      ${meta.icon ? `<div class="nav-dd-icon">${meta.icon}</div>` : ''}
      <div class="nav-dd-text">
        <div class="nav-dd-title">${text}</div>
        ${meta.desc ? `<div class="nav-dd-desc">${meta.desc}</div>` : ''}
      </div>
    </a>`;
  }).join('');
}

function buildNavItems(ul) {
  const chevron = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" class="nav-chevron"><polyline points="6 9 12 15 18 9"/></svg>';
  return [...ul.querySelectorAll(':scope > li')].map((li) => {
    const subUl = li.querySelector(':scope > ul');
    const directA = li.querySelector(':scope > a');

    if (subUl) {
      // Dropdown: parent may be text-only (no href) or a link
      const label = (li.childNodes[0]?.nodeType === Node.TEXT_NODE
        ? li.childNodes[0].textContent
        : directA?.textContent || '').trim();
      const href = directA?.getAttribute('href');
      const toggleEl = href
        ? `<a href="${href}" class="nav-drop-toggle" aria-expanded="false" aria-haspopup="true">${label}${chevron}</a>`
        : `<button class="nav-drop-toggle" type="button" aria-expanded="false" aria-haspopup="true">${label}${chevron}</button>`;
      return `<div class="nav-item nav-drop">${toggleEl}<div class="nav-dropdown" role="menu">${buildDropdownItems(subUl)}</div></div>`;
    }

    // Simple link
    const href = directA?.getAttribute('href') || '#';
    const text = (directA?.textContent || li.textContent).trim();
    return `<div class="nav-item"><a href="${href}">${text}</a></div>`;
  }).join('');
}

function buildToolButtons(container) {
  return [...container.querySelectorAll('p')].map((p) => {
    const a = p.querySelector('a');
    if (!a) return '';
    const isSecondary = !!p.querySelector('em');
    return `<a href="${a.getAttribute('href') || '#'}" class="${isSecondary ? 'nav-btn-login' : 'nav-btn-demo'}">${a.textContent.trim()}</a>`;
  }).join('');
}

function buildMobileLinks(ul) {
  return [...ul.querySelectorAll('a')].map((a) => `<a href="${a.getAttribute('href') || '#'}">${a.textContent.trim()}</a>`).join('');
}

export default async function decorate(block) {
  block.textContent = '';

  // Defaults shown when /nav cannot be fetched
  let brandName = 'DXP AI';
  let brandSub = 'Powered by ZensAI';
  let brandHref = '/';
  let navHTML = '';
  let toolsHTML = '<a href="/contact" class="nav-btn-login">Login</a><a href="/contact" class="nav-btn-demo">Request Demo</a>';
  let mobileLinks = '';
  let mobileCTA = '';

  try {
    const navMeta = document.head.querySelector('meta[name="nav"]');
    const navPath = navMeta?.getAttribute('content') || '/nav';
    const resp = await fetch(`${navPath}.plain.html`);

    if (resp.ok) {
      const navDoc = new DOMParser().parseFromString(await resp.text(), 'text/html');
      const secs = [...navDoc.body.querySelectorAll(':scope > div')];

      // Section 0: Brand
      if (secs[0]) {
        const brandLink = secs[0].querySelector('a');
        if (brandLink) {
          brandName = brandLink.textContent.trim();
          brandHref = brandLink.getAttribute('href') || '/';
        }
        const pEls = [...secs[0].querySelectorAll('p')];
        if (pEls[1]) brandSub = pEls[1].textContent.trim();
      }

      // Section 1: Nav list
      if (secs[1]) {
        const ul = secs[1].querySelector('ul');
        if (ul) {
          navHTML = buildNavItems(ul);
          mobileLinks = buildMobileLinks(ul);
        }
      }

      // Section 2: CTA tools
      if (secs[2]) {
        toolsHTML = buildToolButtons(secs[2]);
        // Primary CTA for mobile (link NOT wrapped in <em>)
        const primaryA = [...secs[2].querySelectorAll('a')].find((a) => !a.closest('em'))
          || secs[2].querySelector('a');
        if (primaryA) {
          mobileCTA = `<div class="nav-mobile-divider" aria-hidden="true"></div>
            <div class="nav-mobile-cta">
              <a href="${primaryA.getAttribute('href') || '#'}" class="nav-btn-demo">${primaryA.textContent.trim()} →</a>
            </div>`;
        }
      }
    }
  } catch (_) {
    // Network error — defaults remain
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.innerHTML = `
    <div class="nav-inner">
      <a href="${brandHref}" class="nav-logo" aria-label="${brandName} – home">
        <div class="nav-logo-text">
          <span class="nav-logo-brand">${brandName}</span>
          ${brandSub ? `<span class="nav-logo-sub">${brandSub}</span>` : ''}
        </div>
      </a>
      <nav class="nav-desktop" aria-label="Main navigation">${navHTML}</nav>
      <div class="nav-actions">${toolsHTML}</div>
      <button class="nav-hamburger" aria-label="Open navigation" aria-expanded="false"
        aria-controls="nav-mobile-menu" type="button">
        <span></span><span></span><span></span>
      </button>
    </div>
    <div class="nav-mobile-menu" id="nav-mobile-menu" role="navigation" aria-label="Mobile navigation">
      ${mobileLinks}${mobileCTA}
    </div>
  `;

  // Dropdown hover + keyboard behaviour
  wrapper.querySelectorAll('.nav-drop').forEach((item) => {
    const toggle = item.querySelector('.nav-drop-toggle');

    item.addEventListener('mouseenter', () => {
      if (!isDesktop.matches) return;
      closeAllDropdowns(wrapper);
      item.classList.add('open');
      toggle?.setAttribute('aria-expanded', 'true');
    });

    item.addEventListener('mouseleave', () => {
      if (!isDesktop.matches) return;
      item.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    });

    toggle?.addEventListener('keydown', (e) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        const isOpen = item.classList.contains('open');
        closeAllDropdowns(wrapper);
        if (!isOpen) {
          item.classList.add('open');
          toggle.setAttribute('aria-expanded', 'true');
        }
      }
      if (e.code === 'Escape') {
        closeAllDropdowns(wrapper);
        toggle.focus();
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) closeAllDropdowns(wrapper);
  });

  wrapper.querySelector('.nav-hamburger').addEventListener('click', () => toggleMobileMenu(wrapper));

  const onScroll = () => wrapper.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  isDesktop.addEventListener('change', () => {
    if (!isDesktop.matches) return;
    wrapper.querySelector('.nav-mobile-menu')?.classList.remove('open');
    const hamburger = wrapper.querySelector('.nav-hamburger');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflowY = '';
  });

  block.append(wrapper);
}
