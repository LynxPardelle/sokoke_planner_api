import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@src/user/services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: _configService.get<string>('JWT_SECRET') || 'fallback-secret-key',
    });
  }

  async validate(payload: any) {
    try {
      // Get fresh user data to ensure user still exists and is active
      const userResponse = await this._userService.read(payload.sub);
      
      if (userResponse.status !== 'success' || !userResponse.data) {
        throw new UnauthorizedException('User not found');
      }

      const user = userResponse.data;
      
      return {
        id: user._id,
        email: user.email,
        verified: user.verified,
        name: user.name,
        lastName: user.lastName,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token or user not found');
    }
  }
}
