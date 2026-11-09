import { gsap } from 'gsap';
import { findProject, projectsInGroup, portfolioProjects } from '../data/portfolio-projects.js';
import { initScrollStories } from './scroll-stories.js';

const escapeHTML = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  );
const lines = (value) => value.map(escapeHTML).join('<br>');
const groupAnchor = (group) => (group === 'webs' ? '#projekty' : '#granty');
const icons = { corinex: '✳', camp: '⌂', library: '▥', agenda: '↗' };

export function quotesScene() {
  return `<div class="scene-space quotes-scene" aria-hidden="true"><div class="scene-orbit orbit-a"></div><span class="scene-spark spark-a">✳</span><div class="scene-ground"></div>
    <div class="quote-input" data-part="input"><span>JEDNA ZÁKAZKA</span><strong>Spoločný základ.</strong><div><b>Zákazník</b><i>Modelová zákazka</i><b>Predmet</b><i>Ukážkové zadanie</i><b>Položky</b><i>Údaje pre dokumenty</i></div><small>Ilustračné údaje</small></div>
    <div class="quote-sheet quote-offer" data-part="offer"><span>01 / CENOVÁ PONUKA</span><strong>Príprava<br>zákazky.</strong><i></i><i></i><i></i><b>Spoločné údaje ↗</b></div>
    <div class="quote-sheet quote-order" data-part="order"><span>02 / ZÁKAZKOVÝ LIST</span><strong>Podklady<br>pre realizáciu.</strong><i></i><i></i><i></i><b>Tá istá zákazka ↗</b></div>
    <div class="quote-sheet quote-handover" data-part="handover"><span>03 / PREBERACÍ PROTOKOL</span><strong>Odovzdanie<br>práce.</strong><i></i><i></i><i></i><b>Nadväzujúci dokument ↗</b></div>
    <div class="quote-domain" data-part="quote-domain"><span>ZVEREJNENÝ PRODUKT</span><strong>Zákazko.sk ↗</strong></div></div>`;
}

function referenceCover(project) {
  const workflow = project.cover === 'agenda';
  const summary = workflow
    ? '<div class="cover-workflow-path"><span>01 / Zámer</span><span>02 / Príprava</span><span>03 / Implementácia</span></div>'
    : `<div><b>${escapeHTML(project.amount)}</b><small>${escapeHTML(project.evidence)}</small></div><i></i><i></i>`;
  return `<div class="reference-cover cover-${escapeHTML(project.cover)}" aria-hidden="true"><div class="cover-orbit"></div><span class="cover-symbol">${icons[project.cover]}</span><div class="cover-reference-paper"><span>${escapeHTML(project.kind.split(' · ')[0])}</span><strong>${lines(project.title)}</strong>${summary}</div><span class="cover-label">${workflow ? 'Ako pracujem' : 'Projektová referencia'}</span></div>`;
}

export function artwork(project, root) {
  const wrapper = document.createElement('div');
  wrapper.className = 'gallery-preview';
  if (project.cover === 'salon') {
    wrapper.append(
      root.querySelector('#salon-template').content.querySelector('.web-scene').cloneNode(true),
    );
  } else if (project.cover === 'quotes') wrapper.innerHTML = quotesScene();
  else wrapper.innerHTML = referenceCover(project);
  return wrapper;
}

function storySteps(project) {
  return `<div class="story-steps">${project.steps.map((step, i) => `<article class="story-step" id="${project.id}-step-${i}" data-story-step><div><p class="step-kicker">0${i + 1} / ${escapeHTML(step.label)}</p><h3>${lines(step.title)}</h3><p>${escapeHTML(step.text)}</p><ul class="step-tags">${step.tags.map((tag) => `<li>${escapeHTML(tag)}</li>`).join('')}</ul>${step.action && project.url ? `<a class="button story-button" href="${escapeHTML(project.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(project.linkLabel)} <span>↗</span></a>` : ''}</div></article>`).join('')}</div>`;
}

function storyIndex(project) {
  return `<div class="story-stage-footer"><p>${escapeHTML(project.name)}<span>Ilustrovaný priebeh · posúvaj nadol</span></p><div class="story-progress" aria-hidden="true"><i></i></div><nav class="story-index" aria-label="Kroky projektu ${escapeHTML(project.name)}">${project.steps.map((step, i) => `<a href="#${project.id}-step-${i}" aria-label="${escapeHTML(step.label)}">0${i + 1}</a>`).join('')}</nav></div>`;
}

