import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import {
	DBExceptionMsgsAr,
	DBExceptionMsgsEn,
	DBExceptionTypes,
} from './enums';
import {
	InternalExceptionMsgsAr,
	InternalExceptionMsgsEn,
	InternalExceptionTypes,
} from './enums/internal-exception-levels.enum';
import { CustomException, DBException, InternalException } from './exceptions';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	private logger = new Logger(AllExceptionsFilter.name);
	constructor(
		private readonly httpAdapterHost: HttpAdapterHost,
		private readonly configService: ConfigService,
	) {}

	// private objectHandler = {
	// 	DBException: this.DBExceptionHandler,
	// 	InternalException: this.InternalExceptionHandler,
	// };

	catch(exception: unknown, host: ArgumentsHost): void {
		this.logger.error(exception);
		const { httpAdapter } = this.httpAdapterHost;
		const ctx = host.switchToHttp();

		const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		// const customException = this.objectHandler[typeof exception];

		let customException: CustomException;

		if (this.isDBException(exception)) {
			customException = this.DBExceptionHandler(
				exception as DBException,
				this.configService,
			);
		} else if (this.isInternalException(exception)) {
			customException = this.InternalExceptionHandler(
				exception as InternalException,
				this.configService,
			);
		} else {
			customException = this.DefaultExceptionHandler(
				exception,
				this.configService,
			);
		}

		const responseBody = {
			statusCode: httpStatus,
			timestamp: new Date().toISOString(),
			message: customException.message,
			path: httpAdapter.getRequestUrl(ctx.getRequest()),
		};

		httpAdapter.reply(
			host.switchToHttp().getResponse(),
			responseBody,
			httpStatus,
		);
	}

	private DBExceptionHandler(
		exception: DBException,
		configService: ConfigService,
	): CustomException {
		exception = exception as DBException;
		const message =
			exception.type === DBExceptionTypes.EXISTS
				? configService.get<string>('app.lang').toUpperCase() === 'EN'
					? DBExceptionMsgsEn.EXISTS
					: DBExceptionMsgsAr.EXISTS
				: configService.get<string>('app.lang').toUpperCase() === 'EN'
					? DBExceptionMsgsEn.NOT_FOUND
					: DBExceptionMsgsAr.NOT_FOUND;
		return new CustomException(message);
	}

	private InternalExceptionHandler(
		exception: InternalException,
		configService: ConfigService,
	): CustomException {
		exception = <InternalException>exception;
		const message =
			exception.type === InternalExceptionTypes.CRITICAL
				? configService.get<string>('app.lang').toUpperCase() === 'EN'
					? InternalExceptionMsgsEn.CRITICAL
					: InternalExceptionMsgsAr.CRITICAL
				: configService.get<string>('app.lang').toUpperCase() === 'EN'
					? InternalExceptionMsgsEn.WARNING
					: InternalExceptionMsgsAr.WARNING;
		return new CustomException(message);
	}

	private DefaultExceptionHandler(
		exception: any,
		configService: ConfigService,
	): CustomException {
		return new CustomException('Internal server error:' + exception.message);
	}

	private isDBException(exception: unknown): exception is DBException {
		return exception instanceof DBException;
	}

	private isInternalException(
		exception: unknown,
	): exception is InternalException {
		return exception instanceof InternalException;
	}
}
