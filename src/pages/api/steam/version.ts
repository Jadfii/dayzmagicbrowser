import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import rateLimit from '../../../middleware/rateLimit';
import { getGameVersion } from '../../../data/Version';

const handler = nextConnect();

handler.use(rateLimit());

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=60');

  try {
    const dayzVersion = await getGameVersion();

    if (dayzVersion === undefined) throw new Error('timeout');

    return res.status(200).json(dayzVersion);
  } catch (err) {
    console.error(err);

    return res.status(500).json({ error: 'Failed to query game version API' });
  }
});

export default handler;
