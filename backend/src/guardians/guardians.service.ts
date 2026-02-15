import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuardianDto } from './dto/create-guardian.dto';

@Injectable()
export class GuardiansService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateGuardianDto & { userId: string; babysitterId?: string }) {
    const { userId, babysitterId, ...rest } = data;
    return this.prisma.guardianProfile.create({
      data: {
        ...rest,
        user: { connect: { id: userId } },
        ...(babysitterId ? { babysitter: { connect: { id: babysitterId } } } : {}),
      },
    });
  }

  async findAll() {
    return this.prisma.guardianProfile.findMany();
  }

  async findOne(id: string) {
    const guardian = await this.prisma.guardianProfile.findUnique({ where: { id } });
    if (!guardian) throw new NotFoundException('Guardian not found');
    return guardian;
  }

  async update(id: string, data: Partial<CreateGuardianDto> & { babysitterId?: string }) {
    const { babysitterId, ...rest } = data;
    return this.prisma.guardianProfile.update({
      where: { id },
      data: {
        ...rest,
        ...(babysitterId ? { babysitter: { connect: { id: babysitterId } } } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.prisma.guardianProfile.delete({ where: { id } });
    return { success: true };
  }
}
