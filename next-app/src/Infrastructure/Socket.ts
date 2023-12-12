import io from "socket.io-client";
import { Socket as SocketIOClient } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

import { RabbitMQClient } from "./RabbitMQ";
import { Result } from "@/Types/Result";

class Socket {
  private static instance: Socket;
  private socket: SocketIOClient;

  private constructor(socketUrl: string) {
    this.socket = io(socketUrl);
  }

  public static getInstance(): Socket {
    if (!Socket.instance) {
      Socket.instance = new Socket("http://localhost:3010");
    }
    return Socket.instance;
  }

  public sendRequest(data: any, rabbit: RabbitMQClient): Promise<any> {
    return new Promise((resolve, _) => {
      const uuid = uuidv4();

      rabbit.publishMessage(data, { uuid });

      const timeout = setTimeout(() => {
        resolve({ data: "Request timeout", error: true, code: 408 });
      }, 30000);

      this.socket.on(uuid, (result: Result) => {
        clearTimeout(timeout);
        resolve({ data: result.data, error: result.error, code: result.code });
      });
    });
  }
}

export default Socket;
