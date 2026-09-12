/**
 * Shared QR event-token configuration.
 *
 * The official event QR code encodes this token.  The Leader's scanner
 * validates that the scanned value exactly matches it — any other QR is
 * rejected.
 *
 * Set VITE_EVENT_QR_TOKEN in your environment to change the token.
 * Falls back to a sensible default so dev / demo works out of the box.
 */
export const EVENT_QR_TOKEN: string =
  (import.meta.env.VITE_EVENT_QR_TOKEN as string) || 'CIC-CONVOCATION-2024';
