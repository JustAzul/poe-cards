import type { NextApiRequest, NextApiResponse } from 'next';
import { buildLeagueDetails } from '../../lib/mappers/league-dto-mapper';
import { getLeague } from '../../lib/r2-client';

/**
 * Live-refetch endpoint for the WS "updated" ping. Next's pages-router SSG
 * data cache treats `router.replace(router.asPath)` to the current URL as a
 * no-op and won't re-run `getStaticProps`, so an already-open league page
 * can't pick up a fresh update through that path — this plain API route
 * bypasses that cache entirely. `Cache-Control: no-store` keeps it out of
 * Vercel's edge cache too, so it always reflects the current R2 object.
 */

function isValidLeagueNameCandidate(candidate: unknown): candidate is string {
  return typeof candidate === 'string' && candidate.trim().length > 0;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    // eslint-disable-next-line no-console
    console.warn('league-data: rejected — wrong method');
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const leagueNameCandidate = req.query.leagueName;

  if (!isValidLeagueNameCandidate(leagueNameCandidate)) {
    // eslint-disable-next-line no-console
    console.warn('league-data: rejected — missing/invalid leagueName');
    return res.status(400).json({ message: 'Invalid leagueName' });
  }

  const leagueDataResponse = await getLeague(leagueNameCandidate);

  if (!leagueDataResponse) {
    return res.status(200).json({ leagueExists: false });
  }

  return res.status(200).json({
    leagueExists: true,
    leagueDetails: buildLeagueDetails(leagueDataResponse),
  });
}
