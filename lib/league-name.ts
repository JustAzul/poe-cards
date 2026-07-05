/**
 * Shared encode boundary for league names used when building R2 object keys
 * (`r2-client.ts`'s `getLeague`) and the revalidate API's target path
 * (`pages/api/revalidate.ts`).
 *
 * There is deliberately no `decodeLeagueName` here: every place this app
 * receives a league name (the `[leagueName]` dynamic route's `params`, the
 * revalidate route's JSON body/query) is already a decoded plain string by
 * the time our code sees it — Next's route matcher and query/body parser
 * decode ahead of our boundary. Adding a second `decodeURIComponent` pass
 * on an already-decoded string is a real bug, not defense-in-depth: a name
 * that legitimately contains a literal `%` (e.g. "100% Delirium") would be
 * mis-parsed as a percent-escape and throw `URIError`, turning a valid
 * league into a false 404. If a genuinely raw/undecoded external boundary
 * is ever introduced, add a guarded decode helper for that specific
 * boundary then — don't reintroduce a generic one speculatively.
 */

// eslint-disable-next-line import/prefer-default-export -- named import used at both call sites
export function encodeLeagueName(name: string): string {
  return encodeURIComponent(name);
}
