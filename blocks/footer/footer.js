/**
 * Footer block — content loaded from /footer page authored in AEM.
 * Structure of /footer page (7 sections):
 *   Section 0: Newsletter — <h3>heading</h3><p>copy</p>
 *   Section 1: Brand — <p><a>name</a></p><p>tagline</p><p>desc</p><ul>social</ul><p>attrib</p>
 *   Section 2: Platform column — <h4>Platform</h4><ul>links</ul>
 *   Section 3: Solutions column — <h4>Solutions</h4><ul>links</ul>
 *   Section 4: Resources column — <h4>Resources</h4><ul>links</ul>
 *   Section 5: Company column — <h4>Company</h4><ul>links</ul>
 *   Section 6: Legal — <p>copyright</p><ul>legal links</ul><ul>certifications</ul>
 */
export default async function decorate(block) {
  block.textContent = '';

  let html = '';
  try {
    const metaEl = document.head.querySelector('meta[name="footer"]');
    const path = metaEl?.getAttribute('content') || '/footer';
    const resp = await fetch(`${path}.plain.html`);
    if (resp.ok) html = await resp.text();
  } catch (_) {
    // Network error — use defaults below
  }

  const doc = new DOMParser().parseFromString(html || '<div></div>', 'text/html');
  const secs = [...doc.body.querySelectorAll(':scope > div')];

  // ── Section 0: Newsletter ────────────────────────────────────
  const nlHeading = secs[0]?.querySelector('h2,h3,h4')?.textContent.trim()
    || 'Stay ahead with DXP AI insights';
  const nlText = secs[0]?.querySelector('p')?.textContent.trim()
    || 'Get the latest on AI-powered digital experiences, product updates, and industry trends.';

  // ── Section 1: Brand ─────────────────────────────────────────
  const brandSec = secs[1];
  const brandLink = brandSec?.querySelector('p:first-of-type a');
  const brandName = brandLink?.textContent.trim() || 'DXP AI';
  const pEls = brandSec ? [...brandSec.querySelectorAll('p')] : [];
  const brandTagline = pEls[1]?.textContent.trim() || 'Powered by ZensAI';
  const brandDesc = pEls[2]?.textContent.trim()
    || 'The AI-first Digital Experience Platform that helps organisations create, manage, and deliver personalised experiences across every customer touchpoint.';
  const brandAttrib = pEls[pEls.length - 1]?.innerHTML.trim()
    || 'A <em>Zensar Technologies</em> Product';

  const socialUl = brandSec?.querySelector('ul');
  const socialHTML = socialUl
    ? [...socialUl.querySelectorAll('a')].map((a) => {
      const label = a.getAttribute('aria-label') || a.textContent.trim();
      return `<a href="${a.getAttribute('href') || '#'}" aria-label="${label}" class="footer-social-icon">${a.innerHTML}</a>`;
    }).join('')
    : `<a href="#" aria-label="LinkedIn" class="footer-social-icon">in</a>
       <a href="#" aria-label="X (Twitter)" class="footer-social-icon">𝕏</a>
       <a href="#" aria-label="YouTube" class="footer-social-icon">▶</a>
       <a href="#" aria-label="GitHub" class="footer-social-icon">&#9000;</a>`;

  // ── Sections 2–5: Link columns ───────────────────────────────
  let columnsHTML = '';
  for (let i = 2; i <= 5; i += 1) {
    const sec = secs[i];
    if (!sec) break;
    const heading = sec.querySelector('h4,h3,h2')?.textContent.trim() || '';
    const links = [...(sec.querySelector('ul')?.querySelectorAll('a') || [])];
    const linksHTML = links.map((a) => `<li><a href="${a.getAttribute('href') || '#'}">${a.textContent.trim()}</a></li>`).join('');
    if (heading) columnsHTML += `<div class="footer-col"><h4>${heading}</h4><ul>${linksHTML}</ul></div>`;
  }

  // Default columns when footer page has no column content
  if (!columnsHTML) {
    columnsHTML = `
      <div class="footer-col">
        <h4>Platform</h4>
        <ul>
          <li><a href="/platform">Platform Overview</a></li>
          <li><a href="/ai-capabilities">AI Capabilities <span class="footer-badge-new">New</span></a></li>
          <li><a href="/platform">Content Management</a></li>
          <li><a href="/platform">Personalisation</a></li>
          <li><a href="/integrations">Integrations</a></li>
          <li><a href="/security">Security</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Solutions</h4>
        <ul>
          <li><a href="/solutions">For Marketing</a></li>
          <li><a href="/solutions">For IT Teams</a></li>
          <li><a href="/solutions">Enterprise</a></li>
          <li><a href="/why-dxp">DXP vs CMS</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Resources</h4>
        <ul>
          <li><a href="/blog">Blog &amp; Articles</a></li>
          <li><a href="/case-studies">Case Studies</a></li>
          <li><a href="/documentation">Documentation</a></li>
          <li><a href="/resources">Whitepapers</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <ul>
          <li><a href="/about">About DXP AI</a></li>
          <li><a href="/pricing">Pricing</a></li>
          <li><a href="/contact">Contact Us</a></li>
          <li><a href="/contact">Request Demo</a></li>
        </ul>
      </div>`;
  }

  // ── Section 6: Legal ─────────────────────────────────────────
  const legalSec = secs[6];
  const copyright = legalSec?.querySelector('p')?.textContent.trim()
    || '© 2025 DXP AI · Zensar Technologies Ltd.';

  const legalUls = legalSec ? [...legalSec.querySelectorAll('ul')] : [];
  const legalLinks = [...(legalUls[0]?.querySelectorAll('a') || [])];
  const legalLinksHTML = legalLinks.length
    ? legalLinks.map((a) => `<a href="${a.getAttribute('href') || '#'}">${a.textContent.trim()}</a>`)
      .join('<span class="footer-sep" aria-hidden="true">&middot;</span>')
    : `<a href="#">Privacy Policy</a>
       <span class="footer-sep" aria-hidden="true">&middot;</span>
       <a href="#">Terms of Service</a>
       <span class="footer-sep" aria-hidden="true">&middot;</span>
       <a href="#">Cookie Settings</a>`;

  const certItems = legalUls[1]
    ? [...legalUls[1].querySelectorAll('li')].map((li) => `<span class="footer-cert">${li.textContent.trim()}</span>`).join('')
    : `<span class="footer-cert">SOC 2</span>
       <span class="footer-cert">ISO 27001</span>
       <span class="footer-cert">GDPR</span>
       <span class="footer-cert">HIPAA Ready</span>`;

  // ── Build footer DOM ─────────────────────────────────────────
  const footer = document.createElement('div');
  footer.className = 'footer-inner';
  footer.innerHTML = `
    <div class="footer-container">
      <div class="footer-newsletter">
        <div class="footer-nl-text">
          <h3>${nlHeading}</h3>
          <p>${nlText}</p>
        </div>
        <div class="footer-nl-form">
          <label for="footer-email" class="footer-sr-only">Email address for newsletter</label>
          <input type="email" id="footer-email" placeholder="Enter your work email" autocomplete="email">
          <button type="button">Subscribe <span aria-hidden="true">→</span></button>
        </div>
      </div>

      <div class="footer-top">
        <div class="footer-brand">
          <div class="footer-brand-logo">
            <div class="footer-brand-text">
              <div class="footer-brand-name">${brandName}</div>
              <div class="footer-brand-tagline">${brandTagline}</div>
            </div>
          </div>
          <p>${brandDesc}</p>
          <div class="footer-social" aria-label="Social media links">${socialHTML}</div>
          <div class="footer-zensar">${brandAttrib}</div>
        </div>
        ${columnsHTML}
      </div>

      <div class="footer-divider" role="separator" aria-hidden="true"></div>

      <div class="footer-bottom">
        <div class="footer-legal">
          <span>${copyright}</span>
          <span class="footer-sep" aria-hidden="true">&middot;</span>
          ${legalLinksHTML}
        </div>
        <div class="footer-certifications" aria-label="Certifications">${certItems}</div>
      </div>
    </div>
  `;

  block.append(footer);
}
