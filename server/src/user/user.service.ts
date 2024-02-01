import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash } from 'argon2';
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
    const isSameUser = await this.prismaServise.user.findUnique({
      where: { email: dto.email },
    });

    if (isSameUser && id !== isSameUser.id) {
      throw new BadRequestException('Email уже используется');
    }

    const user = await this.byId(id);

    return this.prismaServise.user.update({
      where: { id },
      data: {
        email: dto.email,
        name: dto.name,
        avatarPath: dto.avatarParh,
        phone: dto.phone,
        password: dto.password ? await hash(dto.password) : user.password,
      },
    });
  }

  async toggleFavorite(userId: number, postId: number) {
    const user = await this.byId(userId);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isExist = user.favorites.some((post) => post.id === postId);

    await this.prismaServise.user.update({
      where: { id: user.id },
      data: {
        favorites: {
          [isExist ? 'disconect' : 'conect']: { id: postId },
        },
      },
    });
    return 'Success';
  }
}
