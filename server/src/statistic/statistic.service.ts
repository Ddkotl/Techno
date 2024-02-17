import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StatisticService {
  constructor(
    private readonly prismaServise: PrismaService,
    private readonly userServise: UserService,
  ) {}

  async getMain(userId: number) {
    const user = await this.userServise.byId(userId, {
      reviews: true,
      favorites: true,
      id: true,
      updatedAt: true,
      createdAt: true,
      email: true,
      name: true,
    });

    return [
      { name: 'UserId', value: user.id },
      { name: 'UserName', value: user.name },
      { name: 'UserEmail', value: user.email },
      { name: 'UserCreated', value: user.createdAt },
      { name: 'UserUpdated', value: user.updatedAt },
      { name: 'Reviews', value: user.reviews.length },
      { name: 'Favorites', value: user.favorites.length },
    ];
  }
}
