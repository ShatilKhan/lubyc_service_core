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
    serviceTypeId?: bigint;
    keyword?: string;
    lat?: string;
    lng?: string;
  }): Promise<any[]> {
    const where: Prisma.ServiceCatalogueWhereInput = {
      isDeleted: 0,
    };

    const providerWhere: Prisma.ServiceProviderWhereInput = {
      isDeleted: 0,
    };

    if (filters?.serviceTypeId) {
      providerWhere.serviceTypeId = filters.serviceTypeId;
    }

    if (filters?.keyword) {
      where.OR = [
        { title: { contains: filters.keyword, mode: 'insensitive' } },
        { description: { contains: filters.keyword, mode: 'insensitive' } },
      ];
    }

    where.provider = providerWhere;

    const services = await this.prisma.serviceCatalogue.findMany({
      where,
      include: {
        provider: {
          include: {
            serviceType: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (filters?.lat && filters?.lng) {
      const servicesWithDistance = services.map((service: any) => {
        const distance = this.calculateDistance(
          parseFloat(filters.lat!),
          parseFloat(filters.lng!),
          parseFloat(service.provider.lat || '0'),
          parseFloat(service.provider.lng || '0'),
        );

        return {
          ...service,
          distance,
        };
      });

      return servicesWithDistance
        .filter((service: any) => {
          const maxRadius = service.provider.geoRadius || 10;
          return service.distance <= maxRadius;
        })
        .sort((a: any, b: any) => a.distance - b.distance);
    }

    return services;
  }

  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371;
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}