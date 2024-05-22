import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
	@IsOptional()
	@IsString()
	@MinLength(4)
	@MaxLength(20)
	firstName: string;

	@IsOptional()
	@IsString()
	@MinLength(4)
	@MaxLength(20)
	lastName: string;

	@IsString()
	@MinLength(10)
	@MaxLength(20)
	// Password must contain at least one uppercase letter,
	// one lowercase letter, one number or special character, and at least 10 characters
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'Password too weak',
	})
	password: string;

	@IsEmail()
	email: string;
}
