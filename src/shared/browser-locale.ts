const FALLBACK_BROWSER_LOCALE = "es-AR";

export function getBrowserLocale(fallback = FALLBACK_BROWSER_LOCALE) {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return fallback;
  }

  return navigator.languages?.[0] ?? navigator.language ?? fallback;
}

export { FALLBACK_BROWSER_LOCALE };
