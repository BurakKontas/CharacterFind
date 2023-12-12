import { Controller, Get } from '@nestjs/common';

@Controller('proxy')
export class ProxyController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
