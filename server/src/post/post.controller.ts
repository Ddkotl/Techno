import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetAllPostDto } from './dto/get-all.post.dto';
import { PostDto } from './dto/post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UsePipes(new ValidationPipe())
  @Get()
  async getAll(@Query() queryDto: GetAllPostDto) {
    return this.postService.getAll(queryDto);
  }

  @Get('similar/:id')
  async getSimilar(@Param('id') id: string) {
    return this.postService.getSimilar(+id);
  }
  @Get('by-id/:id')
  async getPostById(@Param('id') id: string) {
    return this.postService.byId(+id);
  }
  @Get('by-slug/:slug')
  async getPostBySlug(@Param('slug') slug: string) {
    return this.postService.bySlug(slug);
  }
  @Get('by-category/:categorySlug')
  async getPostByCategory(@Param('categorySlug') categorySlug: string) {
    return this.postService.byCategory(categorySlug);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  async createPost() {
    return this.postService.create();
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  async updatePost(@Param('id') id: string, @Body() dto: PostDto) {
    return this.postService.update(+id, dto);
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return this.postService.delete(+id);
  }
}
