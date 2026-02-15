import { ApiProperty } from '@nestjs/swagger';

export class TelephonySessionEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  call_id!: string;

  @ApiProperty()
  phone!: string;
}
