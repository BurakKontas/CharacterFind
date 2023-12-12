import { RabbitMQClient } from "@/Infrastructure/RabbitMQ";
import type { NextApiRequest, NextApiResponse } from "next";
import middleware from "../../Middlewares/middleware";

type Data = {
  message: string;
};

let rabbit = RabbitMQClient.getInstance("character-search");
rabbit.connect();

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    return res.status(202).json({ message: "Character search is started" });
  } catch (error) {
    return res.status(404).json({ message: "404" });
  }
}

export default middleware(handler, { rateLimit: true, rateLimitSeconds: 5 });
