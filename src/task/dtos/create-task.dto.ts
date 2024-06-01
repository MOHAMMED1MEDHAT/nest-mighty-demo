import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskStatus } from '../enums';

@InputType()
export class CreateTaskDto {
	@IsNotEmpty({
		message: 'Title is required',
	})
	@IsString({
		message: 'Title must be a string',
	})
	@Field(() => String)
	title: string;

	@IsNotEmpty({
		message: 'Description is required',
	})
	@IsString({
		message: 'Description must be a string',
	})
	@Field(() => String)
	description: string;

	@IsNotEmpty({
		message: 'Status is required',
	})
	@IsEnum(TaskStatus, {
		message: `Status must be a valid enum value from ${Object.values(TaskStatus).join(', ')}`,
	})
	@Field(() => TaskStatus)
	status: TaskStatus;
}
