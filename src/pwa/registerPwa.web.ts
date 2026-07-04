/**
 * Web PWA wiring (master plan: "app that lives in your pocket").
 *
 * Expo Metro web generates its own <head>, so rather than hack the build we
 * inject the PWA tags at runtime: manifest link, theme-color, apple-touch-icon
 * + iOS standalone metas — then register the service worker. All assets live in
 * public/ and are served from the site root by Expo's static export.
 *
 * Idempotent: safe to call on every mount (won't duplicate tags).
 */

function ensure<T extends HTMLElement>(
  selector: string,
  create: () => T,
): void {
  if (document.head.querySelector(selector)) return;
  document.head.appendChild(create());
}

export function registerPwa(): void {
  if (typeof document === 'undefined') return;

  // Web app manifest.
  ensure('link[rel="manifest"]', () => {
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/manifest.json';
    return link;
  });

  // Address-bar / theme color.
  ensure('meta[name="theme-color"]', () => {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#3BA99C';
    return meta;
  });

  // iOS "Add to Home Screen".
  ensure('link[rel="apple-touch-icon"]', () => {
    const link = document.createElement('link');
    link.rel = 'apple-touch-icon';
    link.href = '/apple-touch-icon.png';
    return link;
  });
  ensure('meta[name="apple-mobile-web-app-capable"]', () => {
    const meta = document.createElement('meta');
    meta.name = 'apple-mobile-web-app-capable';
    meta.content = 'yes';
    return meta;
  });
  ensure('meta[name="apple-mobile-web-app-title"]', () => {
    const meta = document.createElement('meta');
    meta.name = 'apple-mobile-web-app-title';
    meta.content = 'Saku';
    return meta;
  });
  ensure('meta[name="apple-mobile-web-app-status-bar-style"]', () => {
    const meta = document.createElement('meta');
    meta.name = 'apple-mobile-web-app-status-bar-style';
    meta.content = 'default';
    return meta;
  });

  // Service worker (offline shell + installability). registerPwa() runs from a
  // useEffect — i.e. after `window`'s load event has already fired — so a naive
  // load listener would never run. Register now if the page is ready, otherwise
  // wait for load.
  if ('serviceWorker' in navigator) {
    const register = () =>
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* SW is progressive enhancement; ignore failures */
      });
    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register, { once: true });
    }
  }
}
