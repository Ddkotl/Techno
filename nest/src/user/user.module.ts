import { UserController } from '@common/decorators/cookies.decorator';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
