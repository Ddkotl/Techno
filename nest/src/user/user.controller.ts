import { CurrentUser } from '@common/decorators';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { JwtPayLoad } from 'src/auth/interfaces';
import { UserResponse } from './responses';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async createUser(@Body() dto) {
    const user = await this.userService.save(dto);
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
    @CurrentUser() user: JwtPayLoad,
  ): Promise<{ id: string }> {
    return this.userService.delete(id, user);
  }
}
