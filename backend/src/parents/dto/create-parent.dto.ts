import { IsString, IsArray, IsOptional, IsEmail, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateParentDto {
  @ApiProperty({ example: '+972501234567' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({ example: 'שרה כהן' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: 'רחוב הרצל 15' })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({ example: 'תל אביב' })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty({ example: 'רמת אביב' })
  @IsString()
  @IsNotEmpty()
  neighborhood!: string;

  @ApiProperty({ example: [3, 5, 8] })
  @IsArray()
  @IsInt({ each: true })
  childrenAges!: number[];

  @ApiProperty({ example: 'יש כלב קטן', required: false })
  @IsString()
  @IsOptional()
  householdNotes?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  communityStyleId?: string;

  @ApiProperty({ example: ['hebrew', 'english'], required: false })
  @IsArray()
  @IsOptional()
  languages?: string[];

  @ApiProperty({ example: 'parent@email.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;
}
