const http = async <T = unknown>(...args: Parameters<typeof fetch>) => {
  const response = await fetch(...args).then((res) => res.json());

  return response as T;
};

export default http;
