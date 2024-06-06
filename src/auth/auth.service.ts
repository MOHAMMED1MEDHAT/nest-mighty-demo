import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomException } from 'src/shared/exceptionFilters/exceptions';
import { User } from 'src/user/entities';
import { UserRepository } from 'src/user/repositories/user.repository';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
	private logger = new Logger(AuthService.name);
	constructor(
		private userRepository: UserRepository,
		private jwtService: JwtService,
	) {}

	async signUp(authDto: AuthDto): Promise<User> {
		return this.userRepository.signUp(authDto);
	}

	async signIn(authDto: AuthDto): Promise<{ accessToken: string }> {
		const user = await this.userRepository.validateUser(authDto);

		// if (!user) {
		// 	throw new UnauthorizedException('Invalid Credentials');
		// }
		if (!user) {
			throw new CustomException('Invalid Credentials');
		}

		// const payload: JwtPayload = { email: user.email };
		delete user.password;
		const payload = { user };
		const accessToken = this.jwtService.sign(payload, {
			expiresIn: process.env.JWT_EXPIRES_IN,
			secret: process.env.JWT_SECRET,
		});
		this.logger.debug(this.jwtService.decode(accessToken));

		return { accessToken };
	}
}
