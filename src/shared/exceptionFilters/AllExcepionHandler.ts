import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus,
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
	constructor(
		private readonly httpAdapterHost: HttpAdapterHost,
		private readonly configService: ConfigService,
	) {}

	private objectHandler = {
		[DBException.name]: this.DBExceptionHandler,
		[InternalException.name]: this.InternalExceptionHandler,
	};

	catch(exception: unknown, host: ArgumentsHost): void {
		const { httpAdapter } = this.httpAdapterHost;
		const ctx = host.switchToHttp();

		const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		// const customException = this.objectHandler[typeof exception];

		let customException: CustomException;

		if (
			exception.constructor.name === DBException.name ||
			exception.constructor.name === InternalException.name
		) {
			customException = this.objectHandler[exception.constructor.name](
				exception,
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
		exception: any,
		configService: ConfigService,
	): CustomException {
		exception = <DBException>exception;
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
		exception: any,
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
}
