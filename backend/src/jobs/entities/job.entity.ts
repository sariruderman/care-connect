import { ApiProperty } from '@nestjs/swagger';

export class JobEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  parent_id!: string;

  @ApiProperty()
  datetime_start!: string;

  @ApiProperty()
  datetime_end!: string;

  @ApiProperty()
  area!: string;

  @ApiProperty({ type: [Number] })
  children_ages!: number[];
}
