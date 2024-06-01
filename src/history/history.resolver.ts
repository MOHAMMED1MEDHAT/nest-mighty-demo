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
import { History } from './entities';
import { HistoryRepository } from './repositories/history.repository';

@Resolver(() => History)
export class HistoryResolver {
	private logger = new Logger(HistoryResolver.name);
	constructor(
		private historyRepository: HistoryRepository,
		private userService: UserService,
	) {}

	@Query(() => History)
	async getHistory(
		@Args('id', { type: () => Int }) id: number,
	): Promise<History> {
		return await this.historyRepository.getHistoryById(id);
	}

	@ResolveField('owner', () => User)
	async user(@Parent() history: History): Promise<User> {
		const { creator } = history;
		return await this.userService.getUserById(creator.id);
	}
}
