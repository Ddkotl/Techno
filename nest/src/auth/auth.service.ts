import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token, User } from '@prisma/client';
import { compareSync } from 'bcrypt';
import { add } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { v4 } from 'uuid';
import { LoginDto, RegisterDto } from './dto';
import { Tokens } from './interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userServise: UserService,
    private readonly jwtServise: JwtService,
    private readonly prismaServise: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    const user: User = await this.userServise
      .findOne(dto.email)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });
    if (user) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }
    return this.userServise.save(dto).catch((err) => {
      this.logger.error(err);
      return null;
    });
  }

  async login(dto: LoginDto): Promise<Tokens> {
    const user: User = await this.userServise
      .findOne(dto.email)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });
    if (!user || !compareSync(dto.password, user.password)) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }
    const accessToken =
      'Bearer ' +
      this.jwtServise.sign({
        id: user.id,
        email: user.email,
        roles: user.roles,
      });
    const refreshToken = await this.getRefreshToken(user.id);
    return { accessToken, refreshToken };
  }

  private async getRefreshToken(userId: string): Promise<Token> {
    return this.prismaServise.token.create({
      data: {
        token: v4(),
        exp: add(new Date(), { months: 1 }),
        userId,
      },
    });
  }
}
