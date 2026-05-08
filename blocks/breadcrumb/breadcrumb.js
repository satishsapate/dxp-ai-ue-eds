export default function decorate(block) {
  const current = block.querySelector('[aria-current="page"]');
  if (current) {
    current.classList.add('breadcrumb-current');
  }
}
