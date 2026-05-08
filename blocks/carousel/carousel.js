export default function decorate(block) {
  const track = block.querySelector('[data-carousel-track]');
  const slides = Array.from(block.querySelectorAll('[data-slide]'));
  const prevButton = block.querySelector('[data-carousel-prev]');
  const nextButton = block.querySelector('[data-carousel-next]');
  const dotsContainer = block.querySelector('.carousel__dots');

  if (!track || slides.length === 0 || !dotsContainer) {
    return;
  }

  let currentIndex = 0;
  let dots = [];

  function updateCarousel() {
    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = 24;
    track.style.transform = `translateX(-${currentIndex * (slideWidth + gap)}px)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    if (currentIndex < 0) {
      currentIndex = slides.length - 1;
    }
    if (currentIndex >= slides.length) {
      currentIndex = 0;
    }
    updateCarousel();
  }

  dots = slides.map((_, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'carousel__dot';
    button.setAttribute('aria-label', `Go to slide ${index + 1}`);
    button.addEventListener('click', () => goToSlide(index));
    dotsContainer.append(button);
    return button;
  });

  prevButton?.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextButton?.addEventListener('click', () => goToSlide(currentIndex + 1));
  window.addEventListener('resize', updateCarousel);
  updateCarousel();
}
