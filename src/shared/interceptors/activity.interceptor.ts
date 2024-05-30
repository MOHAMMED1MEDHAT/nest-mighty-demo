import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { History } from 'src/history/entities/history.entity';
import { HistoryRepository } from 'src/history/repositories/history.repository';

// @Injectable()
// export class ActivityInterceptor implements NestInterceptor {
// 	constructor(private historyRepository: HistoryRepository) {}
// 	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const request = context.switchToHttp().getRequest();
// 		const history = new History();
// 		history.creator = request.user.id;
// 		history.details = `user ${request.user.id} named:${request.user.firstName} ${request.user.lastName} has accessed the task module`;
// 		this.historyRepository.createHistory(history);
// 		return next.handle();
// 	}
// }

//REFACTOR: Implement the interceptor in Observable handling mode not before
//!interceptor in Observable handling mode
@Injectable()
export class ActivityInterceptor implements NestInterceptor {
	constructor(private historyRepository: HistoryRepository) {}
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest();
		return next.handle().pipe<Observable<any>>(
			map((data) => {
				const history = new History();
				history.creator = request.user.id;
				history.details = `user ${request.user.id} named:${request.user.firstName} ${request.user.lastName} has accessed the task module and was given the following data ${JSON.stringify(data)}`;
				this.historyRepository.createHistory(history);
				return data;
			}),
		);
	}
}
