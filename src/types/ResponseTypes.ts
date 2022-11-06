export interface IPublishedFileService_GetDetails_Response {
  response: {
    publishedfiledetails: WorkshopModResponse[];
  };
}

export interface IPublishedFileService_QueryFiles_Response {
  response: {
    publishedfiledetails: WorkshopModResponse[];
  };
}

export interface MagicLauncher_Version_Response {
  version: string;
  version_exp: string;
}

export interface WorkshopModTagResponse {
  tag: string;
  display_name: string;
}

export interface WorkshopModResponse {
  ban_reason: string;
  banned: number;
  consumer_appid: number;
  creator: string;
  creator_appid: number;
  file_description: string;
  favorited: number;
  file_size: number;
  file_url: string;
  filename: string;
  hcontent_file: string;
  hcontent_preview: string;
  lifetime_favorited: number;
  lifetime_subscriptions: number;
  preview_url: string;
  publishedfileid: string;
  result: number;
  subscriptions: number;
  tags: WorkshopModTagResponse[];
  time_created: number;
  time_updated: number;
  title: string;
  views: number;
  visibility: number;
}

export interface VersionResponse {
  stable: string;
  exp: string;
}
