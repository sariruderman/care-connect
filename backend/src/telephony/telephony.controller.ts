import { Controller, Post, Get, Param, Body, Patch, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TelephonyService } from './telephony.service';
import { CreateTelephonySessionDto } from './dto/create-telephony-session.dto';

@ApiTags('Telephony')
@Controller('telephony')
export class TelephonyController {
  constructor(private readonly telephonyService: TelephonyService) {}

  @Post()
  async create(@Body() dto: CreateTelephonySessionDto) {
    return await this.telephonyService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.telephonyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.telephonyService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateTelephonySessionDto>) {
    return await this.telephonyService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.telephonyService.remove(id);
  }
}
