import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
/* Modules */
import { SharedModule } from '@src/shared/shared.module';
import { UserModule } from '@src/user/user.module';
/* Controllers */
import { AuthController } from './controllers/auth.controller';
/* Middlewares */
import { AuthMiddleware } from './middlewares/auth.middleware';
/* Services */
import { AuthService } from './services/auth.service';
/* Strategies */
import { ApiKeyStrategy } from './strategies/api-key.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
/* Guards */
import { JwtAuthGuard, OptionalJwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'fallback-secret-key',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '15m',
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    SharedModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ApiKeyStrategy,
    JwtStrategy,
    JwtAuthGuard,
    OptionalJwtAuthGuard,
  ],
  exports: [
    AuthService,
    JwtAuthGuard,
    OptionalJwtAuthGuard,
    JwtModule,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
