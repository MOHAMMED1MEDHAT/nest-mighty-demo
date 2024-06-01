import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities';
import { CreateTaskDto } from './dtos';
import { Task } from './entities';
import { TaskStatus } from './enums';
import { TaskRepository } from './repositories/task.repository';

@Injectable()
export class TaskService {
	constructor(private taskRepository: TaskRepository) {}

	async getTasks(query?: unknown): Promise<Task[]> {
		return await this.taskRepository.findAll(query || {});
	}

	getTaskById(taskId: number): Promise<Task> {
		return this.taskRepository.getTaskById(taskId);
	}

	// getTaskByOwner() {
	// 	return 'Task by owner';
	// }

	createTaskForUser(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
		const task = new Task();
		task.owner = user;
		task.title = createTaskDto.title;
		task.description = createTaskDto.description;
		task.status = createTaskDto.status;
		return this.taskRepository.createTask(task);
	}

	createTaskTemp(user: User): Promise<Task> {
		const task = new Task();
		task.owner = user;
		task.title = 'Task 1';
		task.description = 'Task 1 description';
		task.status = TaskStatus.PENDING;
		return this.taskRepository.createTask(task);
	}
}
