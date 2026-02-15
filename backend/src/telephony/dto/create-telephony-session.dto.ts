import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTelephonySessionDto {
  @ApiProperty({ example: 'call-uuid' })
  @IsString()
  @IsNotEmpty()
  callId!: string;

  @ApiProperty({ example: '+972501234567' })
  @IsString()
  @IsNotEmpty()
  phone!: string;
}
