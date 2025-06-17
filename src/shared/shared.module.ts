import { Module } from '@nestjs/common';
/* Services */
import { LoggerService } from './services/logger.service';
import { PasswordService } from './services/password.service';
import { AuthUtilsService } from './services/auth-utils.service';

@Module({
  providers: [LoggerService, PasswordService, AuthUtilsService],
  exports: [LoggerService, PasswordService, AuthUtilsService],
})
export class SharedModule {}
