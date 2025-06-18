import { Module } from '@nestjs/common';
/* Services */
import { LoggerService } from './services/logger.service';
import { PasswordService } from './services/password.service';
import { AuthUtilsService } from './services/auth-utils.service';
import { EmailService } from './services/email.service';
import { SearchService } from './services/search.service';

@Module({
  providers: [LoggerService, PasswordService, AuthUtilsService, EmailService, SearchService],
  exports: [LoggerService, PasswordService, AuthUtilsService, EmailService, SearchService],
})
export class SharedModule {}
