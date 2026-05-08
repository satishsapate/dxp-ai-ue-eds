export default function decorate(block) {
  const items = [...block.querySelectorAll('[data-accordion-item]')];

  items.forEach((item) => {
    const header = item.querySelector('[data-accordion-trigger]');
    const body = item.querySelector('.accordion-body');
    const icon = item.querySelector('.accordion-icon');

    if (!header || !body) {
      return;
    }

    const toggleItem = () => {
      const isOpen = item.classList.toggle('open');
      body.hidden = !isOpen;
      header.setAttribute('aria-expanded', String(isOpen));
      icon.textContent = isOpen ? '−' : '+';
    };

    header.addEventListener('click', toggleItem);
    header.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleItem();
      }
    });

    if (header.getAttribute('aria-expanded') === 'true') {
      item.classList.add('open');
      body.hidden = false;
      icon.textContent = '−';
    } else {
      body.hidden = true;
      icon.textContent = '+';
    }
  });
}
