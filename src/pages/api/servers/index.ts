import type { NextApiRequest, NextApiResponse } from 'next';
import prisma, { serialiseServer } from '../../../lib/prisma';
import { Server } from '../../../types/Types';

import nextConnect from 'next-connect';
import rateLimit from '../../../middleware/rateLimit';

const handler = nextConnect();

handler.use(rateLimit());

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const servers = await prisma.server.findMany({
    orderBy: [
      {
        playerCount: 'desc',
      },
      {
        queueCount: 'desc',
      },
    ],
    take: 1000,
    include: {
      relatedIsland: true,
    },
  });

  const serialisedServers: Server[] = servers.map(serialiseServer);

  return res.status(200).json(serialisedServers);
});

export default handler;
