import { Controller, Post, Get, Param, Body, Patch, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';

interface CreateJobRequest extends CreateJobDto {
  parentId: string;
}

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async create(@Body() dto: CreateJobRequest) {
    return await this.jobsService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.jobsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.jobsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateJobDto> & { parentId?: string }) {
    return await this.jobsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.jobsService.remove(id);
  }
}
