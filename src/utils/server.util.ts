import { Server } from '../types/Types';

export const formatIsland = (island: string): string => island.toLowerCase().trim();
export const sortServersByPlayerCount = (servers: Server[]): Server[] =>
  servers.sort((a, b) => {
    const aCount = a.queueCount + a.playerCount;
    const bCount = b.queueCount + b.playerCount;

    return bCount - aCount;
  });
