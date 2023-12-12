import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import amqp from "amqplib";

// Express uygulamasını oluşturun
const app = express();
const server = createServer(app);

const socketPORT = 3010;
const rabbitMQConnectionURL = "amqp://localhost:5672";

const io = new Server(server);

let connection = await amqp.connect(rabbitMQConnectionURL);
let channel = await connection.createChannel();
const queue = "result";

channel.assertQueue(queue, {
  durable: false,
});

console.log("RabbitMQ'ya bağlanıldı. Mesajları dinleme başladı...");

channel.consume(
  queue,
  (message) => {
    const data = JSON.parse(message.content.toString());
    io.emit(`${message.properties.headers.uuid}`, data);
  },
  {
    noAck: true,
  }
);

server.listen(socketPORT, () => {
  console.log(`Socket.IO sunucusu ${socketPORT} portunda çalışıyor...`);
});
