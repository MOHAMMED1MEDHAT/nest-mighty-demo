import { Body, Controller, Logger, Post } from '@nestjs/common';
import { User } from 'src/user/entities';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
	private logger = new Logger(AuthController.name);
	constructor(private authService: AuthService) {}

	@Post('/signup')
	signUp(@Body() authDto: AuthDto): Promise<User> {
		return this.authService.signUp(authDto);
	}

	@Post('/signin')
	signIn(@Body() authDto: AuthDto): Promise<{ accessToken: string }> {
		return this.authService.signIn(authDto);
	}
}
