import { Controller, Post, Get, Param, Body, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BabysittersService } from './babysitters.service';
import { CreateBabysitterDto } from './dto/create-babysitter.dto';
import { RegisterBabysitterDto } from './dto/register-babysitter.dto';

@ApiTags('Babysitters')
@Controller('babysitters')
export class BabysittersController {
  constructor(private readonly babysittersService: BabysittersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new babysitter' })
  @ApiResponse({ status: 201, description: 'Babysitter registered successfully' })
  async register(@Body() dto: RegisterBabysitterDto) {
    return await this.babysittersService.register(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all babysitters' })
  async findAll() {
    return await this.babysittersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get babysitter by ID' })
  async findOne(@Param('id') id: string) {
    return await this.babysittersService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get babysitter by user ID' })
  async findByUserId(@Param('userId') userId: string) {
    return await this.babysittersService.findByUserId(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update babysitter profile' })
  async update(
    @Param('id') id: string,
    @Body() body: Partial<CreateBabysitterDto> & { cityId?: string; neighborhoodId?: string; communityStyleId?: string },
  ) {
    return await this.babysittersService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete babysitter' })
  async remove(@Param('id') id: string) {
    return await this.babysittersService.remove(id);
  }
}
