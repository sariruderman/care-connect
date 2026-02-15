import { IsString, IsInt, IsArray, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'request-uuid' })
  @IsString()
  @IsNotEmpty()
  requestId!: string;

  @ApiProperty({ example: 'parent-uuid' })
  @IsString()
  @IsNotEmpty()
  parentId!: string;

  @ApiProperty({ example: 'babysitter-uuid' })
  @IsString()
  @IsNotEmpty()
  babysitterId!: string;

  @ApiProperty({ example: '2024-06-01T18:00:00Z' })
  @IsString()
  @IsNotEmpty()
  datetimeStart!: string;

  @ApiProperty({ example: '2024-06-01T22:00:00Z' })
  @IsString()
  @IsNotEmpty()
  datetimeEnd!: string;

  @ApiProperty({ example: 'רחוב הרצל 15' })
  @IsString()
  @IsNotEmpty()
  address!: string;
}
