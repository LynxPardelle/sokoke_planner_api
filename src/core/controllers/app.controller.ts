import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';
/* Services */
import { LoggerService } from '@src/shared/services/logger.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private _loggerService: LoggerService,) { }
  @Get('author')
  author(): { [key: string]: string } {
    this._loggerService.info('LogController.author');
    return this.appService.author();
  }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
