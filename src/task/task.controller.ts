import {
	Controller,
	Get,
	Post,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ActivityInterceptor } from 'src/shared/interceptors/activity.interceptor';
import { User } from 'src/user/entities';
import { Task } from './entities';
import { TaskService } from './task.service';

@Controller('tasks')
@UseGuards(JwtGuard)
export class TaskController {
	constructor(private taskService: TaskService) {}

	@Get()
	@UseInterceptors(ActivityInterceptor)
	async getTasks(@GetUser() user: User): Promise<Task[]> {
		return await this.taskService.getTasks();
	}

	// @Get('/:id')
	// getTaskById() {
	// 	return 'Task by id';
	// }

	// @Get('/:owner')
	// getTaskByOwner() {
	// 	return 'Task by owner';
	// }

	@Post()
	@UseInterceptors(ActivityInterceptor)
	createTask(@GetUser() user: User): Promise<Task> {
		return this.taskService.createTaskTemp(user);
	}
}
