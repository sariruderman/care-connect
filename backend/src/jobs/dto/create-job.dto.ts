import { IsString, IsInt, IsArray, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty({ example: 'parent-uuid' })
  @IsString()
  @IsNotEmpty()
  parentId!: string;

  @ApiProperty({ example: '2024-06-01T18:00:00Z' })
  @IsString()
  @IsNotEmpty()
  datetimeStart!: string;

  @ApiProperty({ example: '2024-06-01T22:00:00Z' })
  @IsString()
  @IsNotEmpty()
  datetimeEnd!: string;

  @ApiProperty({ example: 'רמת אביב' })
  @IsString()
  @IsNotEmpty()
  area!: string;

  @ApiProperty({ example: [3, 5] })
  @IsArray()
  childrenAges!: number[];
}
