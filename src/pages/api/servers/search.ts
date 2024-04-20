import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import rateLimit from '../../../middleware/rateLimit';
import validation, { Joi } from '../../../middleware/validation';
import { sortServersByPlayerCount } from '../../../utils/server.util';
import { serialiseServer } from '../../../../drizzle/schema/server';
import { db } from '../../../lib/drizzle';

const MAX_SEARCH_RESULTS = 30;

const querySchema = Joi.object({
  name: Joi.string().required(),
});

const handler = nextConnect();

handler.use(rateLimit());

handler.get(validation({ query: querySchema }), async (req: NextApiRequest, res: NextApiResponse) => {
  const searchTermParam = req?.query?.name;
  let searchTerm = '';

  if (Array.isArray(searchTermParam)) searchTerm = searchTermParam?.[0];
  else searchTerm = searchTermParam ?? '';
  // Trim and replace whitespace with underscores
  searchTerm = searchTerm
    .trim()
    .replace(/[\s\n\t]/g, '_')
    .toLowerCase();

  const servers = await db.query.server.findMany({
    where: (servers, { sql, or }) =>
      or(sql`lower(${servers.name}) LIKE ${`%${searchTerm}%`}`, sql`lower(${servers.ipAddress}) LIKE ${`%${searchTerm}%`}`),
    limit: MAX_SEARCH_RESULTS,
    with: {
      relatedIsland: true,
    },
  });

  const serialisedServers = sortServersByPlayerCount(servers.map(serialiseServer));

  return res.status(200).json(serialisedServers);
});

export default handler;
