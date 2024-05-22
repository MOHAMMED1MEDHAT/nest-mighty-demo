import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities';
import { Task } from './entities';
import { TaskStatus } from './enums';
import { TaskRepository } from './repositories/task.repository';

@Injectable()
export class TaskService {
	constructor(private taskRepository: TaskRepository) {}

	getTasks(): Promise<Task[]> {
		return this.taskRepository.findAll({});
	}

	// getTaskById() {
	// 	return 'Task by id';
	// }

	// getTaskByOwner() {
	// 	return 'Task by owner';
	// }

	createTask(user: User): Promise<Task> {
		const task = new Task();
		task.owner = user;
		task.title = 'Task 1';
		task.description = 'Task 1 description';
		task.status = TaskStatus.PENDING;
		return this.taskRepository.createTask(task);
	}
}
