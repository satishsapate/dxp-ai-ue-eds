import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length === 0) return;

  // Hero model: image (reference), imageAlt (text), text (richtext)
  // EDS row structure: row0=[image cell, text cell] or row0=[image], row1=[text]
  let imageCell;
  let textCell;

  if (rows.length === 1) {
    const cells = [...rows[0].children];
    [imageCell, textCell] = cells;
    rows[0].remove();
  } else {
    ([imageCell] = rows[0].children);
    ([textCell] = rows[1]?.children ?? []);
    rows.forEach((row) => row.remove());
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'hero-wrapper';

  if (imageCell) {
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'hero-image';
    moveInstrumentation(imageCell, imageWrapper);

    const pic = imageCell.querySelector('picture');
    if (pic) {
      const img = pic.querySelector('img');
      if (img) {
        const optimized = createOptimizedPicture(img.src, img.alt, true, [
          { media: '(min-width: 600px)', width: '2000' },
          { width: '750' },
        ]);
        moveInstrumentation(img, optimized.querySelector('img'));
        pic.replaceWith(optimized);
      }
      imageWrapper.append(pic.closest('picture') || pic);
    }

    wrapper.append(imageWrapper);
  }

  if (textCell) {
    const textWrapper = document.createElement('div');
    textWrapper.className = 'hero-content';
    moveInstrumentation(textCell, textWrapper);
    textWrapper.append(...textCell.childNodes);
    wrapper.append(textWrapper);
  }

  block.append(wrapper);
}
