import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
@Injectable()
export class ApiKeyStrategy extends PassportStrategy<any>(HeaderAPIKeyStrategy, 'headerapikey') {
  constructor(private _authService: AuthService) {
    super({ header: 'apikey', prefix: '' }, true, (apikey, done) => {
      const checkKey: boolean = this._authService.validateApiKey(apikey);
      if (!checkKey) {
        return done(false);
      }
      return done(true);
    });
  }
}
