import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ApiKeyStrategy extends HeaderAPIKeyStrategy {
  constructor(private _authService: AuthService) {
    super({ header: 'apiKey', prefix: 'apiKey' },  true, async (apikey, done) => {
      const checkKey: boolean = await this._authService.validateApiKey(apikey);
      if (!checkKey) {
        return done(null, false);
      }
      return done(null, true);
    });
  }
}