export function buildProjectContent(project, root = document) {
  let chapter;
  if (project.template === 'quotes') {
    chapter = document.createElement('section');
    chapter.className = 'story-chapter chapter-web section-pad';
    chapter.dataset.story = 'quotes';
    chapter.innerHTML = `<div class="section-kicker"><span>Vlastný produkt</span><span>Posúvaj nadol ↓</span></div><div class="chapter-heading"><h2 id="case-title">Zákazko.sk</h2><div><p>${escapeHTML(project.summary)}</p><a class="chapter-link" href="https://zakazko.sk/" target="_blank" rel="noopener noreferrer">Vyskúšať produkt <span>↗</span></a></div></div><div class="story-layout"><div class="story-stage web-stage">${quotesScene()}${storyIndex(project)}</div>${storySteps(project)}</div>`;
  } else {
    const template = root.querySelector(
      project.template === 'salon' ? '#salon-template' : '#agenda-template',
    );
    chapter = template.content.firstElementChild.cloneNode(true);
    chapter.id = `case-${project.id}`;
    chapter.querySelector('#case-title').innerHTML = lines(project.title);
    chapter.querySelector('.section-kicker span').textContent = project.kind;
    chapter.querySelector('.section-kicker span:last-child').textContent = 'Posúvaj nadol ↓';
    if (project.template === 'reference') {
      chapter.dataset.story = 'reference';
      chapter.dataset.hasBudget = String(Boolean(project.budget));
      chapter.querySelector('.chapter-heading>div').innerHTML =
        `<p>${escapeHTML(project.summary)}</p>${project.url ? `<a class="chapter-link" href="${escapeHTML(project.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(project.linkLabel)} <span>↗</span></a>` : `<p class="case-evidence">${escapeHTML(project.evidence)}</p>`}`;
      chapter.querySelector('.story-steps').outerHTML = storySteps(project);
      chapter.querySelector('.story-stage-footer').outerHTML = storyIndex(project);
      chapter
        .querySelectorAll('.reference-heading,.grant-list,.grant-note')
        .forEach((el) => el.remove());
      chapter.querySelector('.input-need strong').textContent = project.name;
      chapter.querySelector('.input-call strong').textContent = project.status;
      chapter.querySelector('.input-call>span').textContent = 'DOLOŽENÝ STAV';
      chapter.querySelector('.grant-document strong').innerHTML = 'Moja úloha<br>v projekte.';
      chapter.querySelector('.grant-document>span').textContent = 'PROJEKTOVÉ PODKLADY';
      chapter.querySelector('.grant-proof').innerHTML =
        `<span>DOLOŽENÝ STAV PODPORY</span><div><i>${icons[project.cover]}</i><b>${escapeHTML(project.name)}<small>${escapeHTML(project.kind.split(' · ')[0])}</small></b></div><strong class="case-support-amount">${escapeHTML(project.amount)}</strong><p class="case-support-status">${escapeHTML(project.status)}</p><p>${escapeHTML(project.evidence)}</p><p>Podpora patrí prijímateľovi. Tímová práca CASSIS Consult.</p>`;
    }
  }
  chapter.setAttribute('aria-labelledby', 'case-title');
  if (project.sourceNote) {
    const note = document.createElement('p');
    note.className = 'case-source-note';
    note.textContent = project.sourceNote;
    chapter.querySelector('.chapter-heading > div').append(note);
  }
  chapter.querySelector('#case-title').tabIndex = -1;
  // Project category is supporting metadata, placed after the title rather than above it.
  const metadata = chapter.querySelector('.section-kicker');
  metadata.classList.add('case-category');
  chapter.querySelectorAll('.eyebrow').forEach((label) => {
    const heading = label.nextElementSibling;
    if (heading?.matches('h2,h3')) heading.after(label);
  });
  const hint = document.createElement('p');
  hint.className = 'case-reading-hint';
  hint.textContent = 'Čítaj nadol. Projekty prepínaj šípkami alebo potiahnutím do strán.';
  chapter.querySelector('.chapter-heading').after(metadata, hint);
  return chapter;
}

