import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // XWalk one-row-per-field pattern:
  //   rows[0] = homeUrl  (aem-content — produces an <a> element)
  //   rows[1] = homeText (text label for the home link)
  //   rows[2] = currentText (current page label)
  const homeUrlCell = rows[0]?.children[0];
  const homeTextCell = rows[1]?.children[0];
  const currentTextCell = rows[2]?.children[0];

  const homeHref = homeUrlCell?.querySelector('a')?.href || homeUrlCell?.textContent.trim() || '/';
  const homeText = homeTextCell?.textContent.trim() || 'Home';
  const currentText = currentTextCell?.textContent.trim() || '';

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb navigation');

  const ol = document.createElement('ol');
  ol.className = 'breadcrumb-list';

  const homeLi = document.createElement('li');
  const homeLink = document.createElement('a');
  homeLink.href = homeHref;
  homeLink.textContent = homeText;
  if (homeUrlCell) moveInstrumentation(homeUrlCell, homeLink);
  if (homeTextCell) moveInstrumentation(homeTextCell, homeLink);
  homeLi.append(homeLink);

  const sepLi = document.createElement('li');
  const sep = document.createElement('span');
  sep.setAttribute('aria-hidden', 'true');
  sep.textContent = '›';
  sepLi.append(sep);

  const currentLi = document.createElement('li');
  currentLi.setAttribute('aria-current', 'page');
  currentLi.textContent = currentText;
  if (currentTextCell) moveInstrumentation(currentTextCell, currentLi);

  ol.append(homeLi, sepLi, currentLi);
  nav.append(ol);

  rows.forEach((row) => row.remove());
  block.replaceChildren(nav);
}
