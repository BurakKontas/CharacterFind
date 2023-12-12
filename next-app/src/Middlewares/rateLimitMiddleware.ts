import RedisClient from "@/Infrastructure/Redis";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { MiddlewareSettings } from "./middleware";

let redis = RedisClient.getInstance();

const rateLimitMiddleware =
  ({ rateLimitSeconds }: MiddlewareSettings): NextApiHandler =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    rateLimitSeconds ??= 5;
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const route = req.url;
    const key = `middleware-${route}:${ipAddress}`;
    const value = await redis.get(key);

    if (value) return res.status(429).json({ message: "Too many requests" });
    else if (!value) await redis.set(key, "true", rateLimitSeconds);
    return true;
  };

export default rateLimitMiddleware;
