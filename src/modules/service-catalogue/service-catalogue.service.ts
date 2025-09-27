import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ServiceCatalogueRepository } from './service-catalogue.repository';
import { CreateServiceCatalogueDto } from './dto/create-service-catalogue.dto';
import { UpdateServiceCatalogueDto } from './dto/update-service-catalogue.dto';
import { ProvidersRepository } from '../providers/providers.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class ServiceCatalogueService {
  constructor(
    private readonly serviceCatalogueRepository: ServiceCatalogueRepository,
    private readonly providersRepository: ProvidersRepository,
  ) {}

  async createService(
    providerId: string,
    userId: string,
    dto: CreateServiceCatalogueDto,
  ) {
    const providerIdBigInt = BigInt(providerId);
    const userIdBigInt = BigInt(userId);

    const provider = await this.providersRepository.findById(providerIdBigInt);
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const data: Prisma.ServiceCatalogueCreateInput = {
      provider: {
        connect: { id: providerIdBigInt },
      },
      userId: userIdBigInt,
      title: dto.title,
      price: new Prisma.Decimal(dto.price),
      duration: dto.duration,
      durationType: dto.durationType,
      description: dto.description,
      image: dto.image,
      currency: dto.currency || 'USD',
      isPriceRange: dto.isPriceRange || 0,
      rangePrice: dto.rangePrice ? new Prisma.Decimal(dto.rangePrice) : undefined,
      serveCapacity: dto.serveCapacity || 1,
    };

    const service = await this.serviceCatalogueRepository.create(data);

    return this.transformServiceForResponse(service);
  }

  async getProviderServices(providerId: string) {
    const providerIdBigInt = BigInt(providerId);
    const services = await this.serviceCatalogueRepository.findByProviderId(providerIdBigInt);

    return services.map(service => this.transformServiceForResponse(service));
  }

  async getServiceById(providerId: string, catalogueId: string) {
    const catalogueIdBigInt = BigInt(catalogueId);
    const providerIdBigInt = BigInt(providerId);

    const service = await this.serviceCatalogueRepository.findById(catalogueIdBigInt);

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (service.serviceProviderId !== providerIdBigInt) {
      throw new NotFoundException('Service not found for this provider');
    }

    return this.transformServiceForResponse(service);
  }

  async updateService(
    providerId: string,
    catalogueId: string,
    dto: UpdateServiceCatalogueDto,
  ) {
    const catalogueIdBigInt = BigInt(catalogueId);
    const providerIdBigInt = BigInt(providerId);

    const existingService = await this.serviceCatalogueRepository.findById(catalogueIdBigInt);

    if (!existingService) {
      throw new NotFoundException('Service not found');
    }

    if (existingService.serviceProviderId !== providerIdBigInt) {
      throw new NotFoundException('Service not found for this provider');
    }

    const updateData: Prisma.ServiceCatalogueUpdateInput = {};

    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.price !== undefined) updateData.price = new Prisma.Decimal(dto.price);
    if (dto.duration !== undefined) updateData.duration = dto.duration;
    if (dto.durationType !== undefined) updateData.durationType = dto.durationType;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.image !== undefined) updateData.image = dto.image;
    if (dto.currency !== undefined) updateData.currency = dto.currency;
    if (dto.isPriceRange !== undefined) updateData.isPriceRange = dto.isPriceRange;
    if (dto.rangePrice !== undefined) updateData.rangePrice = new Prisma.Decimal(dto.rangePrice);
    if (dto.serveCapacity !== undefined) updateData.serveCapacity = dto.serveCapacity;

    const updatedService = await this.serviceCatalogueRepository.update(
      catalogueIdBigInt,
      updateData,
    );

    return this.transformServiceForResponse(updatedService);
  }

  async deleteService(providerId: string, catalogueId: string) {
    const catalogueIdBigInt = BigInt(catalogueId);
    const providerIdBigInt = BigInt(providerId);

    const existingService = await this.serviceCatalogueRepository.findById(catalogueIdBigInt);

    if (!existingService) {
      throw new NotFoundException('Service not found');
    }

    if (existingService.serviceProviderId !== providerIdBigInt) {
      throw new NotFoundException('Service not found for this provider');
    }

    await this.serviceCatalogueRepository.delete(catalogueIdBigInt);
  }

  async searchPublicServices(filters?: {
    serviceTypeId?: string;
    keyword?: string;
    lat?: string;
    lng?: string;
  }) {
    const searchFilters = filters ? {
      serviceTypeId: filters.serviceTypeId ? parseInt(filters.serviceTypeId) : undefined,
      keyword: filters.keyword,
      lat: filters.lat,
      lng: filters.lng,
    } : undefined;

    const services = await this.serviceCatalogueRepository.findPublicServices(searchFilters);

    return services.map((service: any) => ({
      ...this.transformServiceForResponse(service),
      provider: service.provider ? {
        id: service.provider.id.toString(),
        businessName: service.provider.businessName,
        latitude: service.provider.latitude?.toString(),
        longitude: service.provider.longitude?.toString(),
      } : undefined,
    }));
  }

  private transformServiceForResponse(service: any) {
    return {
      id: service.id.toString(),
      userId: service.userId.toString(),
      serviceProviderId: service.serviceProviderId.toString(),
      image: service.image,
      title: service.title,
      description: service.description,
      currency: service.currency,
      price: service.price.toNumber(),
      isPriceRange: service.isPriceRange,
      rangePrice: service.rangePrice ? service.rangePrice.toNumber() : null,
      durationType: service.durationType,
      duration: service.duration,
      serveCapacity: service.serveCapacity,
      status: service.status,
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
      updatedBy: service.updatedBy ? service.updatedBy.toString() : null,
      isDeleted: service.isDeleted,
    };
  }
}