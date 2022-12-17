import { PrismaClient, Server as PrismaServer, Island as PrismaIsland } from '@prisma/client';
import { Server, Island } from '../types/Types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

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

export function excludeFromServer<PrismaServer, Key extends keyof PrismaServer>(model: PrismaServer, ...keys: Key[]): Omit<PrismaServer, Key> {
  const modelCopy = { ...model };

  for (const key of keys) {
    delete modelCopy[key];
  }

  return modelCopy;
}

export function serialiseServer(
  server: PrismaServer & {
    relatedIsland?: PrismaIsland | null;
  }
): Server {
  return {
    ...excludeFromServer(server, 'createdAt', 'updatedAt', 'modIds', 'timeAcceleration', 'relatedIsland'),
    modIds: Array.isArray(server?.modIds) ? server.modIds.map((modId) => Number(modId)) : [],
    timeAcceleration: server.timeAcceleration.split(', ').map(Number),
    createdAt: server.createdAt.toISOString(),
    updatedAt: server.updatedAt.toISOString(),
    ...(server?.relatedIsland ? { relatedIsland: serialiseIsland(server?.relatedIsland) } : {}),
  };
}

export function excludeFromIsland<PrismaIsland, Key extends keyof PrismaIsland>(model: PrismaIsland, ...keys: Key[]): Omit<PrismaIsland, Key> {
  const modelCopy = { ...model };

  for (const key of keys) {
    delete modelCopy[key];
  }

  return modelCopy;
}

export function serialiseIsland(island: PrismaIsland): Island {
  return {
    ...excludeFromIsland(island, 'createdAt', 'updatedAt'),
    createdAt: island.createdAt.toISOString(),
    updatedAt: island.updatedAt.toISOString(),
  };
}
