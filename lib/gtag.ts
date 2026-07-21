// ─── GA4 event helper ──────────────────────────────────────────────────────
// window.gtag is loaded globally in app/layout.tsx (fires to both the vendor
// and backup GA4 properties via parallel `gtag('config', ...)` calls).
// This helper just wraps the call so callsites don't need to guard/repeat
// the `typeof window` check everywhere.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}
