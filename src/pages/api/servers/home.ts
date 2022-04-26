import type { NextApiRequest, NextApiResponse } from 'next';
import { DAYZ_EXP_APPID } from '../../../constants/game.constant';
import prisma, { serialiseServer } from '../../../lib/prisma';
import nextConnect from 'next-connect';
import rateLimit from '../../../middleware/rateLimit';
import { HOME_SECTION_SERVERS_COUNT } from '../../../constants/layout.constant';
import { HomeServers } from '../../../types/Types';
import { sortServersByPlayerCount } from '../../../utils/server.util';

const handler = nextConnect();

handler.use(rateLimit());

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const popularServers = prisma.server.findMany({
    take: HOME_SECTION_SERVERS_COUNT,
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
    take: HOME_SECTION_SERVERS_COUNT,
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
    take: HOME_SECTION_SERVERS_COUNT,
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

  const homeServers: HomeServers = {
    popular: sortServersByPlayerCount(popular.map(serialiseServer)),
    official: sortServersByPlayerCount(official.map(serialiseServer)),
    experimental: sortServersByPlayerCount(experimental.map(serialiseServer)),
  };

  return res.status(200).json({
    popular: [],
    official: [],
    experimental: [],
  });
});

export default handler;
