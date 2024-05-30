import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import configs from './configs';
import { HistoryModule } from './history/history.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
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
					host: configService.get('database.host'),
					port: configService.get('database.port'),
					username: configService.get('database.username'),
					password: configService.get('database.password'),
					// database: configService.get('database.name'),
					entities: [__dirname + '/**/*.entity{.ts,.js}'],
					synchronize: true,
				};
			},
		}),
		GraphQLModule.forRootAsync<ApolloDriverConfig>({
			driver: ApolloDriver,
			useFactory: () => {
				return {
					autoSchemaFile: true,
					formatError: (error): { message: string; code: unknown } => {
						return {
							message: error.message,
							code: error.extensions?.code,
						};
					},
				};
			},
		}),
		AuthModule,
		TaskModule,
		HistoryModule,
		UserModule,
	],
})
export class AppModule {}
