/**
 * loads and decorates the footer — DXP AI design
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  block.textContent = '';

  const footer = document.createElement('div');
  footer.className = 'footer-inner';
  footer.innerHTML = `
    <div class="footer-container">
      <div class="footer-newsletter">
        <div class="footer-nl-text">
          <h3>Stay ahead with DXP AI insights</h3>
          <p>Get the latest on AI-powered digital experiences, product updates, and industry trends.</p>
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
              <div class="footer-brand-name">DXP AI</div>
              <div class="footer-brand-tagline">Powered by ZensAI</div>
            </div>
          </div>
          <p>The AI-first Digital Experience Platform that helps organisations create, manage, and deliver personalised experiences across every customer touchpoint.</p>
          <div class="footer-social" aria-label="Social media links">
            <a href="#" aria-label="LinkedIn" class="footer-social-icon">in</a>
            <a href="#" aria-label="X (Twitter)" class="footer-social-icon">𝕏</a>
            <a href="#" aria-label="YouTube" class="footer-social-icon">▶</a>
            <a href="#" aria-label="GitHub" class="footer-social-icon">&#9000;</a>
          </div>
          <div class="footer-zensar">A <span>Zensar Technologies</span> Product</div>
        </div>

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
        </div>
      </div>

      <div class="footer-divider" role="separator" aria-hidden="true"></div>

      <div class="footer-bottom">
        <div class="footer-legal">
          <span>&#169; 2025 DXP AI &middot; Zensar Technologies Ltd.</span>
          <span class="footer-sep" aria-hidden="true">&middot;</span>
          <a href="#">Privacy Policy</a>
          <span class="footer-sep" aria-hidden="true">&middot;</span>
          <a href="#">Terms of Service</a>
          <span class="footer-sep" aria-hidden="true">&middot;</span>
          <a href="#">Cookie Settings</a>
        </div>
        <div class="footer-certifications" aria-label="Certifications">
          <span class="footer-cert">SOC 2</span>
          <span class="footer-cert">ISO 27001</span>
          <span class="footer-cert">GDPR</span>
          <span class="footer-cert">HIPAA Ready</span>
        </div>
      </div>
    </div>
  `;

  block.append(footer);
}
