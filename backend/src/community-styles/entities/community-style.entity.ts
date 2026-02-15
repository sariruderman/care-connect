import { ApiProperty } from '@nestjs/swagger';

export class CommunityStyleEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  label!: string;

  @ApiProperty({ required: false })
  description?: string;
}