// Horizontal gestures are limited to visual surfaces; vertical movement remains native.
export function bindProjectSwipe(element, onSwipe, signal, accepts = () => true) {
  let start;
  element.addEventListener(
    'pointerdown',
    (event) => {
      if (
        event.button !== 0 ||
        event.target.closest('a,button,input,textarea,select') ||
        !accepts(event.target)
      )
        return;
      start = { x: event.clientX, y: event.clientY, id: event.pointerId };
    },
    { signal },
  );
  element.addEventListener(
    'pointerup',
    (event) => {
      if (!start || event.pointerId !== start.id) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      start = null;
      if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.5) onSwipe(dx < 0 ? 1 : -1);
    },
    { signal },
  );
  element.addEventListener(
    'pointercancel',
    () => {
      start = null;
    },
    { signal },
  );
}

const legacyRoutes = {
  'web-zadanie': 'stylovy-chlpac',
  'web-podoba': 'stylovy-chlpac',
  'web-system': 'stylovy-chlpac',
  'web-prevadzka': 'stylovy-chlpac',
  'web-spustenie': 'stylovy-chlpac',
  'grant-zamer': 'eurofondova-agenda',
  'grant-priprava': 'eurofondova-agenda',
  'grant-implementacia': 'eurofondova-agenda',
  'grant-skusenost': 'eurofondova-agenda',
  zakazko: 'zakazko',
};

