export const demoDays = ['Pondelok', 'Utorok', 'Streda'];
export const demoServices = [
  { id: 'consult', name: 'Konzultácia', duration: 30 },
  { id: 'service', name: 'Odborný servis', duration: 60 },
];
const initialBusy = [
  [600, 630],
  [660, 720],
  [570, 630],
];
export const timeLabel = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
export function availableSlots(day, serviceId, reservations = []) {
  const service = demoServices.find((item) => item.id === serviceId);
  if (!service || !Number.isInteger(day) || day < 0 || day >= demoDays.length) return [];
  const busy = [
    initialBusy[day],
    ...reservations
      .filter((item) => item.day === day)
      .map((item) => [item.start, item.start + item.duration]),
  ];
  const slots = [];
  for (let start = 540; start + service.duration <= 780; start += 30)
    if (!busy.some(([a, b]) => start < b && start + service.duration > a)) slots.push(start);
  return slots;
}
export function advertDraft(values) {
  const clean = (value, limit) =>
    typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, limit) : '';
  const service = clean(values.service, 60),
    area = clean(values.area, 40),
    benefit = clean(values.benefit, 120);
  const cta = ['Získať ponuku', 'Dohodnúť termín', 'Zistiť viac'].includes(values.cta)
    ? values.cta
    : 'Získať ponuku';
  return {
    service,
    area,
    benefit,
    cta,
    headline: service ? `${service}${area ? ` — ${area}` : ''}` : 'Vaša služba',
    description: benefit || 'Tu sa zobrazí to, čo svojim zákazníkom ponúkate.',
  };
}
export function advertText(values) {
  const draft = advertDraft(values);
  if (!draft.service || !draft.benefit) return null;
  return `d/m/m — modelové reklamné zadanie\n\nSlužba: ${draft.service}\nOblasť: ${draft.area || 'Nezadaná'}\nNadpis: ${draft.headline}\nPopis: ${draft.description}\nVýzva: ${draft.cta}\n\nDemonštračný návrh zo zadaných údajov. Reklama nebola publikovaná. Pred použitím overte pravdivosť ponuky a finálne nastavenie kampane.\n`;
}
