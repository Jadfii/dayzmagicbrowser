import type { NextApiRequest, NextApiResponse } from 'next';
import { DAYZ_EXP_APPID } from '../../../constants/game.constant';
import prisma, { serialiseServer } from '../../../lib/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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
  });

  const [popular, official, experimental] = await Promise.all([popularServers, officialServers, experimentalServers]);

  const homeServers = Object.fromEntries(Object.entries({ popular, official, experimental }).map(([key, val]) => [key, val.map(serialiseServer)]));

  return res.status(200).json(homeServers);
};

export default handler;
