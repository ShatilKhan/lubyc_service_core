import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { ServiceProvider, Prisma } from '@prisma/client';

@Injectable()
export class ProvidersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ServiceProviderCreateInput): Promise<ServiceProvider> {
    return this.prisma.serviceProvider.create({
      data,
      include: {
        serviceType: true,
      },
    });
  }

  async findById(id: bigint): Promise<ServiceProvider | null> {
    return this.prisma.serviceProvider.findUnique({
      where: {
        id,
        isDeleted: 0,
      },
      include: {
        serviceType: true,
      },
    });
  }

  async findByUserId(userId: bigint): Promise<ServiceProvider[]> {
    return this.prisma.serviceProvider.findMany({
      where: {
        userId,
        isDeleted: 0,
      },
      include: {
        serviceType: true,
      },
    });
  }

  async update(
    id: bigint,
    data: Prisma.ServiceProviderUpdateInput,
  ): Promise<ServiceProvider> {
    return this.prisma.serviceProvider.update({
      where: { id },
      data,
      include: {
        serviceType: true,
      },
    });
  }

  async softDelete(id: bigint): Promise<ServiceProvider> {
    return this.prisma.serviceProvider.update({
      where: { id },
      data: { isDeleted: 1 },
    });
  }

  async checkServiceTypeExists(serviceTypeId: bigint): Promise<boolean> {
    const serviceType = await this.prisma.serviceType.findUnique({
      where: { id: serviceTypeId },
    });
    return !!serviceType;
  }
}