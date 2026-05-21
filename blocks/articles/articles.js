/**
 * Articles block — builds article card grid from block data
 * Row structure per article item: [category, title, text, ctaText, ctaUrl, author, readTime, date]
 * or simplified: [category, title, description, ctaUrl]
 */

const GRADIENTS = [
  'linear-gradient(135deg, #1a1b4b, #2d1b69)',
  'linear-gradient(135deg, #0d4e8a, #1a1b4b)',
  'linear-gradient(135deg, #1b4b2d, #0d2a1a)',
  'linear-gradient(135deg, #2d1b69, #1a1b4b)',
  'linear-gradient(135deg, #0d2a4b, #1a3b6b)',
  'linear-gradient(135deg, #4b1b2d, #2d0d1a)',
];

const TAG_COLORS = {
  ai: 'rgba(124,58,237,0.8)',
  platform: 'rgba(6,182,212,0.8)',
  case: 'rgba(245,158,11,0.8)',
  default: 'rgba(124,58,237,0.8)',
};

function getInitials(name) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase()
    .slice(0, 2);
}

function buildArticleCard(row, index, featured) {
  const cells = [...row.children];
  const category = cells[0]?.textContent.trim() || 'Article';
  const titleEl = cells[1];
  const desc = cells[2]?.innerHTML || cells[2]?.textContent || '';
  const ctaLinkEl = cells[3]?.querySelector('a');
  const ctaUrl = ctaLinkEl?.href || '#';
  const ctaText = ctaLinkEl?.textContent.trim() || 'Read Article →';
  const author = cells[4]?.textContent.trim() || 'DXP AI Team';
  const readTime = cells[5]?.textContent.trim() || '5 min read';
  const date = cells[6]?.textContent.trim() || '';

  let tagType = 'platform';
  if (category.toLowerCase().includes('ai')) tagType = 'ai';
  else if (category.toLowerCase().includes('case')) tagType = 'case';
  const tagColor = TAG_COLORS[tagType] || TAG_COLORS.default;
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const initials = getInitials(author);

  const card = document.createElement('div');
  card.className = `article-card${featured ? ' article-card--featured' : ''}`;

  const titleHtml = titleEl?.querySelector('a')
    ? `<a href="${titleEl.querySelector('a').href}">${titleEl.querySelector('a').textContent}</a>`
    : `<a href="${ctaUrl}">${titleEl?.textContent.trim() || 'Article'}</a>`;

  const descText = desc.replace(/<[^>]+>/g, '').trim().slice(0, 160) + (desc.length > 160 ? '\u2026' : '');

  card.innerHTML = `
    <div class="article-img-placeholder" style="background:${gradient}">
      <span class="article-tag" style="background:${tagColor}">${category}</span>
    </div>
    <div class="article-card__body">
      <div class="article-card__meta">
        <div class="meta-author">
          <div class="author-avatar">${initials}</div>
          ${author}
        </div>
        <span class="meta-dot" aria-hidden="true"></span>
        <span class="meta-read">${readTime}</span>
      </div>
      <h3>${titleHtml}</h3>
      <p>${descText}</p>
      <div class="article-card__footer">
        <a href="${ctaUrl}" class="article-card__read-more">${ctaText} <span aria-hidden="true">→</span></a>
        ${date ? `<span class="article-card__date">${date}</span>` : ''}
      </div>
    </div>
  `;

  row.remove();
  return card;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // First row may be a heading row (single cell with overline + h2)
  let headingRow = null;
  const articleRows = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1 && articleRows.length === 0) {
      headingRow = row;
    } else {
      articleRows.push(row);
    }
  });

  const fragment = document.createDocumentFragment();

  // Header: overline + heading + "View All" link
  const header = document.createElement('div');
  header.className = 'articles-header';

  const headingDiv = document.createElement('div');
  headingDiv.className = 'section-heading';

  if (headingRow) {
    headingDiv.innerHTML = headingRow.children[0]?.innerHTML || '';
    headingRow.remove();
  } else {
    headingDiv.innerHTML = '<span class="overline">Insights &amp; Resources</span><h2>Latest from the DXP AI Blog</h2>';
  }

  const viewAll = document.createElement('a');
  viewAll.href = '/blog';
  viewAll.className = 'view-all';
  viewAll.innerHTML = 'View All Articles <span aria-hidden="true">→</span>';

  header.append(headingDiv, viewAll);
  fragment.append(header);

  // Article grid
  if (articleRows.length > 0) {
    const grid = document.createElement('div');
    grid.className = 'articles-grid';
    articleRows.forEach((row, i) => {
      grid.append(buildArticleCard(row, i, i === 0));
    });
    fragment.append(grid);
  }

  // Newsletter CTA
  const cta = document.createElement('div');
  cta.className = 'articles-cta';
  cta.setAttribute('role', 'region');
  cta.setAttribute('aria-label', 'Newsletter signup');
  cta.innerHTML = `
    <div class="acta-content">
      <h3>Get DXP AI insights in your inbox</h3>
      <p>Join 8,000+ digital experience leaders receiving our monthly newsletter on AI, personalisation, and CX strategy.</p>
    </div>
    <div class="acta-form">
      <label for="articles-email" class="sr-only">Email address</label>
      <input type="email" id="articles-email" placeholder="Your work email address" autocomplete="email">
      <button type="button">Subscribe Free</button>
    </div>
  `;
  fragment.append(cta);

  block.replaceChildren(fragment);

  // Newsletter button handler
  block.querySelector('.acta-form button')?.addEventListener('click', () => {
    const input = block.querySelector('.acta-form input');
    if (input?.value) input.value = '';
  });
}
