import {
  IsString, MaxLength,
} from 'class-validator';

export class PatchUserDTO {
  // @IsString()
  // @IsOptional()
  // password?: string;

  @IsString()
  @MaxLength(255)
  // @IsOptional()
  avatarUrl: string;
}