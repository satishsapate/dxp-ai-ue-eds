export default function decorate(block) {
  // Richtext block: content is authored as rich HTML via Universal Editor.
  // Wrap first child as main content column, remaining as sidebar if present.
  const rows = [...block.children];

  if (rows.length < 2) return;

  const layout = document.createElement('div');
  layout.className = 'richtext-layout';

  const main = document.createElement('div');
  main.className = 'rt-body';
  main.append(...rows[0].children);

  const sidebar = document.createElement('div');
  sidebar.className = 'rt-sidebar';
  sidebar.append(...rows[1].children);

  layout.append(main, sidebar);
  block.replaceChildren(layout);
}
