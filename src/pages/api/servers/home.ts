import type { NextApiRequest, NextApiResponse } from 'next';
import { DAYZ_EXP_APPID } from '../../../constants/game.constant';
import prisma, { serialiseServer } from '../../../lib/prisma';
import nextConnect from 'next-connect';
import rateLimit from '../../../middleware/rateLimit';

const handler = nextConnect();

handler.use(rateLimit());

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const popularServers = prisma.server.findMany({
    take: 4,
    orderBy: [
      {
        playerCount: 'desc',
      },
      {
        queueCount: 'desc',
      },
    ],
    include: {
      relatedIsland: true,
    },
  });

  const officialServers = prisma.server.findMany({
    where: {
      isPublicHive: true,
    },
    take: 4,
    orderBy: [
      {
        playerCount: 'desc',
      },
      {
        queueCount: 'desc',
      },
    ],
    include: {
      relatedIsland: true,
    },
  });

  const experimentalServers = prisma.server.findMany({
    where: {
      appId: DAYZ_EXP_APPID,
    },
    take: 4,
    orderBy: [
      {
        playerCount: 'desc',
      },
      {
        queueCount: 'desc',
      },
    ],
    include: {
      relatedIsland: true,
    },
  });

  const [popular, official, experimental] = await Promise.all([popularServers, officialServers, experimentalServers]);

  const homeServers = Object.fromEntries(Object.entries({ popular, official, experimental }).map(([key, val]) => [key, val.map(serialiseServer)]));

  return res.status(200).json(homeServers);
});

export default handler;
