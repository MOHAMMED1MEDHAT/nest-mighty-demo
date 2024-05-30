import { Logger } from '@nestjs/common';
import {
	Args,
	Int,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';
import { User } from 'src/user/entities';
import { UserService } from 'src/user/user.service';
import { Task } from './entities';
import { TaskService } from './task.service';

@Resolver(() => Task)
export class TasksResolver {
	private logger = new Logger(TasksResolver.name);
	constructor(
		private tasksService: TaskService,
		private userService: UserService,
	) {}

	@Query(() => Task)
	async getTask(@Args('id', { type: () => Int }) id: number): Promise<Task> {
		return await this.tasksService.getTaskById(id);
	}

	@ResolveField('owner', () => User)
	async user(@Parent() task: Task): Promise<User> {
		this.logger.debug(JSON.stringify(task));
		const { owner } = task;
		this.logger.debug(JSON.stringify(task));
		return await this.userService.getUserById(owner.id);
	}
}
