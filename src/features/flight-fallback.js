export function restoreFlightFallback({ root = document } = {}) {
  root.dispatchEvent(new Event('portfolio:flight-fallback'));
  root.body.classList.remove('flight-ready');
  root.body.classList.add('flight-fallback');
  root.querySelectorAll('.flight-intro,.flight-contact').forEach((element) => {
    for (const property of ['opacity', 'transform', 'pointer-events'])
      element.style.removeProperty(property);
    element.inert = false;
  });
  root.querySelectorAll('.flight-project').forEach((node) => {
    node.style.removeProperty('visibility');
    node.querySelector('.hologram').inert = false;
  });
}
