import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TokenDecoder } from 'src/auth/interceptors';
import { GqlContextService } from './gqlContext.service';
import { GqlErrorService } from './gqlError.service';

const customGqlModuleConfig = {
	driver: ApolloDriver,
	inject: [TokenDecoder, ConfigService],
	useFactory: (
		tokenDecoder: TokenDecoder,
		config: ConfigService,
	): ApolloDriverConfig => {
		return {
			autoSchemaFile: true,
			context: new GqlContextService(tokenDecoder).handle(),
			formatError: new GqlErrorService(config).handle(),
		};
	},
};

@Module({
	imports: [
		GraphQLModule.forRootAsync<ApolloDriverConfig>({
			...customGqlModuleConfig,
		}),
	],
	providers: [GqlContextService, GqlErrorService],
})
export class GqlModule {}
