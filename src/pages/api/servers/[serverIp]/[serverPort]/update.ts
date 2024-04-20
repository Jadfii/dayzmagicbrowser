import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import rateLimit from '../../../../../middleware/rateLimit';
import validation, { Joi } from '../../../../../middleware/validation';
import http from '../../../../../services/HTTP';
import { Server } from '../../../../../types/Types';
import { omit } from 'lodash';
import { serialiseServer, server } from '../../../../../../drizzle/schema/server';
import { db } from '../../../../../lib/drizzle';
import { eq } from 'drizzle-orm';

interface ServerUpdate extends Server {
  relatedIslandTerrainId?: string | null;
}

export const updateServerData = async (serverInfo: ServerUpdate) => {
  const updatedServers = await db
    .update(server)
    .set({
      ...omit(serverInfo, ['id', 'modIds', 'timeAcceleration', 'relatedIsland', 'createdAt', 'updatedAt']),
      updatedAt: new Date(),
      modIds: Array.isArray(serverInfo?.modIds) ? serverInfo.modIds.map((modId) => Number(modId)) : [],
      timeAcceleration: serverInfo.timeAcceleration.join(', '),
    })
    .where(eq(server.id, serverInfo.id))
    .returning();

  const updatedServer = updatedServers[0];
  if (!updatedServer?.ipAddress) return undefined;

  return serialiseServer(updatedServer);
};

const querySchema = Joi.object({
  serverIp: Joi.string().required(),
  serverPort: Joi.string().required(),
});

const handler = nextConnect();

handler.use(rateLimit());

handler.patch(validation({ query: querySchema }), async (req: NextApiRequest, res: NextApiResponse) => {
  // Get query params
  const { serverIp, serverPort } = req.query;

  const origServer = await db.query.server.findFirst({
    where: (servers, { eq, and }) => and(eq(servers.ipAddress, String(serverIp)), eq(servers.gamePort, Number(serverPort))),
    with: {
      relatedIsland: true,
    },
  });

  if (!origServer?.ipAddress) {
    return res.status(404).json({ message: 'Server not found' });
  }

  const queryParams = `?serverIp=${origServer.ipAddress}&serverPort=${origServer.queryPort}`;

  // Update server info via query worker lambda
  const serverUpdateRes = await http<{ data: Omit<Server, 'relatedIsland'>; message: string }>(
    `https://hqheiqz4rcgfkil6a556zpw2tq0nggni.lambda-url.eu-west-2.on.aws/${queryParams}`
  ).then((res) => res.data);

  // Get all islands
  const islands = await db.query.island.findMany();
  const serverIsland = islands.find((island) => serverUpdateRes?.island?.toLowerCase()?.includes(island?.terrainId?.toLowerCase()));

  // Update server in DB
  const updatedServer = await updateServerData({ ...serverUpdateRes, id: origServer.id, relatedIslandTerrainId: serverIsland?.terrainId || null });

  if (!updatedServer?.ipAddress) {
    return res.status(404).json({ message: 'Server not found' });
  }

  return res.status(200).json(updatedServer);
});

export default handler;
