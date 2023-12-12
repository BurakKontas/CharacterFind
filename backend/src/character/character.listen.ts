import { Message } from 'amqplib';
import { Result } from 'src/Types/Result';
import { ProxyService, QueueName } from 'src/proxy/proxy.service';
import { CharacterRequest } from './types/character.request';
import { CharacterService } from './character.service';
import { CharacterRequests } from './enums/character.request';

export class CharacterListen {
  constructor(private readonly characterService: CharacterService) {}

  public async startListening(proxyService: ProxyService) {
    return (
      QueueName.CHARACTER_SEARCH,
      async (message: Message) => {
        let uuid = message.properties.headers.uuid;
        let content = JSON.parse(message.content.toString('utf-8')) as CharacterRequest;
        let redirectResult = await this.redirectRequest(content);
        let result: Result = {
          code: 200,
          error: false,
          data: redirectResult,
        };
        await proxyService.sendResultMessage(result, uuid);
      }
    );
  }

  public async redirectRequest(req: CharacterRequest) {
    let result: any;
    switch (req.type) {
      case CharacterRequests.FIND_ONE:
        result = await this.characterService.findOne(req.base64);
        break;
      case CharacterRequests.ADD_ONE:
        result = await this.characterService.create({ base64: req.base64, mal_id: req.mal_id });
        break;
    }
    return result;
  }
}
