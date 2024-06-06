import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
	const logger = new Logger('bootstrap');
	const app = await NestFactory.create(AppModule);
	// app.useGlobalFilters(
	// 	new AllExceptionsFilter(app.get(HttpAdapterHost), app.get(ConfigService)),
	// );
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
		}),
	);
	app.setGlobalPrefix('api/v1');

	await app.listen(process.env.PORT || 3000);
	logger.verbose(`Application is running on: ${process.env.PORT}`);
}
bootstrap();
