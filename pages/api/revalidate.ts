import type { NextApiRequest, NextApiResponse } from 'next';

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const leagueName = (req.body?.leagueName ?? req.query?.leagueName) as string | undefined;

  try {
    await res.revalidate('/');

    if (leagueName) {
      await res.revalidate(`/league/${encodeURIComponent(leagueName)}`);
    }

    return res.status(200).json({ revalidated: true });
  } catch {
    return res.status(500).json({ message: 'Revalidation failed' });
  }
}
