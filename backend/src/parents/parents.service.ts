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

    if (!existingUser) {
      throw new ConflictException('User not found. Please verify OTP first.');
    }

    const existingProfile = await this.prisma.parentProfile.findUnique({
      where: { userId: existingUser.id },
    });

    if (existingProfile) {
      // Profile already exists, return it instead of throwing error
      return { success: true, data: { user: existingUser, profile: existingProfile } };
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
      await tx.user.update({
        where: { id: existingUser.id },
        data: { email: data.email },
      });

      // Check if role already exists
      const existingRole = await tx.userRole.findFirst({
        where: {
          userId: existingUser.id,
          role: 'PARENT',
        },
      });

      if (!existingRole) {
        await tx.userRole.create({
          data: {
            userId: existingUser.id,
            role: 'PARENT',
          },
        });
      }

      const profileData: any = {
        userId: existingUser.id,
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

      return { user: existingUser, profile };
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

  async update(id: string, data: Partial<CreateParentDto> & { cityId?: string; neighborhoodId?: string; communityStyleId?: string }) {
    const updateData: any = {};

    if (data.fullName) updateData.fullName = data.fullName;
    if (data.address) updateData.address = data.address;
    if (data.childrenAges) updateData.childrenAges = data.childrenAges;
    if (data.householdNotes !== undefined) updateData.householdNotes = data.householdNotes;
    if (data.languages) updateData.languages = data.languages;

    if (data.cityId) updateData.city = { connect: { id: data.cityId } };
    if (data.neighborhoodId) updateData.neighborhood = { connect: { id: data.neighborhoodId } };
    if (data.communityStyleId) updateData.communityStyle = { connect: { id: data.communityStyleId } };

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
