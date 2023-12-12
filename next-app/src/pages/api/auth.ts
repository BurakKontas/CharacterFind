import { RabbitMQClient } from "@/Infrastructure/RabbitMQ";
import Socket from "@/Infrastructure/Socket";
import middleware from "@/Middlewares/middleware";
import type { NextApiRequest, NextApiResponse } from "next";

let rabbit = RabbitMQClient.getInstance("auth");
let socket = Socket.getInstance();
let connected = false;
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!connected) {
    await rabbit.connect();
    connected = true;
  }
  if (req.method !== "POST") return res.status(404).json({ message: "404" });
  try {
    let result = await socket.sendRequest(req.body, rabbit);
    return res.status(result.code).json({ message: result });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "404" });
  }
}

export default middleware(handler, { rateLimit: false, rateLimitSeconds: 10 });
