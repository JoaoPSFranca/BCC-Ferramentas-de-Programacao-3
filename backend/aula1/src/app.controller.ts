import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('exemplo1')
  getExemplo1(): string {
    return 'Exemplo 1';
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
