import { faker } from '@faker-js/faker';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
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

    const tokens = await this.issueTokens(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  private async issueTokens(userId: number) {
    const data = { id: userId };

    const accessToken = this.jwtServise.sign(data, {
      expiresIn: '1h',
    });
    const refreshToken = this.jwtServise.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private returnUserFields(user: User) {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
