import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateLocationDto) {
    return this.prisma.city.create({ data });
  }

  async findAll() {
    return this.prisma.city.findMany();
  }

  async findOne(id: string) {
    const city = await this.prisma.city.findUnique({ where: { id } });
    if (!city) throw new NotFoundException('City not found');
    return city;
  }

  async update(id: string, data: Partial<CreateLocationDto>) {
    return this.prisma.city.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.prisma.city.delete({ where: { id } });
    return { success: true };
  }
}
