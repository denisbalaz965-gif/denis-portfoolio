import { beforeEach, vi } from 'vitest';

// jsdom provides a DOM, not layout or a browser's native modal implementation.
// Real layout and keyboard behavior are checked separately in a browser.
beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    'matchMedia',
    vi.fn((media) =>
      Object.assign(new EventTarget(), {
        media,
        matches: false,
      }),
    ),
  );

  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: {
      configurable: true,
      value() {
        this.open = true;
        this.querySelector('[autofocus]')?.focus();
      },
    },
    close: {
      configurable: true,
      value() {
        this.open = false;
        this.dispatchEvent(new Event('close'));
      },
    },
  });
});
