import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import urlSlug from 'url-slug';
import { CategoryDto } from './dto/category.dto';
import { returnCategoryObject } from './return-category.object';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaServise: PrismaService) {}

  async byId(id: number) {
    const category = await this.prismaServise.category.findUnique({
      where: {
        id,
      },
      select: returnCategoryObject,
    });

    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }
  async bySlug(slug: string) {
    const category = await this.prismaServise.category.findUnique({
      where: {
        slug,
      },
      select: returnCategoryObject,
    });

    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async getAll() {
    return this.prismaServise.category.findMany({
      select: returnCategoryObject,
    });
  }

  async create() {
    return this.prismaServise.category.create({
      data: {
        name: '',
        slug: '',
      },
    });
  }

  async update(id: number, dto: CategoryDto) {
    const isSameCategory = await this.prismaServise.category.findUnique({
      where: { name: dto.name },
    });

    if (isSameCategory && id !== isSameCategory.id) {
      throw new BadRequestException('Такая категория уже существует');
    }

    return this.prismaServise.category.update({
      where: { id },
      data: { name: dto.name, slug: urlSlug(dto.name) },
    });
  }

  async delete(id: number) {
    return this.prismaServise.category.delete({ where: { id } });
  }
}
