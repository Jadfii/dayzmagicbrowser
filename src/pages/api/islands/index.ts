import type { NextApiRequest, NextApiResponse } from 'next';
import prisma, { serialiseIsland } from '../../../lib/prisma';
import { Island } from '../../../types/Types';
import nextConnect from 'next-connect';
import rateLimit from '../../../middleware/rateLimit';

const handler = nextConnect();

handler.use(rateLimit());

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const islands = await prisma.island.findMany();

  const serialisedIslands: Island[] = islands.map(serialiseIsland);

  return res.status(200).json(serialisedIslands);
});

export default handler;
