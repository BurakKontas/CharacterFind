import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const serverOnlyMiddleware = (): NextApiHandler => async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.headers["x-forwarded-for"] !== undefined) {
    return res.status(403).json({ message: "Forbidden" });
  }

  return true;
};

export default serverOnlyMiddleware;
