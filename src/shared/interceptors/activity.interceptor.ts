import {
	CallHandler,
	ExecutionContext,
	Injectable,
	Logger,
	NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, map } from 'rxjs';
import { History } from 'src/history/entities/history.entity';
import { HistoryRepository } from 'src/history/repositories/history.repository';

// @Injectable()
// export class ActivityInterceptor implements NestInterceptor {
// 	constructor(private historyRepository: HistoryRepository) {}
// 	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const request = context.switchToHttp().getRequest();
// 		const history = new History();
// 		history.creator = request.locals.user.id;
// 		history.details = `locals.user ${request.locals.user.id} named:${request.locals.user.firstName} ${request.locals.user.lastName} has accessed the task module`;
// 		this.historyRepository.createHistory(history);
// 		return next.handle();
// 	}
// }

//REFACTOR: Implement the interceptor in Observable handling mode not before
//!interceptor in Observable handling mode
@Injectable()
export class ActivityInterceptor implements NestInterceptor {
	private logger = new Logger(ActivityInterceptor.name);
	constructor(private historyRepository: HistoryRepository) {}
	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const user = GqlExecutionContext.create(context).getContext().user;
		return next.handle().pipe<Observable<unknown>>(
			map((data) => {
				const history = new History();
				history.creator = user.id;
				history.details = `locals.user ${user.id} named:${user.firstName} ${user.lastName} has accessed the task module and was given the following data ${JSON.stringify(data)}`;
				this.historyRepository.createHistory(history);
				return data;
			}),
		);
	}
}
