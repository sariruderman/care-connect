import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommunityStyleDto {
  @ApiProperty({ example: 'חילוני' })
  @IsString()
  @IsNotEmpty()
  label!: string;

  @ApiProperty({ example: 'קהילה חילונית פתוחה', required: false })
  @IsString()
  description?: string;
}
