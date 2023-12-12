import { Injectable, Logger } from '@nestjs/common';
import { RabbitService } from '@rabbit/rabbit';
import { Result } from 'src/Types/Result';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CharacterService } from 'src/character/character.service';
import { UsersService } from 'src/users/users.service';
import { AuthListen } from 'src/auth/auth.listen';
import { CharacterListen } from 'src/character/character.listen';

export enum QueueName {
  AUTH = 'auth',
  CHARACTER_SEARCH = 'character-search',
  SEARCH = 'search',
  METADATA = 'metadata',
  RECOMMENDATION = 'recommendation',
  RESULT = 'result',
}

@Injectable()
export class ProxyService {
  private rabbitService: Map<string, RabbitService> = new Map();
  private readonly logger = new Logger('ProxyService');

  constructor(private readonly authService: AuthService, private readonly characterService: CharacterService, private readonly jwtService: JwtService, private readonly usersService: UsersService) {
    this.rabbitService.set('auth', new RabbitService('auth')); // auth
    this.rabbitService.set('character-search', new RabbitService('character-search')); // weaviate
    this.rabbitService.set('search', new RabbitService('search')); // elastic-search
    this.rabbitService.set('metadata', new RabbitService('metadata')); // metadata
    this.rabbitService.set('recommendation', new RabbitService('recommendation')); // recommendation
    this.rabbitService.set('result', new RabbitService('result')); // recommendation
    this.connect().then(async () => {
      await this.startListening();
    });
  }

  public async connect(): Promise<void[]> {
    const connectPromises: Promise<void>[] = [];

    this.rabbitService.forEach((value, key) => {
      this.logger.verbose(`Connecting to ${key} queue`);
      connectPromises.push(value.connect());
    });

    return Promise.all(connectPromises);
  }

  public async startListening() {
    const authListen = new AuthListen(this.usersService, this.jwtService, this.authService);
    this.rabbitService.get('auth').consumeMessages(await authListen.startListening(this));
    this.logger.verbose('Listening to auth queue');
    const characterListen = new CharacterListen(this.characterService);
    this.rabbitService.get('character-search').consumeMessages(await characterListen.startListening(this));
    this.logger.verbose('Listening to character-search queue');
  }

  public async sendResultMessage(message: Result, uuid: string) {
    await this.rabbitService.get('result').publishMessage(JSON.stringify(message), uuid);
  }
}
