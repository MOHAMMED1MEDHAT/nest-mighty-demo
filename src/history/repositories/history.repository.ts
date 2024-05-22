import { Injectable, Logger } from '@nestjs/common';
import { CustomException } from 'src/shared/exceptionFilters/custom-exception';
import { ExceptionLevels } from 'src/shared/exceptionFilters/enums/exception-levels.enum';
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
				throw new CustomException('data already exists', ExceptionLevels.DB);
			} else {
				throw new CustomException('Internal Server Error', ExceptionLevels.PROCESSING);
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
}
