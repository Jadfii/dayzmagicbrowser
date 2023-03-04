import { Server, Island } from '../types/Types';
import psl from 'psl';

export const formatIsland = (island: string): string => island.toLowerCase().trim();
export const findIsland = (terrainId: string, islands: Island[]): Island | undefined =>
  islands.find((island) => (terrainId?.toLowerCase() || '').includes(island?.terrainId?.toLowerCase()));
export const sortServersByPlayerCount = (servers: Server[]): Server[] =>
  servers.sort((a, b) => {
    const aCount = a.queueCount + a.playerCount;
    const bCount = b.queueCount + b.playerCount;

    return bCount - aCount;
  });

export function findDomainInServerName(serverName: string) {
  const nameElements = serverName.split(new RegExp(['\\s', '-', '\\|'].join('|'), 'g'));

  for (let i = 0; i < nameElements.length; i++) {
    const element = nameElements[i];

    if (!element.trim()) continue;

    const parsedDomain = psl.get(element);
    if (parsedDomain) return parsedDomain;
  }

  return undefined;
}

export function getServerWebsite(serverName?: string) {
  if (!serverName) return undefined;

  const foundDomain = findDomainInServerName(serverName);
  if (foundDomain) {
    try {
      const website = `https://${foundDomain}`;
      new URL(website);

      return website;
    } catch (err) {
      return undefined;
    }
  }

  return undefined;
}