export function initProjectBrowser({
  root = document,
  animate = true,
  mountStories = initScrollStories,
} = {}) {
  const dialog = root.querySelector('#project-viewer');
  if (!dialog) return () => {};
  const scroller = dialog.querySelector('.case-scroll');
  const page = dialog.querySelector('.case-page');
  const content = dialog.querySelector('.case-content');
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const selections = new Map([
    ['webs', 'stylovy-chlpac'],
    ['grants', 'corinex'],
  ]);
  const galleries = [...root.querySelectorAll('[data-project-group]')];
  let current;
  let opener;
  let disposeStory = () => {};
  let transition;
  let oldOverflow;
  let oldRootOverflow;
  let waitingForBack = false;
  let queuedOpen;
  let returnScroll = 0;
  const continuous = Boolean(root.querySelector('.boundary-journey'));
  const viewerProjects = (group) => (continuous ? portfolioProjects : projectsInGroup(group));

  function moveGallery(group, delta) {
    const projects = projectsInGroup(group);
    const index = projects.findIndex((p) => p.id === selections.get(group));
    renderGallery(group, projects[(index + delta + projects.length) % projects.length].id, delta);
  }

  function renderGallery(group, id, direction = 0) {
    const gallery = galleries.find((el) => el.dataset.projectGroup === group);
    if (!gallery) return;
    const project = findProject(id);
    selections.set(group, id);
    const card = gallery.querySelector('[data-gallery-card]');
    const projects = projectsInGroup(group);
    const number = projects.findIndex((p) => p.id === id) + 1;
    const article = document.createElement('article');
    article.className = 'gallery-project';
    article.setAttribute('role', 'group');
    article.setAttribute('aria-roledescription', 'projekt');
    article.setAttribute('aria-label', `${project.name}, ${number} z ${projects.length}`);
    article.innerHTML = `<div class="gallery-description"><h3>${escapeHTML(project.name)}</h3><p class="eyebrow">${escapeHTML(project.kind)}</p><p>${escapeHTML(project.summary)}</p><span class="gallery-status">${escapeHTML(project.status)}</span><div class="gallery-actions"><a href="#projekt/${project.id}" class="button gallery-open">Prejsť projekt <span>→</span></a>${project.url ? `<a href="${escapeHTML(project.url)}" class="gallery-external" target="_blank" rel="noopener noreferrer">${project.group === 'webs' ? 'Živý web' : 'Verejný zdroj'} ↗</a>` : ''}</div></div>`;
    const preview = artwork(project, root);
    preview.setAttribute('data-gallery-swipe', '');
    article.prepend(preview);
    card.replaceChildren(article);
    gallery.querySelector('[data-gallery-counter]').textContent =
      `${String(number).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`;
    gallery
      .querySelectorAll('[data-gallery-choice]')
      .forEach((button) =>
        button.setAttribute('aria-pressed', String(button.dataset.galleryChoice === id)),
      );
    if (animate && direction)
      gsap.fromTo(
        article,
        { opacity: 0.3, x: direction * 30 },
        { opacity: 1, x: 0, duration: 0.4, clearProps: 'opacity,transform', ease: 'power3.out' },
      );
  }

  for (const gallery of galleries) {
    const group = gallery.dataset.projectGroup;
    gallery.querySelector('[data-gallery-selection]').innerHTML = projectsInGroup(group)
      .map(
        (project) =>
          `<button type="button" data-gallery-choice="${project.id}" aria-pressed="false">${escapeHTML(project.name)}</button>`,
      )
      .join('');
    gallery.querySelector('[data-gallery-card]').setAttribute('aria-live', 'polite');
    renderGallery(group, selections.get(group));
    bindProjectSwipe(
      gallery,
      (direction) => moveGallery(group, direction),
      controller.signal,
      (target) => Boolean(target.closest('[data-gallery-swipe]')),
    );
  }

  function cleanupViewer() {
    if (!current && !dialog.open) return;
    const previous = current;
    current = null;
    transition?.kill();
    disposeStory();
    disposeStory = () => {};
    if (dialog.open) dialog.close();
    content.replaceChildren();
    document.body.style.overflow = oldOverflow ?? '';
    document.documentElement.style.overflow = oldRootOverflow ?? '';
    document.body.classList.remove('project-viewer-open');
    const returnTo = opener?.isConnected
      ? opener
      : root.querySelector(
          continuous
            ? `#stop-${previous?.id} .fragment-title-link`
            : `[data-project-group="${previous?.group || 'webs'}"] .gallery-open`,
        );
    returnTo?.focus({ preventScroll: true });
    if (continuous) window.scrollTo({ top: returnScroll, behavior: 'instant' });
  }

  function closeViewer() {
    if (!current) return;
    const group = current.group;
    const pushed = window.history.state?.portfolioViewerEntry === true;
    waitingForBack = pushed;
    cleanupViewer();
    if (pushed) window.history.back();
    else {
      const destination = continuous
        ? `#stop-${group === 'webs' ? 'stylovy-chlpac' : 'corinex'}`
        : groupAnchor(group);
      window.history.replaceState(null, '', destination);
      if (!continuous) root.querySelector(destination)?.scrollIntoView?.({ block: 'start' });
    }
  }

  function openProject(id, { push = false, direction = 1, legacyStep } = {}) {
    if (waitingForBack) {
      queuedOpen = { id, push, direction, legacyStep };
      return;
    }
    const project = findProject(id);
    if (!project) return;
    const routeStatus = root.querySelector('#project-route-status');
    if (routeStatus) routeStatus.hidden = true;
    const wasOpen = dialog.open;
    const keepControlFocus =
      wasOpen &&
      dialog.contains(document.activeElement) &&
      !content.contains(document.activeElement);
    if (wasOpen && current?.id === id) {
      if (legacyStep)
        content.querySelector(`[id="${legacyStep}"]`)?.scrollIntoView({ block: 'start' });
      return;
    }
    if (push) window.history.pushState({ portfolioViewerEntry: true }, '', `#projekt/${id}`);
    else if (window.location.hash !== `#projekt/${id}`)
      window.history.replaceState(window.history.state, '', `#projekt/${id}`);
    disposeStory();
    transition?.kill();
    current = project;
    renderGallery(project.group, id);
    content.replaceChildren(buildProjectContent(project, root));
    dialog.dataset.project = id;
    dialog.dataset.group = project.group;
    dialog.querySelector('[data-case-name]').textContent = project.name;
    const projects = viewerProjects(project.group);
    const index = projects.findIndex((p) => p.id === id);
    dialog.querySelector('[data-case-counter]').textContent = `${index + 1} / ${projects.length}`;
    const next = projects[(index + 1) % projects.length];
    dialog.querySelector('.case-next-large').innerHTML = `${escapeHTML(next.name)} <span>→</span>`;
    dialog
      .querySelector('[data-case-prev]')
      .setAttribute(
        'aria-label',
        `Predchádzajúci projekt: ${projects[(index - 1 + projects.length) % projects.length].name}`,
      );
    dialog
      .querySelector('.case-switch [data-case-next]')
      .setAttribute('aria-label', `Ďalší projekt: ${next.name}`);
    if (!wasOpen) {
      returnScroll = window.scrollY;
      oldOverflow = document.body.style.overflow;
      oldRootOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.classList.add('project-viewer-open');
      dialog.showModal();
    }
    scroller.scrollTop = 0;
    disposeStory = mountStories({ root: content, scroller });
    const announcement = dialog.querySelector('[data-case-announcement]');
    if (announcement)
      announcement.textContent = `${project.name}. Projekt ${index + 1} zo ${projects.length}.`;
    if (!keepControlFocus) content.querySelector('#case-title').focus({ preventScroll: true });
    if (animate)
      transition = gsap.fromTo(
        page,
        { xPercent: direction * (wasOpen ? 7 : 35), opacity: 0 },
        {
          xPercent: 0,
          opacity: 1,
          duration: wasOpen ? 0.45 : 0.6,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
        },
      );
    if (legacyStep)
      content.querySelector(`[id="${legacyStep}"]`)?.scrollIntoView({ block: 'start' });
  }

  function moveProject(delta) {
    if (!current) return;
    const projects = viewerProjects(current.group);
    const index = projects.findIndex((p) => p.id === current.id);
    openProject(projects[(index + delta + projects.length) % projects.length].id, {
      direction: delta,
    });
  }

  function syncRoute() {
    const routeStatus = root.querySelector('#project-route-status');
    let hash;
    try {
      hash = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      invalidProjectRoute();
      return;
    }
    if (routeStatus && hash !== 'projekty') routeStatus.hidden = true;
    if (hash.startsWith('projekt/') && findProject(hash.slice(8))) openProject(hash.slice(8));
    else if (hash.startsWith('projekt/')) invalidProjectRoute();
    else if (legacyRoutes[hash]) openProject(legacyRoutes[hash], { legacyStep: hash });
    else cleanupViewer();
  }

  function invalidProjectRoute() {
    cleanupViewer();
    window.history.replaceState(null, '', '#projekty');
    const status = root.querySelector('#project-route-status');
    if (status) {
      status.hidden = false;
      status.focus({ preventScroll: true });
    }
    root.querySelector('#projekty')?.scrollIntoView?.({ block: 'start' });
  }

  root.addEventListener(
    'click',
    (event) => {
      const target = event.target.closest('button,a');
      if (!target || event.defaultPrevented) return;
      if (
        target.matches('a') &&
        (event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          target.target === '_blank' ||
          target.hasAttribute('download'))
      )
        return;
      const gallery = target.closest('[data-project-group]');
      if (target.matches('[data-gallery-choice]'))
        renderGallery(gallery.dataset.projectGroup, target.dataset.galleryChoice, 1);
      else if (target.matches('[data-gallery-prev],[data-gallery-next]'))
        moveGallery(gallery.dataset.projectGroup, target.matches('[data-gallery-next]') ? 1 : -1);
      else if (target.matches('[data-case-close]')) closeViewer();
      else if (target.matches('[data-case-prev],[data-case-next]'))
        moveProject(target.matches('[data-case-next]') ? 1 : -1);
      else if (target.matches('[data-salon-view]')) {
        const showcase = target.closest('.case-showcase');
        showcase
          .querySelectorAll('[data-salon-view]')
          .forEach((button) => button.setAttribute('aria-pressed', String(button === target)));
        showcase.querySelectorAll('[data-salon-panel]').forEach((panel) => {
          panel.hidden = panel.dataset.salonPanel !== target.dataset.salonView;
        });
      } else if (target.matches('a[href^="#projekt/"]')) {
        event.preventDefault();
        opener = target;
        openProject(target.getAttribute('href').slice(9), { push: true });
      } else if (dialog.contains(target) && target.matches('a[href^="#"]')) {
        const anchor = content.querySelector(`[id="${target.getAttribute('href').slice(1)}"]`);
        if (anchor) {
          event.preventDefault();
          anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    },
    options,
  );
  root.addEventListener(
    'keydown',
    (event) => {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.target.matches('input,textarea,select,[contenteditable]')
      )
        return;
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      if (dialog.open) {
        event.preventDefault();
        moveProject(direction);
      } else if (event.target.closest('[data-project-group]')) {
        event.preventDefault();
        moveGallery(event.target.closest('[data-project-group]').dataset.projectGroup, direction);
      }
    },
    options,
  );
  dialog.addEventListener(
    'cancel',
    (event) => {
      event.preventDefault();
      closeViewer();
    },
    options,
  );
  dialog.addEventListener(
    'close',
    () => {
      if (!dialog.open) cleanupViewer();
    },
    options,
  );
  window.addEventListener(
    'popstate',
    () => {
      waitingForBack = false;
      const next = queuedOpen;
      queuedOpen = null;
      syncRoute();
      if (next) openProject(next.id, next);
    },
    options,
  );
  window.addEventListener('hashchange', syncRoute, options);
  bindProjectSwipe(scroller, moveProject, controller.signal, (target) =>
    Boolean(target.closest('.case-content')),
  );
  syncRoute();
  return () => {
    controller.abort();
    cleanupViewer();
    galleries.forEach((gallery) => gsap.killTweensOf(gallery.querySelector('.gallery-project')));
  };
}
