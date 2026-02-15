import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateParentRequestDto {
  @ApiProperty()
  @IsString()
  userId!: string;

  @ApiProperty()
  @IsString()
  cityId!: string;

  @ApiProperty()
  @IsString()
  full_name!: string;

  @ApiProperty()
  @IsString()
  address!: string;

  @ApiProperty()
  @IsString()
  neighborhood!: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  languages!: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  email?: string;
}
