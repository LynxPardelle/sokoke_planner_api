import { Module } from '@nestjs/common';
/* Services */
import { LoggerService } from './services/logger.service';
import { PasswordService } from './services/password.service';
import { AuthUtilsService } from './services/auth-utils.service';
import { EmailService } from './services/email.service';

@Module({
  providers: [LoggerService, PasswordService, AuthUtilsService, EmailService],
  exports: [LoggerService, PasswordService, AuthUtilsService, EmailService],
})
export class SharedModule {}
