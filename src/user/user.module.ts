import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	providers: [UserService, UserRepository],
	controllers: [UserController],
	exports: [UserService, UserRepository],
})
export class UserModule {}
