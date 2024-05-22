import { AuthGuard } from '@nestjs/passport';

export class jwtGard extends AuthGuard('jwt') {
	constructor() {
		super();
	}
}
