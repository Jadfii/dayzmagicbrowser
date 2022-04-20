import type { NextApiRequest, NextApiResponse } from 'next';
import { getWorkshopMods } from '../../../data/SteamApi';
import nextConnect from 'next-connect';
import rateLimit from '../../../middleware/rateLimit';

const handler = nextConnect();

handler.use(rateLimit(3));

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
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
});

export default handler;
