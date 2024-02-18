import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/pagination/dto/pagination.dto';

export enum EnumPostSort {
  NEWEST = 'newest',
  OLDEST = 'oldest',
}

export class GetAllPostDto extends PaginationDto {
  @IsOptional()
  @IsEnum(EnumPostSort)
  sort?: EnumPostSort;

  @IsOptional()
  @IsString()
  searchTerm?: string;
}
