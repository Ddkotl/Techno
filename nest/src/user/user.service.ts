import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { genSaltSync, hashSync } from 'bcrypt';
import { JwtPayLoad } from 'src/auth/interfaces';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  save(user: Partial<User>) {
    console.log(user);
    const hashedPassword = this.hashPassword(user.password);
    console.log(hashedPassword);
    return this.prismaService.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        roles: ['USER'],
      },
    });
  }

  findOne(idOrEmail: string) {
    return this.prismaService.user.findFirst({
      where: {
        OR: [{ id: idOrEmail }, { email: idOrEmail }],
      },
    });
  }

  delete(id: string, user: JwtPayLoad) {
    if (user.id !== id) {
      throw new ForbiddenException();
    }
    return this.prismaService.user.delete({
      where: { id },
      select: { id: true },
    });
  }

  private hashPassword(password: string) {
    console.log(password);
    return hashSync(password, genSaltSync(10));
  }
}
