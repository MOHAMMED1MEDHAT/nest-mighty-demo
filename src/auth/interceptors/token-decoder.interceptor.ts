import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as _ from 'lodash';
import { User } from 'src/user/entities';

@Injectable()
export class TokenDecoder {
	private logger = new Logger(TokenDecoder.name);
	constructor(private readonly jwtService: JwtService) {}

	decode({ req, res }): { user: User } {
		this.logger.debug('TokenDecoder intercept called');
		const accessToken = _.get(req, 'headers.authorization', '').replace(
			/^Bearer\s/,
			'',
		);

		// this.logger.debug(accessToken);

		const refreshToken = _.get(req, 'headers.x-refresh', '');

		if (!accessToken || accessToken == '') return;

		const { user, exp } = this.jwtService.decode(accessToken);
		const expired = exp * 1000 < Date.now();

		if (user) {
			// FIXME we stop this while we are developing for better testing experience
			// FIXME Here we need to compare decoded object with database document for password change or account suspension or verification
			// if (decoded.role == 'user') {
			// 	if (!decoded.isVerified || decoded.isSuspended) return next()}

			return { user };
		}

		if (expired && refreshToken !== '') {
			const newAccessToken = this.jwtService.sign(refreshToken);
			if (newAccessToken) {
				req.setHeader('x-access-token', newAccessToken);
				req.setHeader('Access-Control-Expose-Headers', 'x-access-token');
			} else return;
			const { decoded } = this.jwtService.verify(newAccessToken, {
				secret: process.env.JWT_SECRET,
			});

			return { user: decoded };
		}

		return { user: null };
	}
}
// @Injectable()
// export class TokenDecoder implements NestMiddleware {
// 	private logger = new Logger(TokenDecoder.name);
// 	constructor(private readonly jwtService: JwtService) {}

// 	use(req: Request, res: Response, next: NextFunction): void {
// 		this.logger.debug('TokenDecoder intercept called');
// 		// const ctx = GqlExecutionContext.create(context);
// 		// const req = ctx.getContext().req;
// 		const accessToken = _.get(req, 'headers.authorization', '').replace(
// 			/^Bearer\s/,
// 			'',
// 		);

// 		this.logger.debug(accessToken);

// 		const refreshToken = _.get(req, 'headers.x-refresh', '');

// 		if (!accessToken || accessToken == '') return next();
// 		const { user, exp } = this.jwtService.decode(accessToken);
// 		const expired = exp * 1000 < Date.now();

// 		if (user) {
// 			// FIXME we stop this while we are developing for better testing experience
// 			// FIXME Here we need to compare decoded object with database document for password change or account suspension or verification
// 			// if (decoded.role == 'user') {
// 			// 	if (!decoded.isVerified || decoded.isSuspended) return next();
// 			// }

// 			res.locals = { user };
// 			return next();
// 		}

// 		if (expired && refreshToken !== '') {
// 			const newAccessToken = this.jwtService.sign(refreshToken);
// 			if (newAccessToken) {
// 				res.setHeader('x-access-token', newAccessToken);
// 				res.setHeader('Access-Control-Expose-Headers', 'x-access-token');
// 			} else return next();
// 			const { decoded } = this.jwtService.verify(newAccessToken, {
// 				secret: process.env.JWT_SECRET,
// 			});

// 			res.locals.user = decoded;
// 			return next();
// 		}

// 		return next();
// 	}
// }
