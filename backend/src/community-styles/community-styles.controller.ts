import { Controller, Post, Get, Param, Body, Patch, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommunityStylesService } from './community-styles.service';
import { CreateCommunityStyleDto } from './dto/create-community-style.dto';

@ApiTags('Community Styles')
@Controller('community-styles')
export class CommunityStylesController {
  constructor(private readonly communityStylesService: CommunityStylesService) {}

  @Post()
  async create(@Body() dto: CreateCommunityStyleDto) {
    return await this.communityStylesService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.communityStylesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.communityStylesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateCommunityStyleDto>) {
    return await this.communityStylesService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.communityStylesService.remove(id);
  }
}
