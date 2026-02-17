import { IsString, IsInt, IsArray, IsOptional, IsBoolean, IsNotEmpty, IsEmail, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RegisterBabysitterDto {
  @ApiProperty({ example: '+972501234567' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({ example: 'babysitter@email.com', required: false })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'נועה לוי' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: 17 })
  @Type(() => Number)
  @IsInt()
  @Min(14)
  @Max(100)
  age!: number;

  @ApiProperty({ example: 'בני ברק' })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty({ example: 'שיכון ה' })
  @IsString()
  @IsNotEmpty()
  neighborhood!: string;

  @ApiProperty({ example: 15 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  walkingRadiusMinutes!: number;

  @ApiProperty({ type: [String], example: ['שיכון ה', 'רמת אלחנן'] })
  @IsArray()
  serviceAreas!: string[];

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  experienceYears!: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  communityStyleId?: string;

  @ApiProperty({ example: 'אני אוהבת ילדים', required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  hasGuardian?: boolean;

  @ApiProperty({ example: '+972501234567', required: false })
  @IsString()
  @IsOptional()
  guardianPhone?: string;

  @ApiProperty({ example: 'שם ההורה', required: false })
  @IsString()
  @IsOptional()
  guardianName?: string;

  @ApiProperty({ example: 'APPROVE_EACH_REQUEST', required: false })
  @IsString()
  @IsOptional()
  approvalMode?: string;

  @ApiProperty({ type: [String], example: ['hebrew', 'english'], required: false })
  @IsArray()
  @IsOptional()
  languages?: string[];
}
