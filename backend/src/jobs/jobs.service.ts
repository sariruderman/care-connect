import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { RequestStatus } from '@prisma/client';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateJobDto) {
    const { parentId, datetime_start, datetime_end, area, children_ages, address, requirements } = data;

    if (!parentId || typeof parentId !== 'string') {
      throw new NotFoundException('parentId is required and must be a string');
    }

    // Validate parent exists
    const parent = await this.prisma.parentProfile.findUnique({ where: { id: parentId } });
    if (!parent) throw new NotFoundException('Parent profile not found');

    // Create the request
    const request = await this.prisma.request.create({
      data: {
        parentId,
        datetimeStart: new Date(datetime_start),
        datetimeEnd: new Date(datetime_end),
        area,
        childrenAges: children_ages,
        address,
        requirements,
        status: RequestStatus.MATCHING,
      },
    });

    // Find matching babysitters
    await this.findAndNotifyBabysitters(request.id);

    return { success: true, data: request };
  }

  private async findAndNotifyBabysitters(requestId: string) {
    const request = await this.prisma.request.findUnique({
      where: { id: requestId },
      include: { parent: { include: { city: true, neighborhood: true } } },
    });

    if (!request) return;

    console.log('=== MATCHING BABYSITTERS ===');
    console.log('Parent city:', request.parent.city.name);
    console.log('Parent neighborhood:', request.parent.neighborhood.name);
    console.log('Request area:', request.area);

    // Find matching babysitters based on location
    const babysitters = await this.prisma.babysitterProfile.findMany({
      where: {
        cityId: request.parent.cityId,
        OR: [
          // Same neighborhood
          { neighborhoodId: request.parent.neighborhoodId },
          // Parent's neighborhood in babysitter's service areas
          { serviceAreas: { has: request.parent.neighborhood.name } },
          // Request area in babysitter's service areas
          { serviceAreas: { has: request.area } },
        ],
      },
      include: { user: true, neighborhood: true },
    });

    console.log(`Found ${babysitters.length} matching babysitters`);
    babysitters.forEach(b => {
      console.log(`- ${b.fullName} (${b.neighborhood.name}, serviceAreas: ${b.serviceAreas.join(', ')})`);
    });

    // Create candidate records for each babysitter
    for (const babysitter of babysitters) {
      await this.prisma.requestCandidate.create({
        data: {
          requestId: request.id,
          babysitterId: babysitter.id,
          response: 'PENDING',
        },
      });

      // TODO: Send notification (voice call + email)
      console.log(`Notifying babysitter ${babysitter.fullName} about request ${requestId}`);
    }

    // Update request status
    await this.prisma.request.update({
      where: { id: requestId },
      data: { status: RequestStatus.PENDING_RESPONSES },
    });
  }

  async findAll() {
    return this.prisma.request.findMany({
      include: {
        parent: true,
        candidates: { include: { babysitter: true } },
      },
    });
  }

  async findOne(id: string) {
    const job = await this.prisma.request.findUnique({
      where: { id },
      include: {
        parent: true,
        candidates: { include: { babysitter: true } },
      },
    });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async findByParent(parentId: string) {
    return this.prisma.request.findMany({
      where: { parentId },
      include: {
        candidates: { include: { babysitter: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCandidates(requestId: string) {
    return this.prisma.requestCandidate.findMany({
      where: { requestId },
      include: {
        babysitter: { include: { city: true, neighborhood: true } },
        request: true,
      },
    });
  }

  async update(id: string, data: Partial<CreateJobDto>) {
    return this.prisma.request.update({
      where: { id },
      data: {
        ...(data.datetime_start && { datetimeStart: new Date(data.datetime_start) }),
        ...(data.datetime_end && { datetimeEnd: new Date(data.datetime_end) }),
        ...(data.area && { area: data.area }),
        ...(data.children_ages && { childrenAges: data.children_ages }),
        ...(data.address && { address: data.address }),
        ...(data.requirements && { requirements: data.requirements }),
      },
    });
  }

  async remove(id: string) {
    await this.prisma.request.delete({ where: { id } });
    return { success: true };
  }
}
