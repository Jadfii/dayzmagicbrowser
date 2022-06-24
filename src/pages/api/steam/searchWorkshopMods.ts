import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { searchWorkshopMods } from '../../../data/SteamApi';
import rateLimit from '../../../middleware/rateLimit';
import validation, { Joi } from '../../../middleware/validation';

const querySchema = Joi.object({
  searchTerm: Joi.string(),
});

const handler = nextConnect();

handler.use(rateLimit(3));

handler.get(validation({ query: querySchema }), async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=60');

  try {
    const searchTerm = req?.query?.searchTerm as string;

    const modsResult = await searchWorkshopMods(searchTerm);

    return res.status(200).json(modsResult);
  } catch (err) {
    console.error(err);

    return res.status(200).json([]);
    //return res.status(500).json({ error: 'Failed to query Steam API' });
  }
});

export default handler;
