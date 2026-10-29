import { workflowSteps } from '../data/workflow.js';

export function initWorkflowDemo({
  root = document,
  steps = workflowSteps,
  onStepChange = () => {},
} = {}) {
  const next = root.querySelector('#next-step');
  if (!next || steps.length === 0) return () => {};

  const buttons = [...root.querySelectorAll('.step')];
  const controller = new AbortController();
  const options = { signal: controller.signal };
  let currentStep = 0;

  function renderStep(index, animate = true) {
    if (!Number.isInteger(index)) return;
    currentStep = ((index % steps.length) + steps.length) % steps.length;
    const step = steps[currentStep];
    root.querySelector('#stage-icon').textContent = step.icon;

    const title = root.querySelector('#stage-title');
    title.replaceChildren();
    step.title.forEach((line, index) => {
      if (index > 0) title.append(document.createElement('br'));
      title.append(document.createTextNode(line));
    });
    root.querySelector('#stage-description').textContent = step.description;
    const label = document.createElement('span');
    label.textContent = step.label;
    const example = document.createElement('p');
    example.textContent = step.example;
    root.querySelector('#stage-example').replaceChildren(label, example);
    root.querySelector('#stage-tags').replaceChildren(
      ...step.tags.map((tag) => {
        const element = document.createElement('span');
        element.textContent = tag;
        return element;
      }),
    );
    root.querySelector('#stage-caption').textContent = step.caption;
    root.querySelector('#stage-counter').textContent =
      `${String(currentStep + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}`;
    buttons.forEach((button) => {
      const active = Number(button.dataset.step) === currentStep;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (animate) onStepChange(root.querySelector('.stage-content'));
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => renderStep(Number(button.dataset.step)), options);
  });
  next.addEventListener('click', () => renderStep(currentStep + 1), options);
  // Keep the initial server-readable content and the interactive data in sync.
  renderStep(0, false);

  return () => controller.abort();
}
