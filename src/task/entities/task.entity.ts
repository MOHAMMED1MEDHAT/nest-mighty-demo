import { User } from 'src/user/entities';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from '../enums';
// import { TaskStatus } from './enums';
@Entity('tasks')
export class Task extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title: string;

	@Column()
	description: string;

	@Column()
	status: TaskStatus;

	@ManyToOne(() => User, (user) => user.tasks, { eager: false })
	owner: User;
}
