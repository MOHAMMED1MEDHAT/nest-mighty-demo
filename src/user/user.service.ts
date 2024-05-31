import { Injectable } from '@nestjs/common';
import { User } from './entities';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
	constructor(private userRepository: UserRepository) {}

	getUsers(query: unknown): Promise<User[]> {
		return this.userRepository.find(query || {});
	}

	getUserById(userId: number): Promise<User> {
		return this.userRepository.getUserById(userId);
	}
}
