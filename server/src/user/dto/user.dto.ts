import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  avatarParh: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
