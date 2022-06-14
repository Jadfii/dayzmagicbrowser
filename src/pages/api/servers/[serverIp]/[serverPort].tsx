import type { NextApiRequest, NextApiResponse } from 'next';
import prisma, { serialiseServer } from '../../../../lib/prisma';
import nextConnect from 'next-connect';
import rateLimit from '../../../../middleware/rateLimit';

const handler = nextConnect();

handler.use(rateLimit());

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  // Caching
  res.setHeader('Cache-Control', `s-maxage=30, stale-while-revalidate`);

  // Get query params
  const { serverIp, serverPort } = req.query;

  if (!serverIp || !serverPort) {
    return res.status(400).json({ message: 'Invalid server parameters provided' });
  }

  // Get servers
  const server = await prisma.server.findFirst({
    where: {
      ipAddress: serverIp as string,
      gamePort: Number(serverPort),
    },
    include: {
      relatedIsland: true,
    },
  });

  if (!server?.ipAddress) {
    return res.status(404).json({ message: 'Server not found' });
  }

  // Serialise servers so they can be passed to component
  const serialisedServer = serialiseServer(server);

  return res.status(200).json(serialisedServer);
});

export default handler;
