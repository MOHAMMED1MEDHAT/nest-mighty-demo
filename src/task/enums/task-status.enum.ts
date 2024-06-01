import { registerEnumType } from '@nestjs/graphql';

export enum TaskStatus {
	DONE = 'DONE',
	PENDING = 'PENDING',
	MISSED = 'MISSED',
}

registerEnumType(TaskStatus, { name: 'TaskStatus' });
