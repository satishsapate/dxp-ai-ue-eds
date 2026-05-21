import { moveInstrumentation } from '../../scripts/scripts.js';

const SVGS = {
  cms: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  personalize: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
  multichannel: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  ai: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  integrations: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  analytics: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  platform: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  search: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  security: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  cloud: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
  star: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  rocket: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
  chat: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
};

// Maps iconVariant → card-category CSS modifier class
const VARIANT_TO_CATEGORY = {
  purple: 'capability',
  violet: 'capability',
  cyan: 'feature',
  green: 'feature',
  blue: 'solution',
  orange: 'solution',
};

// Block-level model field count (overline, heading, description)
const MODEL_ROWS = 3;

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const fragment = document.createDocumentFragment();

  // ── Block-level section heading (rows 0, 1, 2) ────────────────────────────
  // AEM XWalk renders each block-level model field as its own row (one cell).
  const sectionHeading = document.createElement('div');
  sectionHeading.className = 'section-heading';

  const overlineCell = rows[0]?.children[0];
  const overlineEl = document.createElement('span');
  overlineEl.className = 'overline';
  overlineEl.textContent = overlineCell?.textContent.trim() || '';
  if (overlineCell) moveInstrumentation(overlineCell, overlineEl);
  sectionHeading.append(overlineEl);

  const headingCell = rows[1]?.children[0];
  const h2 = document.createElement('h2');
  h2.textContent = headingCell?.textContent.trim() || '';
  if (headingCell) moveInstrumentation(headingCell, h2);
  sectionHeading.append(h2);

  const descCell = rows[2]?.children[0];
  const descP = document.createElement('p');
  descP.innerHTML = descCell?.innerHTML?.trim() || '';
  if (descCell) moveInstrumentation(descCell, descP);
  sectionHeading.append(descP);

  rows.slice(0, MODEL_ROWS).forEach((r) => r.remove());
  fragment.append(sectionHeading);

  // ── Carousel item rows (MODEL_ROWS+) ──────────────────────────────────────
  // Cell order per item: [0]iconKey [1]iconVariant [2]category [3]title
  //                      [4]text(richtext) [5]ctaText [6]ctaUrl
  const itemRows = rows.slice(MODEL_ROWS);
  if (itemRows.length === 0) {
    block.replaceChildren(fragment);
    return;
  }

  const trackWrapper = document.createElement('div');
  trackWrapper.className = 'carousel__track-wrapper';

  const track = document.createElement('div');
  track.className = 'carousel__track';
  trackWrapper.append(track);

  const slideWrappers = [];

  itemRows.forEach((row) => {
    const cells = [...row.children];

    const iconKey = cells[0]?.textContent.trim() || '';
    const iconVariant = (cells[1]?.textContent.trim() || 'purple').toLowerCase();
    const categoryText = cells[2]?.textContent.trim();
    const titleText = cells[3]?.textContent.trim();
    const textContent = cells[4]?.innerHTML?.trim();
    const ctaText = cells[5]?.textContent.trim();
    const ctaHref = cells[6]?.querySelector('a')?.href || cells[6]?.textContent.trim() || '#';

    const slideWrapper = document.createElement('div');
    slideWrapper.className = 'carousel__slide';

    const card = document.createElement('article');
    card.className = 'carousel__card';
    moveInstrumentation(row, card);

    // Category badge — colour driven by iconVariant
    if (categoryText) {
      const catMod = VARIANT_TO_CATEGORY[iconVariant] || 'capability';
      const catEl = document.createElement('span');
      catEl.className = `card-category card-category--${catMod}`;
      catEl.textContent = categoryText;
      if (cells[2]) moveInstrumentation(cells[2], catEl);
      card.append(catEl);
    }

    // Icon box with SVG
    const svg = SVGS[iconKey];
    if (svg) {
      const iconBox = document.createElement('div');
      iconBox.className = `card-icon icon-box--${iconVariant}`;
      iconBox.setAttribute('aria-hidden', 'true');
      iconBox.innerHTML = svg;
      if (cells[0]) moveInstrumentation(cells[0], iconBox);
      card.append(iconBox);
    }

    // Hidden span so UE can edit iconVariant independently
    if (cells[1]) {
      const variantEl = document.createElement('span');
      variantEl.hidden = true;
      moveInstrumentation(cells[1], variantEl);
      card.append(variantEl);
    }

    // Card title
    if (titleText) {
      const h3 = document.createElement('h3');
      h3.className = 'card-title';
      h3.textContent = titleText;
      if (cells[3]) moveInstrumentation(cells[3], h3);
      card.append(h3);
    }

    // Richtext content: first <p> → card-description, <ul> → card-points
    if (textContent) {
      const textDiv = document.createElement('div');
      textDiv.className = 'card-text';
      textDiv.innerHTML = textContent;
      const firstP = textDiv.querySelector('p');
      if (firstP) firstP.className = 'card-description';
      textDiv.querySelectorAll('ul').forEach((ul) => {
        ul.className = 'card-points';
        ul.setAttribute('role', 'list');
      });
      textDiv.querySelectorAll('li').forEach((li) => { li.className = 'cp-item'; });
      if (cells[4]) moveInstrumentation(cells[4], textDiv);
      card.append(textDiv);
    }

    // CTA link
    const link = document.createElement('a');
    link.className = 'card-cta';
    link.href = ctaHref;
    link.innerHTML = `${ctaText || 'Explore'} <span aria-hidden="true">→</span>`;
    if (cells[6]) moveInstrumentation(cells[6], link);
    else if (cells[5]) moveInstrumentation(cells[5], link);
    card.append(link);

    // Hidden ctaText span so UE can edit label independently from the URL
    if (cells[5] && cells[6]) {
      const ctaLabelEl = document.createElement('span');
      ctaLabelEl.hidden = true;
      moveInstrumentation(cells[5], ctaLabelEl);
      card.append(ctaLabelEl);
    }

    slideWrapper.append(card);
    row.remove();
    slideWrappers.push(slideWrapper);
    track.append(slideWrapper);
  });

  // Controls
  const controls = document.createElement('div');
  controls.className = 'carousel__controls';

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'carousel__btn';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.textContent = '←';

  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel__dots';
  dotsContainer.setAttribute('role', 'tablist');
  dotsContainer.setAttribute('aria-label', 'Slide indicators');

  const counter = document.createElement('span');
  counter.className = 'carousel__counter';
  counter.setAttribute('aria-live', 'polite');

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'carousel__btn';
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.textContent = '→';

  controls.append(prevBtn, dotsContainer, counter, nextBtn);
  fragment.append(trackWrapper, controls);
  block.replaceChildren(fragment);

  // ── Carousel state ────────────────────────────────────────────────────────
  let currentIndex = 0;

  function updateCarousel() {
    if (slideWrappers.length === 0) return;
    const slideWidth = slideWrappers[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * (slideWidth + 24)}px)`;
    [...dotsContainer.children].forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
      dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
    });
    counter.textContent = `${currentIndex + 1} / ${slideWrappers.length}`;
  }

  function goToSlide(index) {
    currentIndex = (index + slideWrappers.length) % slideWrappers.length;
    updateCarousel();
  }

  slideWrappers.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel__dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.setAttribute('aria-selected', 'false');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.append(dot);
  });

  prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

  // Skip resize listener in UE iframe — panel opening resizes the iframe
  // and would cause the track to visually jump on every edit.
  let inEditor = false;
  try { inEditor = window.self !== window.top; } catch (e) { inEditor = true; }
  if (!inEditor) window.addEventListener('resize', updateCarousel);

  updateCarousel();
}
