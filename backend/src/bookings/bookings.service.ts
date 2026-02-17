import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBookingDto & { requestId: string; parentId: string; babysitterId: string }) {
    const { requestId, parentId, babysitterId, datetimeStart, datetimeEnd, address } = data;
    return this.prisma.booking.create({
      data: {
        datetimeStart,
        datetimeEnd,
        address,
        request: { connect: { id: requestId } },
        parent: { connect: { id: parentId } },
        babysitter: { connect: { id: babysitterId } },
      },
    });
  }

  async findAll() {
    return this.prisma.booking.findMany();
  }

  async findByParent(parentId: string) {
    return this.prisma.booking.findMany({
      where: { parentId },
      include: {
        babysitter: true,
        request: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByBabysitter(babysitterId: string) {
    return this.prisma.booking.findMany({
      where: { babysitterId },
      include: {
        parent: true,
        request: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async update(id: string, data: Partial<CreateBookingDto> & { requestId?: string; parentId?: string; babysitterId?: string }) {
    const { requestId, parentId, babysitterId, ...rest } = data;
    return this.prisma.booking.update({
      where: { id },
      data: {
        ...rest,
        ...(requestId ? { request: { connect: { id: requestId } } } : {}),
        ...(parentId ? { parent: { connect: { id: parentId } } } : {}),
        ...(babysitterId ? { babysitter: { connect: { id: babysitterId } } } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.prisma.booking.delete({ where: { id } });
    return { success: true };
  }
}
