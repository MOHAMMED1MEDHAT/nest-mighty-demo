import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

import * as argon from 'argon2';
import { Task } from 'src/task/entities';

@Entity('users')
@Unique(['email'])
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@OneToMany(() => Task, (task) => task.owner, { eager: true })
	tasks: Task[];

	async isPasswordValid(password: string): Promise<boolean> {
		return await argon.verify(this.password, password);
	}
	async hashPassword(password: string): Promise<string> {
		return await argon.hash(password);
	}
}
