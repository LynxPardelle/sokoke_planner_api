import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  author(): { [key: string]: string } {
    return {
      author: 'Lynx Pardelle',
      site: 'https://lynxpardelle.com',
      github: 'https://github.com/LynxPardelle',
    };
  }
  getHello(): string {
    return 'Hello World from NestJS!';
  }
}
