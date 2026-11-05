import { projectStories } from '../data/projects.js';
import { mountSalonJourney } from './salon-journey.js';

export function initProjectDialog({ root = document, stories = projectStories } = {}) {
  const dialog = root.querySelector('#case-dialog');
  if (!dialog) return () => {};

  const controller = new AbortController();
  const options = { signal: controller.signal };
  const body = dialog.ownerDocument.body;
  let opener;
  let disposeJourney = () => {};

  function restorePage() {
    disposeJourney();
    disposeJourney = () => {};
    dialog.classList.remove('case-dialog--salon');
    body.classList.remove('dialog-open');
    opener?.focus({ preventScroll: true });
  }

  function closeDialog() {
    if (dialog.open) dialog.close();
  }

  root.querySelectorAll('[data-case]').forEach((button) => {
    button.addEventListener(
      'click',
      () => {
        const story = stories[button.dataset.case];
        if (!story) return;
        disposeJourney();
        disposeJourney = () => {};
        dialog.classList.toggle('case-dialog--salon', button.dataset.case === 'chlpac');
        opener = button;
        dialog.querySelector('#case-category').textContent = story.category;
        dialog.querySelector('#case-title').textContent = story.title;
        dialog.querySelector('#case-intro').textContent = story.intro;

        const sections = story.sections.map(([title, description]) => {
          const section = document.createElement('section');
          section.className = 'case-section';
          const heading = document.createElement('h3');
          heading.textContent = title;
          const paragraph = document.createElement('p');
          paragraph.textContent = description;
          section.append(heading, paragraph);
          return section;
        });
        dialog.querySelector('#case-details').replaceChildren(...sections);
        body.classList.add('dialog-open');
        if (!dialog.open) dialog.showModal();
        if (button.dataset.case === 'chlpac') {
          disposeJourney = mountSalonJourney(dialog.querySelector('#case-details'));
        }
        dialog.scrollTop = 0;
      },
      options,
    );
  });

  dialog.querySelectorAll('.dialog-close, .dialog-done').forEach((button) => {
    button.addEventListener('click', closeDialog, options);
  });
  dialog.addEventListener(
    'cancel',
    (event) => {
      event.preventDefault();
      closeDialog();
    },
    options,
  );
  dialog.addEventListener('close', restorePage, options);
  dialog.addEventListener(
    'click',
    (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      const outside =
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom;
      if (outside) closeDialog();
    },
    options,
  );

  return () => {
    closeDialog();
    controller.abort();
    restorePage();
  };
}
