import ky, { SearchParamsOption } from 'ky';

const config = {
  prefixUrl: process.env.NODE_ENV === 'development' ? `http://localhost:5000` : `https://browser-api.dayzmagiclauncher.com`,
};

const instance = ky.create({
  ...config,
});

export const request = async (method: string, url: string, data: SearchParamsOption | undefined): Promise<any | Error> => {
  const result = await instance(url, {
    method,
    ...(method === 'GET' ? { searchParams: data } : { data }),
  });

  return result.json();
};

export const get = async (url: string, data?: Record<string, number | string | boolean>): Promise<any | Error> => await request('GET', url, data);
export const post = async (url: string, data?: SearchParamsOption): Promise<any | Error> => await request('POST', url, data);

export default instance;
