import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Build slide elements from XWalk rows
  // Row cells: 0=category, 1=title, 2=content, 3=ctaUrl/ctaText
  const slides = rows.map((row) => {
    const cells = [...row.children];

    const slide = document.createElement('article');
    slide.className = 'carousel__slide';
    moveInstrumentation(row, slide);

    if (cells[0]) {
      const category = document.createElement('span');
      category.className = 'card-category';
      category.textContent = cells[0].textContent.trim();
      moveInstrumentation(cells[0], category);
      slide.append(category);
    }

    if (cells[1]) {
      const title = document.createElement('h3');
      title.textContent = cells[1].textContent.trim();
      moveInstrumentation(cells[1], title);
      slide.append(title);
    }

    if (cells[2]) {
      const text = document.createElement('div');
      text.className = 'card-text';
      text.innerHTML = cells[2].innerHTML;
      moveInstrumentation(cells[2], text);
      slide.append(text);
    }

    if (cells[3]) {
      const link = cells[3].querySelector('a') || document.createElement('a');
      link.className = 'card-cta';
      if (!link.href && cells[3].textContent.trim()) link.textContent = cells[3].textContent.trim();
      moveInstrumentation(cells[3], link);
      slide.append(link);
    }

    row.remove();
    return slide;
  });

  // Build carousel DOM
  const trackWrapper = document.createElement('div');
  trackWrapper.className = 'carousel__track-wrapper';

  const track = document.createElement('div');
  track.className = 'carousel__track';
  slides.forEach((slide) => track.append(slide));
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

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'carousel__btn';
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.textContent = '→';

  controls.append(prevBtn, dotsContainer, nextBtn);
  block.replaceChildren(trackWrapper, controls);

  // Carousel logic
  let currentIndex = 0;

  function updateCarousel() {
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * (slideWidth + 24)}px)`;
    [...dotsContainer.children].forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
  }

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    updateCarousel();
  }

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel__dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.append(dot);
  });

  prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  window.addEventListener('resize', updateCarousel);
  updateCarousel();
}
