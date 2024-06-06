import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	Unique,
} from 'typeorm';

import { Field, Int, ObjectType } from '@nestjs/graphql';
import * as argon from 'argon2';
import { History } from 'src/history/entities/history.entity';
import { Task } from 'src/task/entities';

@ObjectType()
@Entity('users')
@Unique(['email'])
export class User extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field(() => String)
	@Column()
	firstName: string;

	@Field(() => String)
	@Column()
	lastName: string;

	@Field(() => String)
	@Column()
	email: string;

	@Field(() => String)
	@Column()
	password: string;

	@Field(() => [Task])
	@OneToMany(() => Task, (task) => task.owner, { eager: false })
	tasks: Task[];

	@Field(() => [History])
	@OneToMany(() => History, (history) => history.creator, { eager: false })
	activities: History[];

	async isPasswordValid(password: string): Promise<boolean> {
		return await argon.verify(this.password, password);
	}
	async hashPassword(password: string): Promise<string> {
		return await argon.hash(password);
	}
}
