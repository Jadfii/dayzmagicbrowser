import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import rateLimit from '../../../../../middleware/rateLimit';
import validation, { Joi } from '../../../../../middleware/validation';
import { db } from '../../../../../lib/drizzle';
import { serialiseServer } from '../../../../../../drizzle/schema/server';

export const getServerPageData = async (ipAddress: string, gamePort: number) => {
  const server = await db.query.server.findFirst({
    where: (servers, { eq, and }) => and(eq(servers.ipAddress, ipAddress), eq(servers.gamePort, gamePort)),
    with: {
      relatedIsland: true,
    },
  });

  if (!server?.ipAddress) return undefined;

  return serialiseServer(server);
};

const querySchema = Joi.object({
  serverIp: Joi.string().required(),
  serverPort: Joi.string().required(),
});

const handler = nextConnect();

handler.use(rateLimit());

handler.get(validation({ query: querySchema }), async (req: NextApiRequest, res: NextApiResponse) => {
  // Get query params
  const { serverIp, serverPort } = req.query;

  // Get servers
  const server = await getServerPageData(serverIp as string, Number(serverPort));

  if (!server?.ipAddress) {
    return res.status(404).json({ message: 'Server not found' });
  }

  return res.status(200).json(server);
});

export default handler;
