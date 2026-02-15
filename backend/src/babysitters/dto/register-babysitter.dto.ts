import { IsString, IsInt, IsArray, IsOptional, IsBoolean, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterBabysitterDto {
  @ApiProperty({ example: '+972501234567' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({ example: 'babysitter@email.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'נועה לוי' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: 17 })
  @IsInt()
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
  @IsInt()
  walkingRadiusMinutes!: number;

  @ApiProperty({ type: [String], example: ['שיכון ה', 'רמת אלחנן'] })
  @IsArray()
  serviceAreas!: string[];

  @ApiProperty({ example: 2 })
  @IsInt()
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

  @ApiProperty({ example: 'APPROVE_EACH_REQUEST', required: false })
  @IsString()
  @IsOptional()
  approvalMode?: string;

  @ApiProperty({ type: [String], example: ['hebrew', 'english'], required: false })
  @IsArray()
  @IsOptional()
  languages?: string[];
}
