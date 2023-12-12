import * as amqp from "amqplib";

export class RabbitMQClient {
  private static instance: RabbitMQClient;
  private connection!: amqp.Connection;
  private channel!: amqp.Channel;
  private queueName: string;

  private constructor(queueName: string) {
    this.queueName = queueName;
  }

  public static getInstance(queueName: string): RabbitMQClient {
    if (!RabbitMQClient.instance) {
      RabbitMQClient.instance = new RabbitMQClient(queueName);
    }
    return RabbitMQClient.instance;
  }

  public async connect() {
    try {
      this.connection = await amqp.connect("amqp://localhost:5672");
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable: false });
    } catch (error) {
      console.error("RabbitMQ bağlantısı oluşturulurken hata oluştu:", error);
    }
  }

  public async publishMessage(message: any, headers: any = {}) {
    try {
      message = JSON.stringify(message);
      this.channel.sendToQueue(this.queueName, Buffer.from(message), {
        headers: {
          ...headers,
        },
      });
    } catch (error) {
      console.error("Mesaj gönderilirken hata oluştu:", error);
    }
  }

  public async consumeMessage(callback: (message: string) => void) {
    try {
      this.channel.consume(this.queueName, (message) => {
        if (message) {
          callback(message.content.toString());
          this.channel.ack(message);
        }
      });
    } catch (error) {
      console.error("Mesaj dinlenirken hata oluştu:", error);
    }
  }

  public async closeConnection() {
    try {
      await this.channel.close();
      await this.connection.close();
      console.log("RabbitMQ bağlantısı kapatıldı.");
    } catch (error) {
      console.error("RabbitMQ bağlantısı kapatılırken hata oluştu:", error);
    }
  }
}
