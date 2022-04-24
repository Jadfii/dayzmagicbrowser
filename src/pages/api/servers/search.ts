import type { NextApiRequest, NextApiResponse } from 'next';
import prisma, { serialiseServer } from '../../../lib/prisma';
import { Server } from '../../../types/Types';
import nextConnect from 'next-connect';
import rateLimit from '../../../middleware/rateLimit';

const handler = nextConnect();

handler.use(rateLimit());

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  let searchTerm = req?.query?.name;

  if (!searchTerm) return res.status(400).json({ error: 'No search term provided.' });

  if (Array.isArray(searchTerm)) searchTerm = searchTerm?.[0];

  const servers = await prisma.server.findMany({
    where: {
      name: {
        search: searchTerm.split(' ').join(' & '),
      },
    },
    include: {
      relatedIsland: true,
    },
  });

  const serialisedServers: Server[] = servers.map(serialiseServer);

  return res.status(200).json(serialisedServers);
});

export default handler;
