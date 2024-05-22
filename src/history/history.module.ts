import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './entities/history.entity';
import { HistoryController } from './history.controller';
import { HistoryRepository } from './repositories/history.repository';
@Global()
@Module({
	imports: [TypeOrmModule.forFeature([History])],
	controllers: [HistoryController],
	providers: [HistoryRepository],
	exports: [HistoryRepository],
})
export class HistoryModule {}
