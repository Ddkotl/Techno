import { faker } from '@faker-js/faker';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaServise: PrismaService,
    private readonly jwtServise: JwtService,
  ) {}

  async register(dto: AuthDto) {
    const oldUser = await this.prismaServise.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (oldUser) {
      throw new BadRequestException('Пользователь уже существует');
    }

    const user = await this.prismaServise.user.create({
      data: {
        email: dto.email,
        name: faker.name.firstName(),
        avatarPath: faker.image.avatar(),
        phone: faker.phone.number(),
        password: await hash(dto.password),
      },
    });

    return user;
  }

  private async issueTokens(userId: number) {
    const data = { id: userId };
  }
}
