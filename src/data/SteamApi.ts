import { IPublishedFileService_GetDetails_Response, IPublishedFileService_QueryFiles_Response } from './../types/ResponseTypes';
import { WorkshopMod } from '../types/Types';
import http from '../services/HTTP';
import { mapWorkshopModResponse } from './Mapper';
import { DAYZ_APPID } from '../constants/game.constant';

export async function getWorkshopMods(fileIds: string[]): Promise<WorkshopMod[]> {
  const formattedFileIds = Object.fromEntries(fileIds.map((fileId, i) => [`publishedfileids[${i}]`, fileId]));

  const modsQueryString = Object.entries(formattedFileIds)
    .map(([key, val]) => `${key}=${val}`)
    .join('&');

  const modsResponse = await http<IPublishedFileService_GetDetails_Response>(
    `https://api.steampowered.com/IPublishedFileService/GetDetails/v1/?key=${process.env.STEAM_API_KEY}&${modsQueryString}`
  )
    .then((data) => data?.response?.publishedfiledetails)
    .then((mods) =>
      mods
        .map(mapWorkshopModResponse)
        .filter((mod: WorkshopMod) => mod.name)
        .sort((a: WorkshopMod, b: WorkshopMod) => (b?.subscriptions || 0) - (a?.subscriptions || 0))
    );

  return modsResponse;
}

export async function searchWorkshopMods(searchTerm: string): Promise<WorkshopMod[]> {
  const modsResponse = await http<IPublishedFileService_QueryFiles_Response>(
    `https://api.steampowered.com/IPublishedFileService/QueryFiles/v1/?key=${
      process.env.STEAM_API_KEY
    }&query_type=12&page=0&numperpage=20&return_details=true&appid=${DAYZ_APPID}&search_text=${encodeURI(searchTerm)}`
  )
    .then((data) => data?.response?.publishedfiledetails)
    .then((mods) =>
      mods
        .map(mapWorkshopModResponse)
        .filter((mod: WorkshopMod) => mod.name)
        .sort((a: WorkshopMod, b: WorkshopMod) => (b?.subscriptions || 0) - (a?.subscriptions || 0))
        .slice(0, 100)
    );

  return modsResponse;
}
