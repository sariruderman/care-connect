import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  phone!: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  isVerified!: boolean;
}
