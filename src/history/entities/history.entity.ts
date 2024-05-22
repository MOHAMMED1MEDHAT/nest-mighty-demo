import { BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

export class History extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;
}
