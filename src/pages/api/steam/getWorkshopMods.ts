import type { NextApiRequest, NextApiResponse } from 'next';
import { getWorkshopMods } from '../../../data/SteamApi';
import nextConnect from 'next-connect';
import rateLimit from '../../../middleware/rateLimit';
import validation, { Joi } from '../../../middleware/validation';

const querySchema = Joi.object({
  modIds: Joi.stringArray(),
});

const handler = nextConnect();

handler.use(rateLimit(3));

handler.get(validation({ query: querySchema }), async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=60');

  try {
    const modIdsQuery = req?.query?.modIds as string;

    const fileIds: string[] = modIdsQuery.split(',');
    const modsResult = await getWorkshopMods(fileIds);

    return res.status(200).json(modsResult);
  } catch (err) {
    console.error(err);

    return res.status(500).json({ error: 'Failed to query Steam API' });
  }
});

export default handler;
