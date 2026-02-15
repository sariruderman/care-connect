import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { RegisterParentDto } from './dto/register-parent.dto';

@Injectable()
export class ParentsService {
  constructor(private readonly prisma: PrismaService) {}

  async register(data: RegisterParentDto) {
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
          role: 'PARENT',
        },
      });

      const profileData: any = {
        userId: user.id,
        fullName: data.fullName,
        address: data.address,
        cityId: city.id,
        neighborhoodId: neighborhood.id,
        childrenAges: data.childrenAges,
        languages: data.languages || [],
      };

      if (data.householdNotes) {
        profileData.householdNotes = data.householdNotes;
      }

      if (data.communityStyleId) {
        profileData.communityStyleId = data.communityStyleId;
      }

      const profile = await tx.parentProfile.create({
        data: profileData,
      });

      return { user, profile };
    });

    return { success: true, data: result };
  }

  async create(data: CreateParentDto & { userId: string; cityId: string; neighborhoodId: string }) {
    const { userId, cityId, neighborhoodId, communityStyleId, householdNotes, ...rest } = data;
    
    const profileData: any = {
      userId,
      cityId,
      neighborhoodId,
      ...rest,
    };

    if (householdNotes) {
      profileData.householdNotes = householdNotes;
    }

    if (communityStyleId) {
      profileData.communityStyleId = communityStyleId;
    }

    return this.prisma.parentProfile.create({
      data: profileData,
    });
  }

  async findAll() {
    return this.prisma.parentProfile.findMany({
      include: {
        user: true,
        city: true,
        neighborhood: true,
        communityStyle: true,
      },
    });
  }

  async findOne(id: string) {
    const parent = await this.prisma.parentProfile.findUnique({
      where: { id },
      include: {
        user: true,
        city: true,
        neighborhood: true,
        communityStyle: true,
      },
    });
    if (!parent) throw new NotFoundException('Parent not found');
    return parent;
  }

  async findByUserId(userId: string) {
    const parent = await this.prisma.parentProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        city: true,
        neighborhood: true,
        communityStyle: true,
      },
    });
    if (!parent) throw new NotFoundException('Parent profile not found');
    return parent;
  }

  async update(id: string, data: Partial<CreateParentDto> & { cityId?: string; neighborhoodId?: string }) {
    const { cityId, neighborhoodId, ...rest } = data;
    const updateData: any = { ...rest };
    if (cityId) {
      updateData.city = { connect: { id: cityId } };
    }
    if (neighborhoodId) {
      updateData.neighborhood = { connect: { id: neighborhoodId } };
    }
    return this.prisma.parentProfile.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    await this.prisma.parentProfile.delete({ where: { id } });
    return { success: true };
  }
}
