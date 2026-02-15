import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateJobDto & { parentId: string }) {
    const { parentId, ...rest } = data;
    return this.prisma.request.create({
      data: {
        ...rest,
        parent: { connect: { id: parentId } },
      },
    });
  }

  async findAll() {
    return this.prisma.request.findMany();
  }

  async findOne(id: string) {
    const job = await this.prisma.request.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async update(id: string, data: Partial<CreateJobDto> & { parentId?: string }) {
    const { parentId, ...rest } = data;
    return this.prisma.request.update({
      where: { id },
      data: {
        ...rest,
        ...(parentId ? { parent: { connect: { id: parentId } } } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.prisma.request.delete({ where: { id } });
    return { success: true };
  }
}
