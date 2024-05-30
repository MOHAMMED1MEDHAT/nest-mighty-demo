import { Injectable, Logger } from '@nestjs/common';
import { DBExceptionTypes } from 'src/shared/exceptionFilters/enums';
import { InternalExceptionTypes } from 'src/shared/exceptionFilters/enums/internal-exception-levels.enum';
import {
	DBException,
	InternalException,
} from 'src/shared/exceptionFilters/exceptions';
import { User } from 'src/user/entities';
import { DataSource, Repository } from 'typeorm';
import { Task } from '../entities';

@Injectable()
export class TaskRepository extends Repository<Task> {
	private logger = new Logger('TaskRepository');

	constructor(private dataSource: DataSource) {
		super(Task, dataSource.createEntityManager());
		this.dataSource = dataSource;
	}

	async createTask(task: Task): Promise<Task> {
		//TODO: Implement the exception filter here
		try {
			return await task.save();
		} catch (err) {
			this.logger.error(err.message);
			if (err.code === '23505') {
				throw new DBException(DBExceptionTypes.EXISTS);
			} else {
				throw new InternalException(InternalExceptionTypes.CRITICAL);
			}
		}
	}

	async findAll(query: any): Promise<Task[]> {
		const task = await this.find({ where: query });

		if (!task) {
			return null;
		}

		return task;
	}

	async getTaskById(id: number): Promise<Task> {
		const task = await this.findOne({ where: { id } });
		if (!task) {
			throw new DBException(DBExceptionTypes.NOT_FOUND);
		}
		return task;
	}

	async getTaskByOwnerId(owner: User): Promise<Task> {
		return await this.findOne({ where: { owner } });
	}

	async deleteTask(id: number): Promise<void> {
		await this.delete({ id });
	}
}
