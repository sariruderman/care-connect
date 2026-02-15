import { ApiProperty } from '@nestjs/swagger';

export class BookingEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  request_id!: string;

  @ApiProperty()
  parent_id!: string;

  @ApiProperty()
  babysitter_id!: string;

  @ApiProperty()
  datetime_start!: string;

  @ApiProperty()
  datetime_end!: string;

  @ApiProperty()
  address!: string;
}
