import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAll() {
    return this.categoryService.getAll();
  }
  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.categoryService.bySlug(slug);
  }
  @Get(':id')
  @Auth()
  async getById(@Param('id') id: string) {
    return this.categoryService.byId(+id);
  }

  @HttpCode(200)
  @Auth()
  @Post()
  async create() {
    return this.categoryService.create();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':categoryId')
  async update(
    @Param('categoryId') categoryId: string,
    @Body() dto: CategoryDto,
  ) {
    return this.categoryService.update(+categoryId, dto);
  }
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Delete(':categoryId')
  async delete(@Param('categoryId') categoryId: string) {
    return this.categoryService.delete(+categoryId);
  }
}
