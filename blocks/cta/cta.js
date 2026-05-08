export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length === 0) return;

  // Wrap content in semantic structure if not already wrapped
  const wrapper = document.createElement('div');
  wrapper.className = 'cta-content';

  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => wrapper.append(cell));
    row.remove();
  });

  block.append(wrapper);

  // Ensure buttons get proper classes
  wrapper.querySelectorAll('a').forEach((link, index) => {
    link.classList.add('btn');
    if (index === 0) link.classList.add('btn--primary');
    else link.classList.add('btn--secondary');
  });

  // Group buttons into container if multiple exist
  const links = wrapper.querySelectorAll('a.btn');
  if (links.length > 1) {
    const btnGroup = document.createElement('div');
    btnGroup.className = 'cta-buttons';
    links[0].parentElement.insertBefore(btnGroup, links[0]);
    links.forEach((link) => btnGroup.append(link));
  }
}
