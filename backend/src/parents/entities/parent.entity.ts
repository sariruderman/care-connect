import { ApiProperty } from '@nestjs/swagger';

export class ParentEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  full_name!: string;

  @ApiProperty()
  address!: string;

  @ApiProperty()
  city!: string;

  @ApiProperty()
  neighborhood!: string;

  @ApiProperty({ type: [String] })
  languages!: string[];

  @ApiProperty({ required: false })
  email?: string;
}
