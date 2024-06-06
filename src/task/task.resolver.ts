import { Logger, UseInterceptors } from '@nestjs/common';
import {
	Args,
	Int,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';
import { GetUserGql } from 'src/auth/decorators';
import { ActivityInterceptor } from 'src/shared/interceptors/activity.interceptor';
import { User } from 'src/user/entities';
import { UserService } from 'src/user/user.service';
import { CreateTaskDto } from './dtos';
import { Task } from './entities';
import { TaskService } from './task.service';

// @UseGuards(jwtGard)
@Resolver(() => Task)
export class TasksResolver {
	private logger = new Logger(TasksResolver.name);
	constructor(
		private tasksService: TaskService,
		private userService: UserService,
	) {}

	@Query(() => Task)
	@UseInterceptors(ActivityInterceptor)
	// @UseGuards(AuthGuard)
	async getTask(
		@Args('id', { type: () => Int }) id: number,
		@GetUserGql() user: User,
	): Promise<Task> {
		// this.logger.debug(JSON.stringify(user));
		return await this.tasksService.getTaskById(id);
	}

	@ResolveField('owner', () => User)
	async user(@Parent() task: Task): Promise<User> {
		// this.logger.debug(JSON.stringify(task));
		const { owner } = task;
		// this.logger.debug(JSON.stringify(task));
		return await this.userService.getUserById(owner.id);
	}

	//? how to add an auth guard to this resolver
	//? how to get the user from the request
	@Mutation(() => Task)
	async createTask(
		@Args('createTaskDto', { type: () => CreateTaskDto })
		createTaskDto: CreateTaskDto,
		@GetUserGql() user: User,
	): Promise<Task> {
		const task = await this.tasksService.createTaskForUser(createTaskDto, user);
		return task;
	}
}
