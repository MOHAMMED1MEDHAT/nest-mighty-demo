import { Injectable, Logger } from '@nestjs/common';
import { AuthDto } from 'src/auth/dto';
import { DBExceptionTypes } from 'src/shared/exceptionFilters/enums';
import { InternalExceptionTypes } from 'src/shared/exceptionFilters/enums/internal-exception-levels.enum';
import {
	DBException,
	InternalException,
} from 'src/shared/exceptionFilters/exceptions';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities';

@Injectable()
export class UserRepository extends Repository<User> {
	private logger = new Logger('UserRepository');

	constructor(private dataSource: DataSource) {
		super(User, dataSource.createEntityManager());
		this.dataSource = dataSource;
	}

	async signUp(authDto: AuthDto): Promise<User> {
		const { firstName, lastName, email, password } = authDto;

		const user = new User();
		user.firstName = firstName;
		user.lastName = lastName;
		user.email = email;
		const hash = await user.hashPassword(password);
		user.password = hash;

		//TODO: Implement the exception filter here
		try {
			return await user.save();
		} catch (err) {
			this.logger.error(err.message);
			if (err.code === '23505') {
				throw new DBException(DBExceptionTypes.EXISTS);
			} else {
				throw new InternalException(InternalExceptionTypes.CRITICAL);
			}
		}
	}

	async validateUser(authDto: AuthDto): Promise<User> {
		const { email, password } = authDto;

		const user = await this.findOne({ where: { email } });

		if (!user || !(await user.isPasswordValid(password))) {
			return null;
		}

		return user;
	}

	async getUserById(id: number): Promise<User> {
		return await this.findOne({ where: { id } });
	}

	async getUserByEmail(email: string): Promise<User> {
		return await this.findOne({ where: { email } });
	}

	async deleteUser(id: number): Promise<void> {
		await this.delete({ id });
	}
}
