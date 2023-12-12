import { Injectable } from '@nestjs/common';
import weaviate, { WeaviateClient } from 'weaviate-ts-client';

@Injectable()
export class WeaviateService {
  private client: WeaviateClient;
  private static instance: WeaviateService;

  constructor() {
    this.client = weaviate.client({ scheme: 'http', host: 'http://localhost:7071' });
  }

  public static getInstance(): WeaviateService {
    if (!WeaviateService.instance) {
      WeaviateService.instance = new WeaviateService();
    }
    return WeaviateService.instance;
  }

  public async addSchema() {
    await this.client.schema.classCreator().withClass(schemaConfig).do();
  }

  public async addImage(base64: string, mal_id: string) {
    const result = await this.client.data
      .creator()
      .withClassName('Characters')
      .withProperties({
        image: base64,
        mal_id,
      })
      .do();
    return result;
  }

  public async search(base64: string, certainty: number = 0.8, fields: string = ''): Promise<any> {
    const result = await this.client.graphql
      .get()
      .withClassName('Characters')
      .withFields('image mal_id _additional {certainty} ' + fields)
      .withNearImage({
        image: base64,
        certainty,
      })
      .do();
    return result;
  }
}
