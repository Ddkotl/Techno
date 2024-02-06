import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { ReviewModule } from './review/review.module';
import { CategoryModule } from './category/category.module';
import { StatisticModule } from './statistic/statistic.module';
import { PaginationModule } from './pagination/pagination.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, PostModule, ReviewModule, CategoryModule, StatisticModule, PaginationModule],
  providers: [PrismaService],
})
export class AppModule {}
