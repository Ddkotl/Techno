import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';
import { returnUserObject } from './return-user.object';

@Injectable()
export class UserService {
  constructor(private readonly prismaServise: PrismaService) {}
  async byId(id: number, selectObject: Prisma.UserSelect = {}) {
    const user = await this.prismaServise.user.findUnique({
      where: { id },
      select: {
        ...returnUserObject,
        favorites: {
          select: {
            id: true,
            title: true,
            images: true,
            slug: true,
            description: true,
            content: true,
          },
        },
        ...selectObject,
      },
    });

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    return user;
  }

  async updateProfile(id: number, dto: UserDto) {
    const isSameUser = await this.byId(id);

    return updatedUser;
  }
}
