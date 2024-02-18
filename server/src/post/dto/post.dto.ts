import { ArrayMinSize, IsNumber, IsString } from 'class-validator';

export class PostDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsString()
  content: string;
  @IsString({ each: true })
  @ArrayMinSize(1)
  images: string[];
  @IsNumber()
  categoryId: number;
}
