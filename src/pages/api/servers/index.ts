import type { NextApiRequest, NextApiResponse } from 'next';
import prisma, { serialiseServer } from '../../../lib/prisma';
import { SERVER_FILTERS } from '../../../types/Types';
import nextConnect from 'next-connect';
import rateLimit from '../../../middleware/rateLimit';
import { DAYZ_EXP_APPID } from '../../../constants/game.constant';
import { sortServersByPlayerCount } from '../../../utils/server.util';
import { SERVERS_PAGE_SERVERS_COUNT } from '../../../constants/layout.constant';
import validation, { Joi } from '../../../middleware/validation';
import { getEnumValues } from '../../../utils/enum.util';

export const getServersPageData = async (queryParams: NextApiRequest['query'] = {}) => {
  // Get query params
  const { name, island, version, mods, firstperson, official, experimental, noqueue } = queryParams;

  // Get servers
  const servers = await prisma.server.findMany({
    orderBy: [
      {
        playerCount: 'desc',
      },
      {
        queueCount: 'desc',
      },
    ],
    take: SERVERS_PAGE_SERVERS_COUNT,
    where: {
      ...(typeof name === 'string' ? { name: { contains: name } } : {}),
      ...(typeof island === 'string' ? { island: { contains: island } } : {}),
      ...(typeof version === 'string' ? { version } : {}),
      ...(typeof mods === 'string'
        ? {
            modIds: {
              array_contains: mods.split(',').map((modId) => Number(modId.trim())),
            },
          }
        : {}),
      ...(typeof firstperson === 'string' ? { isFirstPerson: true } : {}),
      ...(typeof official === 'string' ? { isPublicHive: true } : {}),
      ...(typeof experimental === 'string' ? { appId: DAYZ_EXP_APPID } : {}),
      ...(typeof noqueue === 'string' ? { queueCount: 0 } : {}),
    },
    include: {
      relatedIsland: true,
    },
  });

  // Serialise servers so they can be passed to component
  return sortServersByPlayerCount(servers.map(serialiseServer));
};

const querySchema = Joi.object(Object.fromEntries(getEnumValues(SERVER_FILTERS).map((key) => [key, Joi.string()])));

const handler = nextConnect();

handler.use(rateLimit());

handler.get(validation({ query: querySchema }), async (req: NextApiRequest, res: NextApiResponse) => {
  // Caching
  res.setHeader('Cache-Control', `s-maxage=120, stale-while-revalidate`);

  // Get servers
  const servers = await getServersPageData(req.query);
  return res.status(200).json(servers);
});

export default handler;
