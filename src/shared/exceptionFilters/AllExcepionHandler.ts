import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CustomException } from './custom-exception';
import { ExceptionLevels } from './enums/exception-levels.enum';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	catch(exception: CustomException, host: ArgumentsHost): void {
		const { httpAdapter } = this.httpAdapterHost;

		let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

		switch (exception.level) {
			case ExceptionLevels.DB:
				httpStatus = HttpStatus.CONFLICT;
				break;
			case ExceptionLevels.PROCESSING:
				httpStatus = HttpStatus.BAD_REQUEST;
				break;
		}

		const responseBody = {
			statusCode: httpStatus,
			timestamp: new Date().toISOString(),
			message: exception.message,
			path: httpAdapter.getRequestUrl(host.switchToHttp().getRequest()),
		};

		httpAdapter.reply(host.switchToHttp().getResponse(), responseBody, httpStatus);
	}
}
