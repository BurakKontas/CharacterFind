import RedisClient from "@/Infrastructure/Redis";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import authMiddleware from "./authenticationMiddleware";
import AuthRoles from "@/Enums/authRoles";
import rateLimitMiddleware from "./rateLimitMiddleware";
import serverOnlyMiddleware from "./serverOnlyMiddleware";

export type MiddlewareSettings = {
  auth?: boolean;
  rateLimit?: boolean;
  rateLimitSeconds?: number;
  requiredRole?: AuthRoles;
  serverOnly?: boolean;
};

const middleware =
  (handler: NextApiHandler, settings: MiddlewareSettings = {}): NextApiHandler =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (settings.rateLimit) {
      let result = await rateLimitMiddleware(settings)(req, res);
      if (!result) return;
    }
    if (settings.auth) {
      let result = await authMiddleware(settings)(req, res);
      if (!result) return;
    }
    if (settings.serverOnly) {
      let result = await serverOnlyMiddleware()(req, res);
      if (!result) return;
    }

    return handler(req, res);
  };

export default middleware;
