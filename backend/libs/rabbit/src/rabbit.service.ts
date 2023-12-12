import { Injectable } from '@nestjs/common';
import { connect, Connection, Channel, Message } from 'amqplib';

@Injectable()
export class RabbitService {
  private connection: Connection;
  private channel: Channel;
  private readonly queueName: string;

  constructor(queueName: string) {
    this.queueName = queueName;
  }

  async connect(durable: boolean = false) {
    try {
      this.connection = await connect('amqp://localhost:5672');
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queueName, { durable });
    } catch (error) {
      console.error('RabbitMQ bağlantısı oluşturulurken hata oluştu:', error);
    }
  }

  async publishMessage(message: string, uuid: string) {
    try {
      this.channel.sendToQueue(this.queueName, Buffer.from(message), {
        headers: {
          uuid,
        },
      });
    } catch (error) {
      console.error('Mesaj gönderilirken hata oluştu:', error);
    }
  }

  consumeMessages(callback: (message: Message | null) => void) {
    try {
      this.channel.consume(this.queueName, callback, { noAck: true });
    } catch (error) {
      console.error('Mesaj tüketimi başlatılırken hata oluştu:', error);
    }
  }

  async closeConnection() {
    try {
      await this.channel.close();
      await this.connection.close();
      console.log('RabbitMQ bağlantısı kapatıldı.');
    } catch (error) {
      console.error('RabbitMQ bağlantısı kapatılırken hata oluştu:', error);
    }
  }
}
