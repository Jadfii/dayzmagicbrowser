import type { NextApiRequest, NextApiResponse } from 'next';
import { DAYZ_EXP_APPID } from '../../../constants/game.constant';
import nextConnect from 'next-connect';
import rateLimit from '../../../middleware/rateLimit';
import { HOME_SECTION_SERVERS_COUNT } from '../../../constants/layout.constant';
import { sortServersByPlayerCount } from '../../../utils/server.util';
import { db } from '../../../lib/drizzle';
import { serialiseServer } from '../../../../drizzle/schema/server';

export const getHomePageData = async () => {
  const popularServers = db.query.server.findMany({
    limit: HOME_SECTION_SERVERS_COUNT,
    orderBy: (servers, { desc }) => [desc(servers.playerCount), desc(servers.queueCount)],
    with: {
      relatedIsland: true,
    },
  });

  const officialServers = db.query.server.findMany({
    where: (servers, { eq }) => eq(servers.isPublicHive, true),
    limit: HOME_SECTION_SERVERS_COUNT,
    orderBy: (servers, { desc }) => [desc(servers.playerCount), desc(servers.queueCount)],
    with: {
      relatedIsland: true,
    },
  });

  const experimentalServers = db.query.server.findMany({
    where: (servers, { eq }) => eq(servers.appId, DAYZ_EXP_APPID),
    limit: HOME_SECTION_SERVERS_COUNT,
    orderBy: (servers, { desc }) => [desc(servers.playerCount), desc(servers.queueCount)],
    with: {
      relatedIsland: true,
    },
  });

  const [popular, official, experimental] = await Promise.all([popularServers, officialServers, experimentalServers]);

  return {
    popular: sortServersByPlayerCount(popular.map(serialiseServer)),
    official: sortServersByPlayerCount(official.map(serialiseServer)),
    experimental: sortServersByPlayerCount(experimental.map(serialiseServer)),
  };
};

const handler = nextConnect();

handler.use(rateLimit());

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  // Caching
  res.setHeader('Cache-Control', `s-maxage=120, stale-while-revalidate`);

  const homeServers = await getHomePageData();
  return res.status(200).json(homeServers);
});

export default handler;
