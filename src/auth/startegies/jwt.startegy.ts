import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/entities';
import { UserRepository } from 'src/user/repositories/user.repository';
import { JwtPayload } from './../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private userRepository: UserRepository) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET,
		});
	}

	async validate(payload: JwtPayload): Promise<User> {
		const { email } = payload;
		const user = await this.userRepository.getUserByEmail(email);
		if (!user) {
			throw new UnauthorizedException('Invalid Credentials');
		}

		return user;
	}
}
