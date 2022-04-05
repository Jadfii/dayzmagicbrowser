import type { NextApiRequest, NextApiResponse } from 'next';
import prisma, { serialiseIsland } from '../../../lib/prisma';
import { Island } from '../../../types/Types';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const islands = await prisma.island.findMany();

  const serialisedIslands: Island[] = islands.map(serialiseIsland);

  return res.status(200).json(serialisedIslands);
};

export default handler;
