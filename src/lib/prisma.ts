import { PrismaClient, Server as PrismaServer, Island as PrismaIsland } from '@prisma/client';
import { Server, Island } from '../types/Types';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;

export function excludeFromServer<Server, Key extends keyof Server>(model: Server, ...keys: Key[]): Omit<Server, Key> {
  const modelCopy = { ...model };

  for (const key of keys) {
    delete modelCopy[key];
  }

  return modelCopy;
}

export function serialiseServer(server: PrismaServer): Server {
  return {
    ...excludeFromServer(server, 'createdAt', 'updatedAt', 'modIds'),
    modIds: server.modIds.map((modId) => Number(modId)),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ...(server?.relatedIsland ? { relatedIsland: serialiseIsland(server?.relatedIsland) } : {}),
  };
}

export function excludeFromIsland<Island, Key extends keyof Island>(model: Island, ...keys: Key[]): Omit<Island, Key> {
  const modelCopy = { ...model };

  for (const key of keys) {
    delete modelCopy[key];
  }

  return modelCopy;
}

export function serialiseIsland(island: PrismaIsland): Island {
  return {
    ...excludeFromIsland(island, 'createdAt', 'updatedAt'),
  };
}
