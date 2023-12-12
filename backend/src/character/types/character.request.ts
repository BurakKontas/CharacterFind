import { CharacterRequests } from '../enums/character.request';

export type CharacterRequest = {
  type: CharacterRequests;
  base64?: string;
  mal_id?: string;
};
