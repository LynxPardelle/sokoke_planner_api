import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly apiKeys: string[];

  constructor(private readonly _configService: ConfigService) {
    this.apiKeys = this._configService.get('apiKeys');
  }

  validateApiKey(apiKey: string): boolean {
    return this.apiKeys.includes(apiKey);
  }
}
