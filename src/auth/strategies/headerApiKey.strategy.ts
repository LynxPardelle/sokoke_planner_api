import { Injectable } from '@nestjs/common';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
/* Services */
import { AuthService } from '../services/auth.service';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class HeaderApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy, 'headerApiKey') {
  constructor(private _authService: AuthService) {
    super(
      { header: 'apikey', prefix: 'headerapikey' },
      true
    );
    console.log('HeaderApiKeyStrategy initialized');
  }
  async validate(apiKey: string): Promise<boolean> {
    console.log('Validating API key:', apiKey);
    // Call the AuthService to validate the API key
    return await this._authService.validateApiKey(apiKey);
  }
}
