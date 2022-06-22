import type { NextApiRequest, NextApiResponse } from 'next';
import prisma, { serialiseServer } from '../../../lib/prisma';
import { Server } from '../../../types/Types';
import nextConnect from 'next-connect';
import rateLimit from '../../../middleware/rateLimit';

const MAX_SEARCH_RESULTS = 30;

const handler = nextConnect();

handler.use(rateLimit());

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  let searchTerm = req?.query?.name;

  if (!searchTerm) return res.status(400).json({ error: 'No search term provided.' });

  if (Array.isArray(searchTerm)) searchTerm = searchTerm?.[0];
  // Trim and replace whitespace with underscores
  searchTerm = searchTerm.trim().replace(/[\s\n\t]/g, '_');
  searchTerm = `%${searchTerm}%`;

  // Have to use queryRaw because "LIKE" is not supported in prisma yet
  const ids = await prisma.$queryRaw<{ id: string }[]>`SELECT id FROM "Server" WHERE name ILIKE ${searchTerm} LIMIT ${MAX_SEARCH_RESULTS};`;

  const servers = await prisma.server.findMany({
    where: { id: { in: ids.map((row) => row.id) } },
    include: {
      relatedIsland: true,
    },
  });

  const serialisedServers: Server[] = servers.map(serialiseServer);

  return res.status(200).json(serialisedServers);
});

export default handler;
