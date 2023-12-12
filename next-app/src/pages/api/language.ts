import type { NextApiRequest, NextApiResponse } from "next";
import { readFile } from "fs/promises";
import { join } from "path";
import middleware from "../../Middlewares/middleware";

type Data = {
  message: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { language } = req.query;

  if (!language) {
    return res.status(400).json({ message: "Language code is required" });
  }

  const filePath = join(process.cwd(), "Languages", `${language}.json`);

  try {
    const fileContent = await readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(404).json({ message: "Language file not found" });
  }
}

export default middleware(handler, { rateLimit: true, rateLimitSeconds: 1, });
