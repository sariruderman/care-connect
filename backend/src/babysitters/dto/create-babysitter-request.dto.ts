import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { CreateBabysitterDto } from './create-babysitter.dto';

export class CreateBabysitterRequestDto extends CreateBabysitterDto {
  @ApiProperty()
  @IsString()
  userId!: string;

  @ApiProperty()
  @IsString()
  cityId!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  communityStyleId!: string;
}
