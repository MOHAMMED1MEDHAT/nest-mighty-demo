import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import configs from './configs';
import { GqlModule } from './gql/gql.module';
import { HistoryModule } from './history/history.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '7d' },
		}),
		// ConfigModule.forRoot({
		// 	load: configs,
		// 	isGlobal: true,
		// 	cache: true,
		// 	ignoreEnvFile: false,
		// 	envFilePath: `.env.${process.env.NODE_ENV}`,
		// }),
		ConfigModule.forRoot({
			load: configs,
			isGlobal: true,
			cache: true,
			ignoreEnvFile: false,
			envFilePath: `.env.development`,
		}),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				return {
					type: 'postgres',
					// ssl: true,
					// url: configService.get('database.url'),
					host: configService.get('database.host'),
					port: configService.get('database.port'),
					username: configService.get('database.username'),
					password: configService.get('database.password'),
					database: configService.get('database.name'),
					entities: [__dirname + '/**/*.entity{.ts,.js}'],
					synchronize: true,
				};
			},
		}),
		GqlModule,
		AuthModule,
		TaskModule,
		HistoryModule,
		UserModule,
	],
})
export class AppModule {
	// export class AppModule implements NestModule {
	// configure(consumer: MiddlewareConsumer): void {
	// 	// consumer.apply(TokenDecoder).forRoutes('*');
	// }
}
