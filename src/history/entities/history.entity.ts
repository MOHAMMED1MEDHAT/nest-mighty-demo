import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities';
import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('histories')
export class History extends BaseEntity {
	@Field((type) => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field((type) => User)
	@ManyToOne(() => User, (user) => user.activities, { eager: true })
	creator: User;

	@Field((type) => String)
	@Column()
	details: string;
}
