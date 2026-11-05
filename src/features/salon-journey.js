import { gsap } from 'gsap';
import { salonJourney } from '../data/salon-journey.js';

// A public, illustrative case study. No salon API or customer data is used here.
export function mountSalonJourney(container) {
  const root = document.createElement('section');
  root.className = 'salon-journey';
  root.setAttribute('aria-label', 'Ako vznikal Štýlový chlpáč');
  root.innerHTML = `
    <div class="journey-topline"><span>OD ROZHOVORU PO SPUSTENIE</span><span data-journey-counter>01 / 05</span></div>
    <div class="journey-stage" aria-hidden="true">
      <div class="journey-orbit orbit-one"></div><div class="journey-orbit orbit-two"></div>
      <span class="journey-flower flower-one">✿</span><span class="journey-flower flower-two">✳</span>
      <div class="journey-shadow"></div>
      <div class="salon-model">
        <div class="model-chrome"><span class="model-dots">● ● ●</span><span>stylovychlpac.sk</span><span class="model-live">●</span></div>
        <div class="model-page">
          <div class="model-wireframe"><span></span><span></span><span></span><i></i></div>
          <div class="model-hero" data-layer="1">
            <div class="model-hero-copy"><span>PSÍ SALÓN V TOMÁŠOVE</span><strong>Strihanie<br>chlpáčov.</strong><small>Na každý deň aj do výstavného kruhu.</small><b>Dohodnúť návštevu ↗</b></div>
            <img src="/images/chlpac-salon-live.webp" alt="" width="1200" height="1600">
          </div>
          <div class="model-catalogue" data-layer="2"><span>Čo potrebuje váš chlpáč?</span><div><b>Starostlivosť</b><b>Wellness</b><b>Hygiena</b></div><p>Veľkosť + služba + trvanie</p></div>
        </div>
      </div>
      <div class="model-note note-brief"><span>01 / POČÚVAŤ</span><strong>Čo potrebuje<br>salón aj zákazník?</strong><i>Služby</i><i>Cenník</i><i>Objednanie</i></div>
      <div class="model-note note-feedback"><span>SPÄTNÁ VÄZBA</span><strong>Vysvetliť.<br>Vyskúšať. Doladiť.</strong></div>
      <div class="model-booking" data-layer="3"><span class="model-panel-kicker">REZERVAČNÁ CESTA</span><strong>Jedna návšteva.<br>Všetko nadväzuje.</strong><div class="model-booking-steps"><b>1<small>Služba</small></b><i>→</i><b>2<small>Pracovníčka</small></b><i>→</i><b>3<small>Termín</small></b></div><p>Trvanie · rozvrhy · voľno</p></div>
      <div class="model-admin" data-layer="4"><div class="model-admin-nav"><span>✿</span><i></i><i></i><i></i></div><div class="model-admin-main"><span class="model-panel-kicker">SPRÁVA SALÓNU</span><strong>Každý deň prehľadne.</strong><div class="model-admin-grid"><i></i><i></i><i></i><i></i><i></i><i></i><b>Ukážkový termín</b><b>Voľno</b></div><p>Kalendár · služby · obsah</p></div></div>
      <div class="journey-stamp" data-layer="4">WEB JE<br><strong>ONLINE ↗</strong></div>
      <span class="journey-scene-caption">Ilustrovaný priebeh projektu</span>
    </div>
    <div class="journey-navigation" role="group" aria-label="Kroky tvorby webu">
      ${salonJourney.map((step, i) => `<button type="button" data-journey-step="${i}" aria-pressed="${i === 0}" aria-controls="journey-description"><span>0${i + 1}</span>${step.label}</button>`).join('')}
    </div>
    <div class="journey-copy" id="journey-description" aria-live="polite" aria-atomic="true"><h3 data-journey-title></h3><p data-journey-text></p><span data-journey-outcome></span></div>
    <div class="journey-actions"><button type="button" class="journey-next">Ďalší krok <span aria-hidden="true">→</span></button><a href="https://stylovychlpac.sk/" target="_blank" rel="noopener noreferrer">Pozrieť živý web ↗</a></div>
  `;
  container.prepend(root);
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const buttons = [...root.querySelectorAll('[data-journey-step]')];
  const layers = [...root.querySelectorAll('[data-layer]')];
  let index = 0;
  let timeline;

  function render(next, animate = true) {
    index = Math.max(0, Math.min(salonJourney.length - 1, next));
    timeline?.kill();
    const step = salonJourney[index];
    root.dataset.scene = index;
    root.querySelector('[data-journey-counter]').textContent = `0${index + 1} / 05`;
    root.querySelector('[data-journey-title]').textContent = step.title;
    root.querySelector('[data-journey-text]').textContent = step.text;
    root.querySelector('[data-journey-outcome]').textContent = step.outcome;
    root.querySelector('.journey-next').innerHTML =
      index === 4
        ? 'Prejsť od začiatku <span aria-hidden="true">↺</span>'
        : 'Ďalší krok <span aria-hidden="true">→</span>';
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    const brief = root.querySelector('.note-brief');
    const feedback = root.querySelector('.note-feedback');
    const wireframe = root.querySelector('.model-wireframe');
    const model = root.querySelector('.salon-model');
    const still = media.matches || !animate;
    timeline = gsap.timeline({
      defaults: { duration: still ? 0 : 0.65, ease: 'power3.out', overwrite: 'auto' },
    });
    timeline.to(
      brief,
      {
        autoAlpha: index === 0 ? 1 : 0,
        x: index === 0 ? 0 : -35,
        rotation: index === 0 ? -9 : -16,
      },
      0,
    );
    timeline.to(
      feedback,
      { autoAlpha: index === 1 ? 1 : 0, y: index === 1 ? 0 : 24, rotation: -7 },
      0,
    );
    timeline.to(wireframe, { autoAlpha: index === 0 ? 1 : 0 }, 0);
    timeline.to(
      model,
      {
        rotation: index === 0 ? -5 : index === 4 ? -7 : -2,
        y: index >= 3 ? -14 : 0,
        scale: index >= 3 ? 0.9 : 1,
      },
      0,
    );
    layers.forEach((layer) => {
      const active = Number(layer.dataset.layer) <= index;
      const foreground = layer.matches('.model-booking, .model-admin');
      const visible = active && !(index === 4 && layer.matches('.model-booking'));
      timeline.to(
        layer,
        {
          autoAlpha: visible ? 1 : 0,
          y: visible ? 0 : foreground ? 60 : 18,
          scale: visible ? 1 : 0.88,
          rotation: visible
            ? layer.matches('.model-admin')
              ? 3
              : layer.matches('.model-booking')
                ? 5
                : 0
            : -5,
        },
        still ? 0 : Number(layer.dataset.layer) * 0.05,
      );
    });
    if (!still) {
      timeline.fromTo(
        root.querySelector('.journey-copy'),
        { y: 9, opacity: 0.3 },
        { y: 0, opacity: 1, duration: 0.35 },
        0,
      );
    } else {
      gsap.set(root.querySelector('.journey-copy'), { y: 0, opacity: 1 });
    }
  }

  buttons.forEach((button, i) => button.addEventListener('click', () => render(i), options));
  root
    .querySelector('.journey-next')
    .addEventListener('click', () => render((index + 1) % salonJourney.length), options);
  root.querySelector('.journey-navigation').addEventListener(
    'keydown',
    (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? 4
            : (index + (event.key === 'ArrowRight' ? 1 : 4)) % 5;
      render(next);
      buttons[index].focus();
    },
    options,
  );
  const onMotionChange = () => render(index, false);
  media.addEventListener('change', onMotionChange);
  render(0, false);
  return () => {
    controller.abort();
    media.removeEventListener('change', onMotionChange);
    timeline?.kill();
    gsap.killTweensOf(root.querySelectorAll('*'));
    root.remove();
  };
}
