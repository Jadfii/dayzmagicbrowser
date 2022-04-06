export const STEAM_PROFILE = `https://steamcommunity.com/profiles/`;
export const STEAM_WORKSHOP_ITEM = `https://steamcommunity.com/sharedfiles/filedetails/?id=`;
export const IMAGE_BUCKET = `https://dayz-magic-launcher.s3.eu-west-2.amazonaws.com/images/`;
export const IMAGE_CDN_URL = `https://ik.imagekit.io/dayzmagiclauncher`;

export const getIslandImageURL = (terrainId?: string): string | undefined => (terrainId ? `/images/terrains/${terrainId}.jpg` : undefined);
