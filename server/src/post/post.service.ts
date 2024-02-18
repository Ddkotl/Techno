import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma.service';
import urlSlug from 'url-slug';
import { EnumPostSort, GetAllPostDto } from './dto/get-all.post.dto';
import { PostDto } from './dto/post.dto';
import {
  returnPostObject,
  returnPostObjectFullest,
} from './return-post.object';

@Injectable()
export class PostService {
  constructor(
    private readonly prismaServise: PrismaService,
    private readonly paginationServise: PaginationService,
  ) {}

  async getAll(dto: GetAllPostDto = {}) {
    const { sort, searchTerm } = dto;

    const prismaSort: Prisma.PostOrderByWithRelationInput[] = [];

    if (sort === EnumPostSort.NEWEST) {
      prismaSort.push({ createdAt: 'desc' });
    } else {
      prismaSort.push({ createdAt: 'asc' });
    }
    const prismaSearchTermFilter: Prisma.PostWhereInput = searchTerm
      ? {
          OR: [
            {
              category: {
                name: { contains: searchTerm, mode: 'insensitive' },
              },
            },
            {
              title: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {};

    const { perPage, skip } = this.paginationServise.getPagination(dto);

    const products = await this.prismaServise.post.findMany({
      where: prismaSearchTermFilter,
      orderBy: prismaSort,
      skip,
      take: perPage,
    });

    return {
      products,
      length: await this.prismaServise.post.count({
        where: prismaSearchTermFilter,
      }),
    };
  }

  async byId(id: number) {
    const post = await this.prismaServise.post.findUnique({
      where: { id },
      select: returnPostObjectFullest,
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }
  async bySlug(slug: string) {
    const post = await this.prismaServise.post.findUnique({
      where: { slug },
      select: returnPostObjectFullest,
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async byCategory(categorySlug: string) {
    const posts = await this.prismaServise.post.findMany({
      where: { category: { slug: categorySlug } },
      select: returnPostObjectFullest,
    });
    if (!posts) {
      throw new NotFoundException('Post not found');
    }
    return posts;
  }

  async byUser(userName: string) {
    const posts = await this.prismaServise.post.findMany({
      where: { user: { name: userName } },
      select: returnPostObjectFullest,
    });
    if (!posts) {
      throw new NotFoundException('Post not found');
    }
    return posts;
  }

  async getSimilar(id: number) {
    const currentPost = await this.byId(id);
    if (!currentPost) {
      throw new NotFoundException('Current post not found');
    }
    const posts = await this.prismaServise.post.findMany({
      where: {
        category: { name: currentPost.category.name },
        NOT: {
          id: currentPost.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: returnPostObject,
    });
    if (!posts) {
      throw new NotFoundException('Post not found');
    }
    return posts;
  }

  async create() {
    const post = await this.prismaServise.post.create({
      data: {
        title: '',
        slug: '',
        description: '',
        content: '',
      },
    });
    return post.id;
  }
  async update(id: number, dto: PostDto) {
    const { title, description, content, images, categoryId } = dto;

    const isCategoryExist = await this.prismaServise.category.findUnique({
      where: { id: categoryId },
    });
    if (!isCategoryExist) {
      throw new NotFoundException('Category not found');
    }
    return this.prismaServise.post.update({
      where: { id },
      data: {
        title,
        slug: urlSlug(title),
        description,
        content,
        images,
        category: {
          connect: { id: categoryId },
        },
      },
    });
  }

  async delete(id: number) {
    return this.prismaServise.post.delete({ where: { id } });
  }
}
