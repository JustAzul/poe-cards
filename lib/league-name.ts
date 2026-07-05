/**
 * Shared encode/decode boundary for league names used across R2 keys, the
 * revalidate API route, and the `[leagueName]` dynamic route.
 *
 * `decodeURIComponent` throws `URIError` on malformed percent-encoding (e.g.
 * a lone `%` in the input) — every inbound boundary must go through the
 * guarded `decodeLeagueName` below instead of calling it raw, so a malformed
 * league name degrades to `null` instead of crashing the request.
 */

export function encodeLeagueName(name: string): string {
  return encodeURIComponent(name);
}

export function decodeLeagueName(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    // eslint-disable-next-line no-console
    console.warn('league-name: failed to decode league name — malformed percent-encoding');
    return null;
  }
}
