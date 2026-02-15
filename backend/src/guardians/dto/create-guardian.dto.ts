import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGuardianDto {
  @ApiProperty()
  @IsString()
  userId!: string;
  
  @ApiProperty({ example: '+972501234568' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({ example: 'רחל לוי' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;
}
