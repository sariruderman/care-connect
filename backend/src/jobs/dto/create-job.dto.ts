import { IsString, IsInt, IsArray, IsOptional, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateJobDto {
  @ApiProperty({ example: 'parent-uuid' })
  @IsString()
  @IsNotEmpty()
  parentId!: string;

  @ApiProperty({ example: '2024-06-01T18:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  datetime_start!: string;

  @ApiProperty({ example: '2024-06-01T22:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  datetime_end!: string;

  @ApiProperty({ example: 'רמת אביב' })
  @IsString()
  @IsNotEmpty()
  area!: string;

  @ApiProperty({ example: [3, 5] })
  @IsArray()
  children_ages!: number[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  requirements?: string;
}
