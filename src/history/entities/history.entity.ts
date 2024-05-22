import { User } from 'src/user/entities';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('histories')
export class History extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.activities, { eager: false })
	creator: User;

	@Column()
	details: string;
}
