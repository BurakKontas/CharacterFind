import AuthRoles from "@/Enums/authRoles";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { MiddlewareSettings } from "./middleware";

const privateKey = "supertopsecretkey";

export type UserCredidentals = {
  username: string;
  password: string;
  role: AuthRoles;
};

const authMiddleware =
  ({ requiredRole }: MiddlewareSettings): NextApiHandler =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    requiredRole ??= AuthRoles.user;
    const [type, token] = req.headers.authorization?.split(" ") ?? [];
    if (type !== "Bearer") return res.status(401).json({ error: "JWT doğrulama hatası: Bearer değil" });

    let credidentals: UserCredidentals;

    try {
      credidentals = jwt.verify(token, privateKey) as UserCredidentals;
    } catch (error) {
      return res.status(401).json({ error: "JWT doğrulama hatası:" + error });
    }

    if (credidentals!.role !== requiredRole) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    return true;
  };

export default authMiddleware;
