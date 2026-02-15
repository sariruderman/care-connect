import { Controller, Post, Get, Param, Body, Patch, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GuardiansService } from './guardians.service';
import { CreateGuardianDto } from './dto/create-guardian.dto';

interface CreateGuardianRequest extends CreateGuardianDto {
  userId: string;
  babysitterId: string;
}

@ApiTags('Guardians')
@Controller('guardians')
export class GuardiansController {
  constructor(private readonly guardiansService: GuardiansService) {}

  @Post()
  async create(@Body() dto: CreateGuardianRequest) {
    return await this.guardiansService.create(dto);
  }

// @Post()
// async create(@Body() dto: CreateGuardianDto) {
//   return await this.guardiansService.create(dto);
// }

  @Get()
  async findAll() {
    return await this.guardiansService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.guardiansService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateGuardianDto> & { babysitterId?: string }) {
    return await this.guardiansService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.guardiansService.remove(id);
  }
}
