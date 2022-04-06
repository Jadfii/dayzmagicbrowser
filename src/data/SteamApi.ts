import { WorkshopMod } from '../types/Types';
import http from '../services/HTTP';
import { mapWorkshopModResponse } from './Mapper';

export async function getWorkshopMods(fileIds: string[]): Promise<WorkshopMod[]> {
  const formattedFileIds = Object.fromEntries(fileIds.map((fileId, i) => [`publishedfileids[${i}]`, fileId]));

  const formParams = new URLSearchParams({ ...formattedFileIds, itemcount: fileIds.length.toString() });

  const modsResponse = await http
    .post(`https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/?key=${process.env.STEAM_API_KEY}`, {
      body: formParams,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    .then((response) => response.json())
    .then((data) => data?.response?.publishedfiledetails)
    .then((mods) => mods.map(mapWorkshopModResponse).sort((a: WorkshopMod, b: WorkshopMod) => (b?.subscriptions || 0) - (a?.subscriptions || 0)));

  return modsResponse;
}
