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

    try {
      await limiter.check(limitPerTenSeconds, clientIp);

      return next();
    } catch (err: unknown) {
      return res.status(429).json({ error: { message: 'Rate limited', token: clientIp } });
    }
  };

export default rateLimit;
