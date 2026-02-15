import { ApiProperty } from '@nestjs/swagger';

export class LocationEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;
}
