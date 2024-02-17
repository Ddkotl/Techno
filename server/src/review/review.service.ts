import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ReviewDto } from './dto/review.dto';
import { returnReviewObject } from './return-review.object';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaServise: PrismaService) {}

  async getAll() {
    return this.prismaServise.review.findMany({
      orderBy: { createdAt: 'desc' },
      select: returnReviewObject,
    });
  }

  async create(userId: number, dto: ReviewDto, postId: number) {
    const isPostExist = await this.prismaServise.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!isPostExist) {
      throw new NotFoundException('Такого поста не существует');
    }
    return this.prismaServise.review.create({
      data: {
        ...dto,
        post: {
          connect: {
            id: postId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async getAgregateValueByPostId(postId: number) {
    return this.prismaServise.review
      .aggregate({
        where: { postId },
        _avg: { rating: true },
      })
      .then((data) => data._avg);
  }
}
