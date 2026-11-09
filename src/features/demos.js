import {
  availableSlots,
  demoDays,
  demoServices,
  timeLabel,
  advertDraft,
  advertText,
} from './demo-model.js';

export function buildDemoContent(project) {
  const chapter = document.createElement('section');
  chapter.className = 'demo-workspace';
  chapter.setAttribute('aria-labelledby', 'case-title');
  const header = document.createElement('div');
  header.className = 'demo-heading';
  const heading = document.createElement('h2');
  heading.id = 'case-title';
  heading.tabIndex = -1;
  heading.textContent = project.name;
  const summary = document.createElement('p');
  summary.textContent = project.summary;
  const notice = document.createElement('p');
  notice.className = 'demo-notice';
  notice.textContent = 'Funkčná demonštrácia · modelové údaje';
  header.append(heading, summary, notice);
  const tool = document.createElement('div');
  tool.className = 'demo-tool';
  tool.dataset.demo = project.demo;
  chapter.append(header, tool);
  return chapter;
}

export function mountDemo(root, project) {
  const host = root.querySelector('.demo-tool');
  const controller = new AbortController();
  const options = { signal: controller.signal };
  let downloadUrl;
  if (project.demo === 'booking') {
    host.innerHTML = `<div class="demo-controls"><h3>Vyberte si termín.</h3><label for="demo-service">Služba</label><select id="demo-service"><option value="consult">Konzultácia · 30 min</option><option value="service">Odborný servis · 60 min</option></select><label for="demo-day">Modelový deň</label><select id="demo-day"><option value="0">Pondelok</option><option value="1">Utorok</option><option value="2">Streda</option></select><p class="demo-help">Dostupnosť sa mení podľa dĺžky služby a obsadenosti.</p><button type="button" class="demo-reset">Obnoviť ukážku</button></div><div class="demo-preview"><h3>Voľné termíny</h3><div class="demo-slots" role="group" aria-label="Voľné termíny"></div><p class="demo-selection" aria-live="polite">Najprv vyberte voľný čas.</p><button type="button" class="demo-action demo-book" disabled>Potvrdiť ukážkovú rezerváciu</button><p class="demo-result" role="status"></p><p class="demo-help">Pracujete s modelovým kalendárom. Nevzniká skutočná objednávka.</p></div>`;
    const serviceSelect = host.querySelector('#demo-service'),
      daySelect = host.querySelector('#demo-day'),
      slots = host.querySelector('.demo-slots'),
      book = host.querySelector('.demo-book'),
      selection = host.querySelector('.demo-selection'),
      result = host.querySelector('.demo-result');
    let reservations = [],
      selected = null;
    const render = () => {
      selected = null;
      book.disabled = true;
      selection.textContent = 'Vyberte voľný čas.';
      slots.replaceChildren();
      const available = availableSlots(Number(daySelect.value), serviceSelect.value, reservations);
      for (const start of available) {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.time = String(start);
        button.textContent = timeLabel(start);
        button.setAttribute('aria-pressed', 'false');
        slots.append(button);
      }
      if (!available.length)
        slots.textContent =
          'Na tento deň už nie je voľný termín. Vyberte iný deň alebo kratšiu službu.';
    };
    host.addEventListener(
      'change',
      () => {
        result.textContent = '';
        render();
      },
      options,
    );
    host.addEventListener(
      'click',
      (event) => {
        const button = event.target.closest('button');
        if (!button) return;
        if (button.dataset.time) {
          const start = Number(button.dataset.time);
          if (
            !availableSlots(Number(daySelect.value), serviceSelect.value, reservations).includes(
              start,
            )
          )
            return;
          selected = start;
          slots
            .querySelectorAll('button')
            .forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
          selection.textContent = `${demoDays[Number(daySelect.value)]} o ${timeLabel(start)} · ${demoServices.find((item) => item.id === serviceSelect.value).name}`;
          book.disabled = false;
          result.textContent = '';
        } else if (button === book && selected !== null) {
          const day = Number(daySelect.value),
            service = demoServices.find((item) => item.id === serviceSelect.value);
          if (!availableSlots(day, service.id, reservations).includes(selected)) return;
          const start = selected;
          reservations.push({ day, start, duration: service.duration });
          render();
          result.textContent = `Ukážková rezervácia je vytvorená: ${demoDays[day]}, ${timeLabel(start)}–${timeLabel(start + service.duration)}. Termín už nie je v ponuke.`;
          slots.querySelector('button')?.focus({ preventScroll: true });
        } else if (button.matches('.demo-reset')) {
          reservations = [];
          serviceSelect.value = 'consult';
          daySelect.value = '0';
          result.textContent = 'Modelový kalendár je obnovený.';
          render();
        }
      },
      options,
    );
    render();
  } else {
    host.innerHTML = `<form class="demo-controls demo-ad-form"><h3>Vaša ponuka.</h3><label for="ad-service">Čo ponúkate?</label><input id="ad-service" name="service" value="Servis klimatizácií" maxlength="60" required><label for="ad-area">Kde pôsobíte?</label><input id="ad-area" name="area" value="Bratislava" maxlength="40"><label for="ad-benefit">Čo má zákazník vedieť?</label><textarea id="ad-benefit" name="benefit" maxlength="120" rows="3" required>Montáž, čistenie a pravidelná údržba klimatizácií.</textarea><label for="ad-cta">Ďalší krok zákazníka</label><select id="ad-cta" name="cta"><option>Získať ponuku</option><option>Dohodnúť termín</option><option>Zistiť viac</option></select><div class="demo-form-actions"><button class="demo-action" type="submit">Stiahnuť zadanie</button><button class="demo-reset" type="reset">Obnoviť ukážku</button></div><p class="demo-result" role="status"></p></form><div class="demo-preview"><h3>Živý náhľad reklamy</h3><div class="demo-ad"><span>Ukážka · vasweb.example</span><h4 data-ad-headline></h4><p data-ad-description></p><span data-ad-cta class="demo-ad-cta"></span></div><p class="demo-help">Náhľad sa skladá z vašich údajov. Nie je pripojený k reklamnému účtu a nespúšťa kampaň. Súbor je pracovné zadanie, nie hotová publikovaná reklama.</p></div>`;
    const form = host.querySelector('form'),
      status = host.querySelector('.demo-result');
    const values = () => Object.fromEntries(new FormData(form));
    const update = () => {
      const draft = advertDraft(values());
      host.querySelector('[data-ad-headline]').textContent = draft.headline;
      host.querySelector('[data-ad-description]').textContent = draft.description;
      host.querySelector('[data-ad-cta]').textContent = draft.cta;
      status.textContent = '';
    };
    form.addEventListener('input', update, options);
    form.addEventListener('change', update, options);
    form.addEventListener('reset', () => queueMicrotask(update), options);
    form.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();
        const text = advertText(values());
        if (!text) {
          status.textContent = 'Doplňte službu a krátky opis ponuky.';
          return;
        }
        if (downloadUrl) URL.revokeObjectURL(downloadUrl);
        downloadUrl = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'dmm-reklamne-zadanie.txt';
        link.click();
        status.textContent = 'Zadanie je pripravené na stiahnutie.';
      },
      options,
    );
    update();
  }
  return () => {
    controller.abort();
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  };
}
