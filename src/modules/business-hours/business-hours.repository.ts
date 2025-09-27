import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { BusinessHours, Prisma } from '@prisma/client';

@Injectable()
export class BusinessHoursRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.BusinessHoursCreateInput): Promise<BusinessHours> {
    return this.prisma.businessHours.create({
      data,
    });
  }

  async findByProviderId(providerId: bigint): Promise<BusinessHours[]> {
    return this.prisma.businessHours.findMany({
      where: {
        providerId,
        isDeleted: 0,
      },
      orderBy: {
        dayOfWeek: 'asc',
      },
    });
  }

  async findByProviderIdAndDay(
    providerId: bigint,
    dayOfWeek: number,
  ): Promise<BusinessHours | null> {
    return this.prisma.businessHours.findFirst({
      where: {
        providerId,
        dayOfWeek,
        isDeleted: 0,
      },
    });
  }

  async findById(id: bigint): Promise<BusinessHours | null> {
    return this.prisma.businessHours.findUnique({
      where: {
        id,
        isDeleted: 0,
      },
    });
  }

  async update(
    id: bigint,
    data: Prisma.BusinessHoursUpdateInput,
  ): Promise<BusinessHours> {
    return this.prisma.businessHours.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: bigint): Promise<BusinessHours> {
    return this.prisma.businessHours.update({
      where: { id },
      data: { isDeleted: 1 },
    });
  }

  async upsert(
    providerId: bigint,
    dayOfWeek: number,
    data: Prisma.BusinessHoursCreateInput,
  ): Promise<BusinessHours> {
    return this.prisma.businessHours.upsert({
      where: {
        providerId_dayOfWeek: {
          providerId,
          dayOfWeek,
        },
      },
      update: {
        openTime: data.openTime,
        closeTime: data.closeTime,
        isClosed: data.isClosed,
        isDeleted: 0,
        updatedAt: new Date(),
      },
      create: data,
    });
  }
}