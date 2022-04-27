import type { NextApiRequest, NextApiResponse } from 'next';
import prisma, { serialiseServer } from '../../../lib/prisma';
import { Server } from '../../../types/Types';
import nextConnect from 'next-connect';
import rateLimit from '../../../middleware/rateLimit';
import { DAYZ_EXP_APPID } from '../../../constants/game.constant';
import { sortServersByPlayerCount } from '../../../utils/server.util';

const handler = nextConnect();

handler.use(rateLimit());

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  // Caching
  res.setHeader('Cache-Control', `s-maxage=120, stale-while-revalidate`);

  // Get query params
  const { name, island, version, mods, firstperson, official, experimental, noqueue } = req.query;

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
    take: 250,
    where: {
      ...(typeof name === 'string' ? { name: { search: name.split(' ').join(' & ') } } : {}),
      ...(typeof island === 'string' ? { island: { contains: island, mode: 'insensitive' } } : {}),
      ...(typeof version === 'string' ? { version } : {}),
      ...(typeof mods === 'string'
        ? {
            modIds: {
              hasEvery: mods.split(',').map((modId) => Number(modId.trim())),
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
  const serialisedServers: Server[] = sortServersByPlayerCount(servers.map(serialiseServer));

  return res.status(200).json(serialisedServers);
});

export default handler;
