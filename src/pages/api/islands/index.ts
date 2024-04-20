import type { NextApiRequest, NextApiResponse } from 'next';
import { Island } from '../../../types/Types';
import nextConnect from 'next-connect';
import rateLimit from '../../../middleware/rateLimit';
import { db } from '../../../lib/drizzle';
import { serialiseIsland } from '../../../../drizzle/schema/island';

const handler = nextConnect();

handler.use(rateLimit());

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const islands = await db.query.island.findMany();

  const serialisedIslands: Island[] = islands.map(serialiseIsland);

  return res.status(200).json(serialisedIslands);
});

export default handler;
