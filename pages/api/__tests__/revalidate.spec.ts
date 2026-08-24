import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '../revalidate';

const SECRET = 'test-secret';

function buildReq(body: Record<string, unknown>): NextApiRequest {
  return {
    method: 'POST',
    headers: { authorization: `Bearer ${SECRET}` },
    body,
    query: {},
  } as unknown as NextApiRequest;
}

function buildRes() {
  const res = {
    revalidate: jest.fn().mockResolvedValue(undefined),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    setHeader: jest.fn(),
  };
  return res as unknown as NextApiResponse & { revalidate: jest.Mock };
}

describe('revalidate handler', () => {
  const originalSecret = process.env.REVALIDATE_SECRET;

  beforeEach(() => {
    process.env.REVALIDATE_SECRET = SECRET;
  });

  afterAll(() => {
    process.env.REVALIDATE_SECRET = originalSecret;
  });

  it('revalidates only the league path when leagueName is present, not "/"', async () => {
    const req = buildReq({ leagueName: 'Allflame' });
    const res = buildRes();

    await handler(req, res);

    expect(res.revalidate).toHaveBeenCalledTimes(1);
    expect(res.revalidate).toHaveBeenCalledWith('/league/Allflame');
  });

  it('revalidates only "/" when leagueName is absent', async () => {
    const req = buildReq({});
    const res = buildRes();

    await handler(req, res);

    expect(res.revalidate).toHaveBeenCalledTimes(1);
    expect(res.revalidate).toHaveBeenCalledWith('/');
  });
});
