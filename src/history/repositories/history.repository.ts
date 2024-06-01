import { Injectable, Logger } from '@nestjs/common';
import { DBExceptionTypes } from 'src/shared/exceptionFilters/enums';
import { InternalExceptionTypes } from 'src/shared/exceptionFilters/enums/internal-exception-levels.enum';
import {
	DBException,
	InternalException,
} from 'src/shared/exceptionFilters/exceptions';
import { DataSource, Repository } from 'typeorm';
import { History } from '../entities/history.entity';

@Injectable()
export class HistoryRepository extends Repository<History> {
	private logger = new Logger('HistoryRepository');

	constructor(private dataSource: DataSource) {
		super(History, dataSource.createEntityManager());
		this.dataSource = dataSource;
	}

	async createHistory(History: History): Promise<History> {
		//TODO: Implement the exception filter here
		try {
			return await History.save();
		} catch (err) {
			this.logger.error(err.message);
			if (err.code === '23505') {
				throw new DBException(DBExceptionTypes.EXISTS);
			} else {
				throw new InternalException(InternalExceptionTypes.CRITICAL);
			}
		}
	}

	async findAll(query: any): Promise<History[]> {
		const History = await this.find({ where: query });

		if (!History) {
			return null;
		}

		return History;
	}

	async getHistoryById(id: number): Promise<History> {
		const History = await this.findOne({ where: { id } });
		if (!History) {
			throw new DBException(DBExceptionTypes.NOT_FOUND);
		}
		return History;
	}
}
