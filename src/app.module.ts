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
					entities: [__dirname + '/**/*.entity{.ts,.js}'],
					synchronize: true,
				};
			},
		}),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			autoSchemaFile: true,
			driver: ApolloDriver,
		}),
		AuthModule,
		TaskModule,
		HistoryModule,
		UserModule,
	],
})
export class AppModule {}
