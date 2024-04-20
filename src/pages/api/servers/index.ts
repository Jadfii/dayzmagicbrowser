import type { NextApiRequest, NextApiResponse } from 'next';
import { SERVER_FILTERS } from '../../../types/Types';
import nextConnect from 'next-connect';
import rateLimit from '../../../middleware/rateLimit';
import { DAYZ_EXP_APPID } from '../../../constants/game.constant';
import { sortServersByPlayerCount } from '../../../utils/server.util';
import { SERVERS_PAGE_SERVERS_COUNT } from '../../../constants/layout.constant';
import validation, { Joi } from '../../../middleware/validation';
import { getEnumValues } from '../../../utils/enum.util';
import { db } from '../../../lib/drizzle';
import { serialiseServer, server } from '../../../../drizzle/schema/server';
import { sql, and, eq } from 'drizzle-orm';

export const getServersPageData = async (queryParams: NextApiRequest['query'] = {}) => {
  // Get query params
  const { name, island, version, mods, firstperson, official, experimental, noqueue } = queryParams;

  const filters = and(
    ...[
      ...(typeof name === 'string' ? [sql`lower(${server.name}) LIKE ${`%${name.toLowerCase()}%`}`] : []),
      ...(typeof island === 'string' ? [sql`lower(${server.island}) LIKE ${`%${island.toLowerCase()}%`}`] : []),
      ...(typeof version === 'string' ? [eq(server.version, version)] : []),
      ...(typeof firstperson === 'string' ? [eq(server.isFirstPerson, true)] : []),
      ...(typeof official === 'string' ? [eq(server.isPublicHive, true)] : []),
      ...(typeof experimental === 'string' ? [eq(server.appId, DAYZ_EXP_APPID)] : []),
      ...(typeof noqueue === 'string' ? [eq(server.queueCount, 0)] : []),
      ...(typeof mods === 'string' ? [and(...mods.split(',').map((modId) => sql`(${server.modIds})::jsonb @> ${modId}`))] : []),
    ]
  );

  // Get servers
  const serversQuery = db.query.server.findMany({
    orderBy: (servers, { desc }) => [desc(servers.playerCount), desc(servers.queueCount)],
    limit: SERVERS_PAGE_SERVERS_COUNT,
    where: filters,
    with: {
      relatedIsland: true,
    },
  });

  const serversCountQuery = db
    .select({ count: sql<number>`count(${server.id})`.mapWith(Number) })
    .from(server)
    .where(filters)
    .limit(1);

  const [servers, serversCount] = await Promise.all([serversQuery, serversCountQuery]);

  // Serialise servers so they can be passed to component
  return { servers: sortServersByPlayerCount(servers.map(serialiseServer)), count: serversCount.map((res) => res.count)[0] };
};

const querySchema = Joi.object(Object.fromEntries(getEnumValues(SERVER_FILTERS).map((key) => [key, Joi.string()])));

const handler = nextConnect();

handler.use(rateLimit());

handler.get(validation({ query: querySchema }), async (req: NextApiRequest, res: NextApiResponse) => {
  // Caching
  res.setHeader('Cache-Control', `s-maxage=120, stale-while-revalidate`);

  // Get servers
  const data = await getServersPageData(req.query);
  return res.status(200).json(data);
});

export default handler;
