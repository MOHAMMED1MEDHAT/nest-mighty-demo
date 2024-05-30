import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities';
import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from '../enums';
// import { TaskStatus } from './enums';
@ObjectType()
@Entity('tasks')
export class Task extends BaseEntity {
	@Field((type) => Int, { description: 'Task ID' })
	@PrimaryGeneratedColumn()
	id: number;

	@Field((type) => String, { description: 'Task title' })
	@Column()
	title: string;

	@Field((type) => String, { description: 'Task description' })
	@Column()
	description: string;

	@Field((type) => String, { description: 'Task status' })
	@Column()
	status: TaskStatus;

	@Field((type) => User, { description: 'Task owner' })
	@ManyToOne(() => User, (user) => user.tasks, { eager: true })
	owner: User;
}
