import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GqlErrorService {
	constructor(private readonly config: ConfigService) {}

	handle(): (error) => { message: string; code: unknown } {
		return (error): { message: string; code: unknown } => {
			return {
				message: error.message + this.config.get<string>('app.env'),
				code: error.extensions?.code,
			};
		};
	}
}
