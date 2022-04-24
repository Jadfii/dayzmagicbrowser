import { SelectOption } from './../../../types/Types';
import { getGameVersion, isMatchingVersion } from './../../../data/Version';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { findIsland } from '../../../state/islands';
import { getWorkshopMods } from '../../../data/SteamApi';

const INITIAL_MOD_COUNT = 50;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Caching
  res.setHeader('Cache-Control', `s-maxage=120, stale-while-revalidate`);

  // Get all islands
  const islandsQuery = prisma.island.findMany();

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
  const allModIds = await prisma.server.groupBy({
    by: ['modIds'],
    orderBy: {
      modIds: 'desc',
    },
  });

  // Group and sort by occurence
  let mappedGroupedMods = allModIds
    .flatMap((m) => m.modIds)
    .reduce<SelectOption[]>((acc, curr) => {
      const currentModId = Number(curr);
      const foundIdx = acc.findIndex((mod) => mod.value === currentModId);

      if (foundIdx === -1) {
        acc.push({ value: currentModId, count: 1 });
      } else {
        acc[foundIdx].count += 1;
      }

      return acc;
    }, [])
    .sort((a, b) => b.count - a.count);

  // Run queries
  const [islands, groupedIslands, groupedVersions, enrichedGroupedMods, gameVersion] = await Promise.all([
    islandsQuery,
    groupedIslandsQuery,
    groupedVersionsQuery,
    getWorkshopMods(mappedGroupedMods.slice(0, INITIAL_MOD_COUNT).map((mod) => String(mod.value))),
    getGameVersion(),
  ]);

  // Map to enriched data (to get mod name/label)
  mappedGroupedMods = mappedGroupedMods.map((mod) => {
    const matchedMod = enrichedGroupedMods.find((m) => m.id === String(mod.value));

    return {
      ...mod,
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
};

export default handler;
