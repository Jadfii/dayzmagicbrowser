import type { NextApiRequest, NextApiResponse } from 'next';
import { searchWorkshopMods } from '../../../data/SteamApi';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=60');

  try {
    const searchTerm = req?.query?.searchTerm;

    if (!searchTerm || typeof searchTerm !== 'string') return res.status(400).json({ error: 'Invalid search term provided' });

    const modsResult = await searchWorkshopMods(searchTerm);

    return res.status(200).json(modsResult);
  } catch (err) {
    console.error(err);

    return res.status(200).json([]);
    //return res.status(500).json({ error: 'Failed to query Steam API' });
  }
};

export default handler;
