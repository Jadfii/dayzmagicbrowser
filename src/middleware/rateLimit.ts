import limit from 'lambda-rate-limiter';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';

const limiter = limit({ interval: 10 * 1000 });

const rateLimit =
  (limitPerTenSeconds = 5) =>
  async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const clientIp = req?.headers?.['x-real-ip'] || req?.socket.remoteAddress;

    if (typeof clientIp !== 'string') {
      return res.status(500).json({ error: { message: 'Unable to get client IP Address.' } });
    }

    if (!req?.url) return res.status(500).json({ error: { message: 'Unable to rate limit token.' } });

    const parsedURL = new URL(req.url, `http://${req.headers.host}`);

    const token = `${clientIp}-${parsedURL?.pathname}`;

    try {
      await limiter.check(limitPerTenSeconds, token);

      return next();
    } catch (err: unknown) {
      return res.status(429).json({ error: { message: 'Rate limited', token: token } });
    }
  };

export default rateLimit;
