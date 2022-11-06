import http from '../services/HTTP';

export async function fetcher<JSON = unknown>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  return await http(input, init).then((res) => res.json());
}
