import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { HistoryModule } from './history/history.module';
import { UserModule } from './user/user.module';
import { UaserService } from './uaser/uaser.service';

@Module({
  imports: [AuthModule, TaskModule, HistoryModule, UserModule],
  controllers: [AppController],
  providers: [AppService, UaserService],
})
export class AppModule {}
