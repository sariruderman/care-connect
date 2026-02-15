import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({ example: 'תל אביב' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
