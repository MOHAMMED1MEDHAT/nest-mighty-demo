import { Module } from '@nestjs/common';
import { TaskRepository } from './repositories/task.repository';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
	providers: [TaskService, TaskRepository],
	controllers: [TaskController],
})
export class TaskModule {}
