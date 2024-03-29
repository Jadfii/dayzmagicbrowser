import type { NextApiRequest, NextApiResponse } from 'next';
import prisma, { serialiseServer } from '../../../../../lib/prisma';
import nextConnect from 'next-connect';
import rateLimit from '../../../../../middleware/rateLimit';
import validation, { Joi } from '../../../../../middleware/validation';
import http from '../../../../../services/HTTP';
import { Server } from '../../../../../types/Types';
import { omit } from 'lodash';

interface ServerUpdate extends Server {
  relatedIslandTerrainId?: string | null;
}

export const updateServerData = async (serverInfo: ServerUpdate) => {
  const server = await prisma.server.update({
    data: {
      ...omit(serverInfo, ['id', 'modIds', 'timeAcceleration', 'relatedIsland']),
      modIds: Array.isArray(serverInfo?.modIds) ? serverInfo.modIds.map((modId) => Number(modId)) : [],
      timeAcceleration: serverInfo.timeAcceleration.join(', '),
    },
    where: {
      id: serverInfo.id,
    },
    include: {
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

handler.patch(validation({ query: querySchema }), async (req: NextApiRequest, res: NextApiResponse) => {
  // Get query params
  const { serverIp, serverPort } = req.query;

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

  const queryParams = `?serverIp=${server.ipAddress}&serverPort=${server.queryPort}`;

  // Update server info via query worker lambda
  const serverUpdateRes = await http<{ data: Omit<Server, 'relatedIsland'>; message: string }>(
    `https://hqheiqz4rcgfkil6a556zpw2tq0nggni.lambda-url.eu-west-2.on.aws/${queryParams}`
  ).then((res) => res.data);

  // Get all islands
  const islands = await prisma.island.findMany();
  const serverIsland = islands.find((island) => serverUpdateRes?.island?.toLowerCase()?.includes(island?.terrainId?.toLowerCase()));

  // Update server in DB
  const updatedServer = await updateServerData({ ...serverUpdateRes, id: server.id, relatedIslandTerrainId: serverIsland?.terrainId || null });

  if (!updatedServer?.ipAddress) {
    return res.status(404).json({ message: 'Server not found' });
  }

  return res.status(200).json(updatedServer);
});

export default handler;
