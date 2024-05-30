import { Global, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { HistoryController } from './history.controller';
import { HistoryResolver } from './history.resolver';
import { HistoryRepository } from './repositories/history.repository';
@Global()
@Module({
	imports: [UserModule],
	controllers: [HistoryController],
	providers: [HistoryRepository, HistoryResolver],
	exports: [HistoryRepository],
})
export class HistoryModule {}
