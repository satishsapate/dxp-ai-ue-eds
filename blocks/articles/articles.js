export default function decorate(block) {
  const button = block.querySelector('button');
  if (button) {
    button.addEventListener('click', () => {
      const input = block.querySelector('input[type="email"]');
      if (input && input.value) {
        input.value = '';
      }
    });
  }
}
