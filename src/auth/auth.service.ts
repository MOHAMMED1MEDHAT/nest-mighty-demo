import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomException } from 'src/shared/exceptionFilters/custom-exception';
import { ExceptionLevels } from 'src/shared/exceptionFilters/enums/exception-levels.enum';
import { User } from 'src/user/entities';
import { UserRepository } from 'src/user/repositories/user.repository';
import { AuthDto } from './dto';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
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
			throw new CustomException('Invalid Credentials', ExceptionLevels.CRITICAL);
		}

		const payload: JwtPayload = { email: user.email };
		const accessToken = this.jwtService.sign(payload, {
			expiresIn: process.env.JWT_EXPIRES_IN,
			secret: process.env.JWT_SECRET,
		});

		return { accessToken };
	}
}
