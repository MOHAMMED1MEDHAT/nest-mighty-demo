import { Controller, Get } from '@nestjs/common';
import { History } from './entities/history.entity';
import { HistoryRepository } from './repositories/history.repository';

@Controller('activities')
export class HistoryController {
	constructor(private historyRepository: HistoryRepository) {}

	@Get()
	getActivities(): Promise<History[]> {
		return this.historyRepository.findAll({});
	}
}
