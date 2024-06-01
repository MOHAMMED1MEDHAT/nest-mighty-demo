import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { TaskRepository } from './repositories/task.repository';
import { TaskController } from './task.controller';
import { TasksResolver } from './task.resolver';
import { TaskService } from './task.service';

@Module({
	imports: [UserModule],
	controllers: [TaskController],
	providers: [TasksResolver, TaskService, TaskRepository],
})
export class TaskModule {}
