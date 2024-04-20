import { SelectOption } from './../../../types/Types';
import { getGameVersion, isMatchingVersion } from './../../../data/Version';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getWorkshopMods } from '../../../data/SteamApi';
import { findIsland } from '../../../utils/server.util';
import nextConnect from 'next-connect';
import rateLimit from '../../../middleware/rateLimit';
import { db } from '../../../lib/drizzle';
import { serialiseIsland } from '../../../../drizzle/schema/island';
import { countDistinct, desc } from 'drizzle-orm';
import { server } from '../../../../drizzle/schema/server';

const INITIAL_MOD_COUNT = 50;

export const getAvailableFiltersData = async () => {
  // Get all islands
  const islandsQuery = db.query.island.findMany().then((res) => res.map(serialiseIsland));

  // Get all available islands
  const groupedIslandsQuery = db
    .select({
      _count: countDistinct(server.id),
      island: server.island,
    })
    .from(server)
    .groupBy(server.island)
    .orderBy((query) => desc(query._count));

  // Get all available versions
  const groupedVersionsQuery = db
    .select({ _count: countDistinct(server.id).as('count'), version: server.version })
    .from(server)
    .groupBy(server.version)
    .orderBy((query) => desc(query._count));

  // Get all available mod Ids
  const allServers = await db.query.server.findMany();
  const allModIds = allServers
    .flatMap((server) => (Array.isArray(server?.modIds) ? server.modIds.map(String) : []))
    .reduce<{ [modId: string]: number }>((acc, curr) => {
      return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
    }, {});
  const limitedModIds = Object.entries(allModIds)
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key)
    .slice(0, INITIAL_MOD_COUNT);

  // Run queries
  const [islands, groupedIslands, groupedVersions, enrichedGroupedMods, gameVersion] = await Promise.all([
    islandsQuery,
    groupedIslandsQuery,
    groupedVersionsQuery,
    getWorkshopMods(limitedModIds),
    getGameVersion(),
  ]);

  // Map to enriched data (to get mod name/label)
  const mappedGroupedMods = limitedModIds.map((modId, i) => {
    const matchedMod = enrichedGroupedMods?.[i];

    return {
      value: modId,
      ...(matchedMod?.name ? { label: matchedMod?.name } : {}),
    };
  });

  // Match islands to saved islands in DB
  // then map to correct format
  const mappedGroupedIslands = groupedIslands.reduce<SelectOption[]>((acc, curr) => {
    const foundIsland = findIsland(curr.island ?? '', islands);
    const terrainId = foundIsland?.terrainId || curr?.island || '';
    const name = foundIsland?.name || curr?.island || '';
    const foundIdx = acc.findIndex((filter) => filter?.value === terrainId);

    if (foundIdx === -1 && name && terrainId) {
      acc.push({ label: name, value: terrainId, count: curr?._count });
    }

    return acc;
  }, []);

  // Map versions to correct format
  const mappedGroupedVersions = groupedVersions.reduce<SelectOption[]>((acc, curr) => {
    const isLatestStableVersion = isMatchingVersion(curr.version, gameVersion?.stable);
    const isLatestExpVersion = !isLatestStableVersion && isMatchingVersion(curr.version, gameVersion?.exp);

    acc.push({
      label: curr?.version,
      value: curr?.version,
      count: curr?._count,
      highlighted: isLatestStableVersion,
      highlightedSecondary: isLatestExpVersion,
    });

    return acc;
  }, []);

  return { islands: mappedGroupedIslands, versions: mappedGroupedVersions, mods: mappedGroupedMods };
};

const handler = nextConnect();

handler.use(rateLimit());

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  // Caching
  res.setHeader('Cache-Control', `s-maxage=120, stale-while-revalidate`);

  const data = await getAvailableFiltersData();
  return res.status(200).json(data);
});

export default handler;
