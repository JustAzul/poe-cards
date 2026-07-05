/**
 * Shared encode boundary for league names used when building R2 object keys
 * (`r2-client.ts`'s `getLeague`) and the revalidate API's target path
 * (`pages/api/revalidate.ts`).
 *
 * There is deliberately no `decodeLeagueName` here: every place this app
 * receives a league name arrives as a plain string with no percent-encoding
 * to undo. The `[leagueName]` dynamic route's `params` and the revalidate
 * route's query string are decoded by Next's route matcher/query parser
 * ahead of our boundary; the revalidate route's JSON body was never
 * percent-encoded to begin with (a JSON string field isn't a URL segment).
 * Calling `decodeURIComponent` on any of these is a real bug, not
 * defense-in-depth: a name that legitimately contains a literal `%` (e.g.
 * "100% Delirium") would be mis-parsed as a percent-escape and throw
 * `URIError`. If a genuinely raw/undecoded external boundary is ever
 * introduced, add a guarded decode helper for that specific boundary then
 * — don't reintroduce a generic one speculatively.
 */

// eslint-disable-next-line import/prefer-default-export -- named import used at both call sites
export function encodeLeagueName(name: string): string {
  return encodeURIComponent(name);
}
