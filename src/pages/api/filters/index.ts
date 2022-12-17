import { SelectOption } from './../../../types/Types';
import { getGameVersion, isMatchingVersion } from './../../../data/Version';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma, { serialiseIsland } from '../../../lib/prisma';
import { getWorkshopMods } from '../../../data/SteamApi';
import { findIsland } from '../../../utils/server.util';
import nextConnect from 'next-connect';
import rateLimit from '../../../middleware/rateLimit';

const INITIAL_MOD_COUNT = 50;

const handler = nextConnect();

handler.use(rateLimit());

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  // Caching
  res.setHeader('Cache-Control', `s-maxage=120, stale-while-revalidate`);

  // Get all islands
  const islandsQuery = prisma.island.findMany().then((res) => res.map(serialiseIsland));

  // Get all available islands
  const groupedIslandsQuery = prisma.server.groupBy({
    by: ['island'],
    _count: {
      island: true,
    },
    orderBy: {
      _count: {
        island: 'desc',
      },
    },
  });

  // Get all available versions
  const groupedVersionsQuery = prisma.server.groupBy({
    by: ['version'],
    _count: {
      version: true,
    },
    orderBy: {
      version: 'desc',
    },
  });

  // Get all available mod Ids
  const allServers = await prisma.server.findMany();
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
    const foundIsland = findIsland(curr.island, islands);
    const terrainId = foundIsland?.terrainId || curr?.island;
    const foundIdx = acc.findIndex((filter) => filter?.value === terrainId);

    if (foundIdx === -1) {
      acc.push({ label: foundIsland?.name || curr?.island, value: terrainId, count: curr?._count?.island });
    }

    return acc;
  }, []);

  // Map versions to correct format
  const mappedGroupedVersions = groupedVersions.reduce<SelectOption[]>((acc, curr) => {
    const isLatestStableVersion = isMatchingVersion(curr.version, gameVersion.stable);
    const isLatestExpVersion = !isLatestStableVersion && isMatchingVersion(curr.version, gameVersion.exp);

    acc.push({
      label: curr?.version,
      value: curr?.version,
      count: curr?._count?.version,
      highlighted: isLatestStableVersion,
      highlightedSecondary: isLatestExpVersion,
    });

    return acc;
  }, []);

  return res.status(200).json({ islands: mappedGroupedIslands, versions: mappedGroupedVersions, mods: mappedGroupedMods });
});

export default handler;
