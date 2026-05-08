export default function decorate(block) {
  // Section Dark: dark-background content section.
  // Content is authored as rich HTML; decorate adds semantic wrapper.
  const rows = [...block.children];
  if (rows.length === 0) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'section-dark-content';
  rows.forEach((row) => {
    [...row.children].forEach((cell) => wrapper.append(cell));
    row.remove();
  });

  block.append(wrapper);
}
