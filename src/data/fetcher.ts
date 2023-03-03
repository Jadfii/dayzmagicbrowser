export async function fetcher<JSON = unknown>(input: RequestInfo | URL, init?: RequestInit): Promise<JSON> {
  return await fetch(input, init).then((res) => res.json() as JSON);
}
