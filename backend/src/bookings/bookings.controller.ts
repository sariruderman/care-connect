import { Controller, Post, Get, Param, Body, Patch, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

interface CreateBookingRequest extends CreateBookingDto {
  requestId: string;
  parentId: string;
  babysitterId: string;
}

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(@Body() dto: CreateBookingRequest) {
    return await this.bookingsService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.bookingsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.bookingsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateBookingDto> & { requestId?: string; parentId?: string; babysitterId?: string }) {
    return await this.bookingsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.bookingsService.remove(id);
  }
}
