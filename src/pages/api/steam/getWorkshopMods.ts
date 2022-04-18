import type { NextApiRequest, NextApiResponse } from 'next';
import { getWorkshopMods } from '../../../data/SteamApi';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=60');

  try {
    const modIdsQuery = req?.query?.modIds;

    if (!modIdsQuery || typeof modIdsQuery !== 'string') return res.status(400).json({ error: 'Invalid mod IDs provided' });

    const fileIds: string[] = modIdsQuery.split(',');
    const modsResult = await getWorkshopMods(fileIds);

    return res.status(200).json(modsResult);
  } catch (err) {
    console.error(err);

    return res.status(500).json({ error: 'Failed to query Steam API' });
  }
};

export default handler;
