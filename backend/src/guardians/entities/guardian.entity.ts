import { ApiProperty } from '@nestjs/swagger';

export class GuardianEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  babysitterId!: string;

  @ApiProperty()
  phone!: string;

  @ApiProperty()
  name!: string;
}
