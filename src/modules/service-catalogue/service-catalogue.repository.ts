import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { ServiceCatalogue, Prisma } from '@prisma/client';

@Injectable()
export class ServiceCatalogueRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ServiceCatalogueCreateInput): Promise<ServiceCatalogue> {
    return this.prisma.serviceCatalogue.create({
      data,
    });
  }

  async findByProviderId(serviceProviderId: bigint): Promise<ServiceCatalogue[]> {
    return this.prisma.serviceCatalogue.findMany({
      where: {
        serviceProviderId,
        isDeleted: 0,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: bigint): Promise<ServiceCatalogue | null> {
    return this.prisma.serviceCatalogue.findFirst({
      where: {
        id,
        isDeleted: 0,
      },
    });
  }

  async update(
    id: bigint,
    data: Prisma.ServiceCatalogueUpdateInput,
  ): Promise<ServiceCatalogue> {
    return this.prisma.serviceCatalogue.update({
      where: { id },
      data,
    });
  }

  async delete(id: bigint, updatedBy?: bigint): Promise<ServiceCatalogue> {
    return this.prisma.serviceCatalogue.update({
      where: { id },
      data: {
        isDeleted: 1,
        updatedBy,
      },
    });
  }

  async findPublicServices(filters?: {
    serviceTypeId?: number;
    keyword?: string;
    lat?: string;
    lng?: string;
  }): Promise<ServiceCatalogue[]> {
    const where: Prisma.ServiceCatalogueWhereInput = {
      isDeleted: 0,
    };

    if (filters?.keyword) {
      where.OR = [
        { title: { contains: filters.keyword, mode: 'insensitive' } },
        { description: { contains: filters.keyword, mode: 'insensitive' } },
      ];
    }

    return this.prisma.serviceCatalogue.findMany({
      where,
      include: {
        provider: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}