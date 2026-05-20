/**
 * DXP AI Hero block — renders full hero HTML directly to match html-kit
 */
export default function decorate(block) {
  block.closest('.section').classList.add('hero-section-full');

  block.innerHTML = `
    <div class="hero-orb hero-orb--1" aria-hidden="true"></div>
    <div class="hero-orb hero-orb--2" aria-hidden="true"></div>
    <div class="hero-orb hero-orb--3" aria-hidden="true"></div>
    <div class="hero-inner">
      <div class="hero-content">
        <div class="hero-eyebrow">
          <span class="hero-dot" aria-hidden="true"></span>
          Powered by ZensAI · Zensar Technologies
        </div>
        <h1 class="hero-heading">
          The Future of<br>
          <span class="hero-accent">Digital Experience</span><br>
          is AI&#8209;First
        </h1>
        <p class="hero-sub">
          DXP AI unifies content management, personalisation, multi-channel delivery, and intelligent automation — all powered by ZensAI to create experiences your customers actually remember.
        </p>
        <div class="hero-actions">
          <a href="/contact" class="hero-btn-primary">
            Request a Demo <span aria-hidden="true">→</span>
          </a>
          <a href="/platform" class="hero-btn-secondary">
            <span aria-hidden="true">▶</span>&nbsp; Explore Platform
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

  // Scroll-reveal animation for trust items
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  block.querySelectorAll('.hero-trust-item').forEach((el) => observer.observe(el));
}
