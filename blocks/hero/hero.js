/**
 * Hero block — content driven by AEM model fields.
 * AEM xwalk renders each model field as a separate block row (one row per field).
 * Row index maps directly to field order in the model:
 *   row 0: eyebrow       — text
 *   row 1: heading       — richtext (use <em> around accent words → styled as gradient)
 *   row 2: subheading    — richtext
 *   row 3: primaryCtaText  — text
 *   row 4: primaryCtaUrl   — aem-content
 *   row 5: secondaryCtaText — text
 *   row 6: secondaryCtaUrl  — aem-content
 *
 * Decorative elements (orbs, dashboard card, trust badges) are design-system
 * defaults rendered by JS — no AEM content required for these.
 */
export default function decorate(block) {
  block.closest('.section')?.classList.add('hero-section-full');

  // AEM renders each field as its own row with one cell child.
  // cell(i) returns the content div for field at index i.
  const rows = [...block.children];
  const cell = (i) => rows[i]?.children[0];

  const eyebrow = cell(0)?.textContent.trim()
    || 'Powered by ZensAI · Zensar Technologies';

  // heading: richtext — replace <em> with gradient accent span
  let headingHTML = cell(1)?.innerHTML.trim()
    || '<h1>The Future of<br><em>Digital Experience</em><br>is AI&#8209;First</h1>';
  headingHTML = headingHTML.replace(/<em>([\s\S]*?)<\/em>/gi, '<span class="hero-accent">$1</span>');

  const subHTML = cell(2)?.innerHTML.trim()
    || '<p>DXP AI unifies content management, personalisation, multi-channel delivery, and intelligent automation — all powered by ZensAI to create experiences your customers actually remember.</p>';

  const primaryText = cell(3)?.textContent.trim() || 'Request a Demo';
  const primaryHref = cell(4)?.querySelector('a')?.getAttribute('href')
    || cell(4)?.textContent.trim() || '/contact';

  const secondaryText = cell(5)?.textContent.trim() || 'Explore Platform';
  const secondaryHref = cell(6)?.querySelector('a')?.getAttribute('href')
    || cell(6)?.textContent.trim() || '/platform';

  block.innerHTML = `
    <div class="hero-orb hero-orb--1" aria-hidden="true"></div>
    <div class="hero-orb hero-orb--2" aria-hidden="true"></div>
    <div class="hero-orb hero-orb--3" aria-hidden="true"></div>
    <div class="hero-inner">
      <div class="hero-content">
        <div class="hero-eyebrow">
          <span class="hero-dot" aria-hidden="true"></span>
          ${eyebrow}
        </div>
        <div class="hero-heading">${headingHTML}</div>
        <div class="hero-sub">${subHTML}</div>
        <div class="hero-actions">
          <a href="${primaryHref}" class="hero-btn-primary">
            ${primaryText} <span aria-hidden="true">→</span>
          </a>
          <a href="${secondaryHref}" class="hero-btn-secondary">
            <span aria-hidden="true">▶</span>&nbsp; ${secondaryText}
          </a>
        </div>
        <div class="hero-trust">
          <span class="hero-trust-label">Enterprise Ready</span>
          <div class="hero-trust-items">
            <div class="hero-trust-item"><span class="hero-check" aria-hidden="true">✓</span>SOC 2 Compliant</div>
            <div class="hero-trust-item"><span class="hero-check" aria-hidden="true">✓</span>GDPR Ready</div>
            <div class="hero-trust-item"><span class="hero-check" aria-hidden="true">✓</span>99.9% Uptime SLA</div>
            <div class="hero-trust-item"><span class="hero-check" aria-hidden="true">✓</span>ISO 27001</div>
          </div>
        </div>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <div class="hero-platform-card">
          <div class="hpc-header">
            <span class="hpc-title">DXP AI Dashboard</span>
            <span class="hpc-badge"><span class="hero-dot hero-dot--live"></span>Live</span>
          </div>
          <div class="hpc-metrics">
            <div class="hpc-metric"><div class="hpc-val">98%</div><div class="hpc-lbl">Engagement</div></div>
            <div class="hpc-metric"><div class="hpc-val">4.2×</div><div class="hpc-lbl">Faster Delivery</div></div>
            <div class="hpc-metric"><div class="hpc-val">360°</div><div class="hpc-lbl">Customer View</div></div>
          </div>
          <div class="hpc-features">
            <div class="hpc-item"><div class="hpc-icon hpc-icon--purple">📄</div><span>AI Content Management</span><div class="hpc-dot"></div></div>
            <div class="hpc-item"><div class="hpc-icon hpc-icon--cyan">☀</div><span>Smart Personalisation Engine</span><div class="hpc-dot"></div></div>
            <div class="hpc-item"><div class="hpc-icon hpc-icon--blue">🌐</div><span>Multi-Channel Delivery</span><div class="hpc-dot"></div></div>
            <div class="hpc-item"><div class="hpc-icon hpc-icon--violet">🔒</div><span>ZensAI Intelligence</span><div class="hpc-dot"></div></div>
            <div class="hpc-item"><div class="hpc-icon hpc-icon--amber">📊</div><span>Analytics &amp; Insights</span><div class="hpc-dot"></div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="hero-scroll" aria-hidden="true">
      <div class="hero-scroll-line"></div>
      <span>Scroll</span>
    </div>
  `;

  // Skip scroll-triggered animation inside UE's iframe to prevent accumulated
  // observers and layout interference on re-decoration.
  let inEditor = false;
  try { inEditor = window.self !== window.top; } catch { inEditor = true; }
  if (inEditor) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  block.querySelectorAll('.hero-trust-item').forEach((el) => observer.observe(el));
}
