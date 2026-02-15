import { Controller, Post, Get, Param, Body, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ParentsService } from './parents.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { RegisterParentDto } from './dto/register-parent.dto';

@ApiTags('Parents')
@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new parent' })
  async register(@Body() dto: RegisterParentDto) {
    return await this.parentsService.register(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all parents' })
  async findAll() {
    return await this.parentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get parent by ID' })
  async findOne(@Param('id') id: string) {
    return await this.parentsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get parent by user ID' })
  async findByUserId(@Param('userId') userId: string) {
    return await this.parentsService.findByUserId(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update parent profile' })
  async update(@Param('id') id: string, @Body() dto: Partial<CreateParentDto> & { cityId?: string; neighborhoodId?: string }) {
    return await this.parentsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete parent' })
  async remove(@Param('id') id: string) {
    return await this.parentsService.remove(id);
  }
}
