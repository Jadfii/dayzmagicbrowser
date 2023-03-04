import type { NextApiRequest, NextApiResponse } from 'next';
import prisma, { serialiseServer } from '../../../lib/prisma';
import { Server } from '../../../types/Types';
import nextConnect from 'next-connect';
import rateLimit from '../../../middleware/rateLimit';
import validation, { Joi } from '../../../middleware/validation';
import { sortServersByPlayerCount } from '../../../utils/server.util';

const MAX_SEARCH_RESULTS = 30;

const querySchema = Joi.object({
  name: Joi.string().required(),
});

const handler = nextConnect();

handler.use(rateLimit());

handler.get(validation({ query: querySchema }), async (req: NextApiRequest, res: NextApiResponse) => {
  let searchTerm = req?.query?.name;

  if (Array.isArray(searchTerm)) searchTerm = searchTerm?.[0];
  // Trim and replace whitespace with underscores
  searchTerm = (searchTerm || '').trim().replace(/[\s\n\t]/g, '_');

  const servers = await prisma.server.findMany({
    where: { OR: [{ name: { search: searchTerm } }, { name: { contains: searchTerm } }, { ipAddress: { contains: searchTerm } }] },
    orderBy: {
      _relevance: {
        fields: ['name'],
        search: searchTerm,
        sort: 'desc',
      },
    },
    take: MAX_SEARCH_RESULTS,
    include: {
      relatedIsland: true,
    },
  });

  const serialisedServers: Server[] = sortServersByPlayerCount(servers.map(serialiseServer));

  return res.status(200).json(serialisedServers);
});

export default handler;
