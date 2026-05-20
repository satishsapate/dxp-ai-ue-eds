import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Build slide wrappers from XWalk rows
  // Row cells: 0=category, 1=title, 2=content(richtext), 3=ctaUrl, 4=ctaText
  const slideWrappers = rows.map((row) => {
    const cells = [...row.children];

    const slideWrapper = document.createElement('div');
    slideWrapper.className = 'carousel__slide';

    const card = document.createElement('article');
    card.className = 'carousel__card';
    moveInstrumentation(row, card);
    slideWrapper.append(card);

    if (cells[0]) {
      const category = document.createElement('span');
      category.className = 'card-category';
      category.textContent = cells[0].textContent.trim();
      card.append(category);
    }

    if (cells[1]) {
      const title = document.createElement('h3');
      title.className = 'card-title';
      title.textContent = cells[1].textContent.trim();
      card.append(title);
    }

    if (cells[2]) {
      const textDiv = document.createElement('div');
      textDiv.className = 'card-text';
      textDiv.innerHTML = cells[2].innerHTML;
      // Style any lists as card-points
      textDiv.querySelectorAll('ul').forEach((ul) => ul.classList.add('card-points'));
      textDiv.querySelectorAll('li').forEach((li) => li.classList.add('cp-item'));
      card.append(textDiv);
    }

    // ctaUrl (cells[3]) + ctaText (cells[4])
    const ctaLink = cells[3]?.querySelector('a');
    const ctaText = cells[4]?.textContent.trim();
    if (ctaText || ctaLink) {
      const link = ctaLink || document.createElement('a');
      link.className = 'card-cta';
      if (ctaText) link.textContent = `${ctaText} →`;
      else if (!link.textContent.trim()) link.textContent = 'Explore →';
      card.append(link);
    }

    row.remove();
    return slideWrapper;
  });

  // Build carousel DOM
  const trackWrapper = document.createElement('div');
  trackWrapper.className = 'carousel__track-wrapper';

  const track = document.createElement('div');
  track.className = 'carousel__track';
  slideWrappers.forEach((sw) => track.append(sw));
  trackWrapper.append(track);

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
  block.replaceChildren(trackWrapper, controls);

  // Carousel logic
  let currentIndex = 0;

  function updateCarousel() {
    const slideWidth = slideWrappers[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * (slideWidth + 24)}px)`;
    [...dotsContainer.children].forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
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
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.append(dot);
  });

  prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  window.addEventListener('resize', updateCarousel);
  updateCarousel();
}
