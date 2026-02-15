import { IsString, IsInt, IsArray, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBabysitterDto {
  @ApiProperty({ example: 'נועה לוי' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: 17 })
  @IsInt()
  age!: number;

  @ApiProperty({ example: 'בני ברק' })
  @IsString()
  city!: string;

  @ApiProperty({ example: 'שיכון ה' })
  @IsString()
  neighborhood!: string;

  @ApiProperty({ example: 15 })
  @IsInt()
  walkingRadiusMinutes!: number;

  @ApiProperty({ type: [String], example: ['שיכון ה'] })
  @IsArray()
  serviceAreas!: string[];

  @ApiProperty({ example: 2 })
  @IsInt()
  experienceYears!: number;

  @ApiProperty()
  @IsString()
  communityStyleId!: string;

  @ApiProperty({ example: 'אני אוהבת ילדים' })
  @IsString()
  bio!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  hasGuardian!: boolean;

  @ApiProperty({ example: 'APPROVE_EACH_REQUEST' })
  @IsString()
  approvalMode!: string;

  @ApiProperty({ type: [String], example: ['hebrew', 'english'] })
  @IsArray()
  languages!: string[];
}
