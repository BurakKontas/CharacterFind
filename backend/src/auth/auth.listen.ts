import { Dependencies } from '@nestjs/common';
import { Result } from 'src/Types/Result';
import { ProxyService, QueueName } from 'src/proxy/proxy.service';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Message } from 'amqplib';

@Dependencies(UsersService, JwtService)
export class AuthListen {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService, private readonly authService: AuthService) {}

  public async startListening(proxyService: ProxyService) {
    return (
      QueueName.AUTH,
      async (message: Message) => {
        let uuid = message.properties.headers.uuid;
        let content = JSON.parse(message.content.toString('utf-8'));
        try {
          let signIn = await this.authService.signIn(content.username, content.password);
          let result: Result = {
            code: 200,
            error: false,
            data: signIn,
          };
          await proxyService.sendResultMessage(result, uuid);
        } catch (error) {
          let result: Result = {
            code: 401,
            error: true,
            data: error,
          };
          await proxyService.sendResultMessage(result, uuid);
        }
      }
    );
  }
}
