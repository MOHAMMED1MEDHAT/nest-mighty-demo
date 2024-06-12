import { Injectable } from '@nestjs/common';
import { TokenDecoder } from 'src/auth/interceptors';
import { User } from 'src/user/entities';

@Injectable()
export class GqlContextService {
	constructor(private readonly tokenDecoder: TokenDecoder) {}

	handle(): ({ req, res }) => {
		req: unknown;
		res: unknown;
		user: User;
		dummy: string;
	} {
		return ({ req, res }) => {
			return {
				req,
				res,
				user: this.tokenDecoder.decode({ req, res }).user,
				dummy: this.dummy({ req, res }).dummy,
			};
		};
	}

	private dummy({ req, res }): { dummy: string } {
		return { dummy: 'dummy' };
	}
}
