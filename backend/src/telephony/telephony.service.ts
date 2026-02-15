import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTelephonySessionDto } from './dto/create-telephony-session.dto';

@Injectable()
export class TelephonyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTelephonySessionDto) {
    return this.prisma.telephonySession.create({ data });
  }

  async findAll() {
    return this.prisma.telephonySession.findMany();
  }

  async findOne(id: string) {
    const session = await this.prisma.telephonySession.findUnique({ where: { id } });
    if (!session) throw new NotFoundException('Telephony session not found');
    return session;
  }

  async update(id: string, data: Partial<CreateTelephonySessionDto>) {
    return this.prisma.telephonySession.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.prisma.telephonySession.delete({ where: { id } });
    return { success: true };
  }
}
