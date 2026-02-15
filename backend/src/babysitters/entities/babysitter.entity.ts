import { ApiProperty } from '@nestjs/swagger';

export class BabysitterEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  full_name!: string;

  @ApiProperty()
  age!: number;

  @ApiProperty()
  city!: string;

  @ApiProperty()
  neighborhood!: string;

  @ApiProperty({ type: [String] })
  service_areas!: string[];

  @ApiProperty()
  experience_years!: number;

  @ApiProperty({ required: false })
  communityStyleId?: string;

  @ApiProperty({ required: false })
  bio?: string;

  @ApiProperty()
  has_guardian!: boolean;

  @ApiProperty({ required: false })
  guardian_phone?: string;

  @ApiProperty({ required: false })
  guardian_name?: string;

  @ApiProperty()
  approval_mode!: string;

  @ApiProperty({ type: [String] })
  languages!: string[];
}
