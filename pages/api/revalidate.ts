import type { NextApiRequest, NextApiResponse } from 'next';
import { encodeLeagueName } from '../../lib/league-name';

const BEARER_PREFIX = 'Bearer ';

function extractBearerToken(authHeader?: string): string | undefined {
  if (!authHeader?.startsWith(BEARER_PREFIX)) return undefined;
  return authHeader.slice(BEARER_PREFIX.length);
}

function isAuthorized(req: NextApiRequest): boolean {
  const expectedSecret = process.env.REVALIDATE_SECRET;
  if (!expectedSecret) return false;

  const token = extractBearerToken(req.headers.authorization);
  return token === expectedSecret;
}

/** Raw, unvalidated `leagueName` candidate from the request body or query. */
function readLeagueNameCandidate(req: NextApiRequest): unknown {
  return req.body?.leagueName ?? req.query?.leagueName;
}

/** Narrows the candidate to a non-empty string — rejects arrays (repeated query params), objects, numbers, etc. */
function isValidLeagueNameCandidate(candidate: unknown): candidate is string {
  return typeof candidate === 'string' && candidate.trim().length > 0;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    // eslint-disable-next-line no-console
    console.warn('revalidate: rejected — wrong method');
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!isAuthorized(req)) {
    // eslint-disable-next-line no-console
    console.warn('revalidate: rejected — invalid secret');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const leagueNameCandidate = readLeagueNameCandidate(req);

  if (leagueNameCandidate !== undefined && !isValidLeagueNameCandidate(leagueNameCandidate)) {
    // eslint-disable-next-line no-console
    console.warn('revalidate: rejected — leagueName present but not a valid non-empty string');
    return res.status(400).json({ message: 'Invalid leagueName' });
  }

  const leagueName = leagueNameCandidate as string | undefined;

  try {
    await res.revalidate('/');

    if (leagueName) {
      await res.revalidate(`/league/${encodeLeagueName(leagueName)}`);
    }

    return res.status(200).json({ revalidated: true });
  } catch {
    return res.status(500).json({ message: 'Revalidation failed' });
  }
}
