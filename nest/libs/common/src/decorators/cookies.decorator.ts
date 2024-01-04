import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ExecutionContext,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseInterceptors,
  createParamDecorator,
} from '@nestjs/common';
import { UserResponse } from 'src/user/responses';
import { UserService } from 'src/user/user.service';

export const Cookie = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return key && key in request.cookies
      ? request.cookies[key]
      : request.cookies;
  },
);
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async createUser(@Body() data): Promise<UserResponse> {
    const user = await this.userService.save({ user: data });
    return new UserResponse(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':idOrEmail')
  async findOneUser(
    @Param('idOrEmail') idOrEmail: string,
  ): Promise<UserResponse> {
    const user = await this.userService.findOne(idOrEmail);
    return new UserResponse(user);
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ id: string }> {
    return this.userService.delete(id);
  }
}
