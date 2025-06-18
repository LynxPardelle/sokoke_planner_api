import { Module } from '@nestjs/common';
import { NotificationService } from '@src/shared/services/notification.service';
import { SharedModule } from '@src/shared/shared.module';
import { PlannerModule } from '@src/planner/planner.module';
import { UserModule } from '@src/user/user.module';

@Module({
  imports: [SharedModule, PlannerModule, UserModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
