import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommunityStyleDto } from './dto/create-community-style.dto';

@Injectable()
export class CommunityStylesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCommunityStyleDto) {
    return this.prisma.communityStyle.create({ data });
  }

  async findAll() {
    return this.prisma.communityStyle.findMany();
  }

  async findOne(id: string) {
    const style = await this.prisma.communityStyle.findUnique({ where: { id } });
    if (!style) throw new NotFoundException('Community style not found');
    return style;
  }

  async update(id: string, data: Partial<CreateCommunityStyleDto>) {
    return this.prisma.communityStyle.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.prisma.communityStyle.delete({ where: { id } });
    return { success: true };
  }
}
