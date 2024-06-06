import { Injectable } from '@nestjs/common';
import { TokenDecoder } from 'src/auth/interceptors';

@Injectable()
export class GqlContextService {
	constructor(private readonly tokenDecoder: TokenDecoder) {}

	handle(): ({ req, res }) => object {
		return ({ req, res }) => {
			let result: object = {};
			result = { ...result, ...this.tokenDecoder.decode({ req, res }) };
			return result;
		};
	}
}
