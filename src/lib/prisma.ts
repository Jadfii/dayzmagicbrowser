import { PrismaClient, Server as PrismaServer } from '@prisma/client';
import { Server } from '../types/Types';

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

  for (let key of keys) {
    delete modelCopy[key];
  }

  return modelCopy;
}

export function serialiseServer(server: PrismaServer): Server {
  return {
    ...excludeFromServer(server, 'createdAt', 'updatedAt', 'modIds'),
    modIds: server.modIds.map((modId) => Number(modId)),
  };
}
