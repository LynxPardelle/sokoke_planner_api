import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
/* Config */
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configLoader } from './config/config.loader';
import { configSchema } from './config/config.schema';
/* Modules */
import { SharedModule } from './shared/shared.module';
import { PlannerModule } from './planner/planner.module';
import { AuthModule } from './auth/auth.module';
/* Controllers */
import { AppController } from './core/controllers/app.controller';
/* Services */
import { AppService } from './core/services/app.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configLoader],
      validationSchema: configSchema,
    }),
    AuthModule,
    PlannerModule,
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongodbUri'),
      }),
      inject: [ConfigService],
    }),
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
