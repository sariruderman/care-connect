import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBabysitterDto } from './dto/create-babysitter.dto';
import { RegisterBabysitterDto } from './dto/register-babysitter.dto';
import { ApprovalMode } from '@prisma/client';

@Injectable()
export class BabysittersService {
  constructor(private readonly prisma: PrismaService) {}

  async register(data: RegisterBabysitterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { phone: data.phone },
    });

    if (existingUser) {
      throw new ConflictException('Phone number already registered');
    }

    let city = await this.prisma.city.findUnique({ where: { name: data.city } });
    if (!city) {
      city = await this.prisma.city.create({ data: { name: data.city } });
    }

    let neighborhood = await this.prisma.neighborhood.findFirst({
      where: { cityId: city.id, name: data.neighborhood },
    });
    if (!neighborhood) {
      neighborhood = await this.prisma.neighborhood.create({
        data: { cityId: city.id, name: data.neighborhood },
      });
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          phone: data.phone,
          email: data.email,
          isVerified: true,
        },
      });

      await tx.userRole.create({
        data: {
          userId: user.id,
          role: 'BABYSITTER',
        },
      });

      const profile = await tx.babysitterProfile.create({
        data: {
          userId: user.id,
          fullName: data.fullName,
          age: data.age,
          cityId: city.id,
          neighborhoodId: neighborhood.id,
          walkingRadiusMinutes: data.walkingRadiusMinutes,
          serviceAreas: data.serviceAreas,
          experienceYears: data.experienceYears,
          communityStyleId: data.communityStyleId,
          bio: data.bio,
          guardianRequiredApproval: data.hasGuardian || false,
          approvalMode: (data.approvalMode as ApprovalMode) || ApprovalMode.APPROVE_EACH_REQUEST,
          languages: data.languages || [],
        },
      });

      return { user, profile };
    });

    return { success: true, data: result };
  }

  async findAll() {
    return this.prisma.babysitterProfile.findMany({
      include: {
        city: true,
        neighborhood: true,
        communityStyle: true,
        user: true,
        guardian: true,
      },
    });
  }

  async findOne(id: string) {
    const babysitter = await this.prisma.babysitterProfile.findUnique({
      where: { id },
      include: {
        city: true,
        neighborhood: true,
        communityStyle: true,
        user: true,
        guardian: true,
      },
    });

    if (!babysitter) throw new NotFoundException('Babysitter not found');
    return babysitter;
  }

  async findByUserId(userId: string) {
    const babysitter = await this.prisma.babysitterProfile.findUnique({
      where: { userId },
      include: {
        city: true,
        neighborhood: true,
        communityStyle: true,
        user: true,
        guardian: true,
      },
    });

    if (!babysitter) throw new NotFoundException('Babysitter profile not found');
    return babysitter;
  }

  async update(
    id: string,
    data: Partial<CreateBabysitterDto> & { cityId?: string; neighborhoodId?: string; communityStyleId?: string },
  ) {
    const updateData: any = {};

    if (data.fullName) updateData.fullName = data.fullName;
    if (data.age) updateData.age = data.age;
    if (data.neighborhood) updateData.neighborhood = data.neighborhood;
    if (data.walkingRadiusMinutes !== undefined)
      updateData.walkingRadiusMinutes = data.walkingRadiusMinutes;
    if (data.serviceAreas) updateData.serviceAreas = data.serviceAreas;
    if (data.experienceYears !== undefined)
      updateData.experienceYears = data.experienceYears;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.approvalMode) updateData.approvalMode = data.approvalMode;
    if (data.languages) updateData.languages = data.languages;
    if (data.hasGuardian !== undefined)
      updateData.guardianRequiredApproval = data.hasGuardian;

    if (data.cityId) updateData.city = { connect: { id: data.cityId } };
    if (data.neighborhoodId)
      updateData.neighborhood = { connect: { id: data.neighborhoodId } };
    if (data.communityStyleId)
      updateData.communityStyle = { connect: { id: data.communityStyleId } };

    return this.prisma.babysitterProfile.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    await this.prisma.babysitterProfile.delete({ where: { id } });
    return { success: true };
  }
}
