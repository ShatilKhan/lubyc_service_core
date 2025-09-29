import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProvidersRepository } from './providers.repository';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ServiceProvider, AdvancePayType } from '@prisma/client';

@Injectable()
export class ProvidersService {
  constructor(private readonly providersRepository: ProvidersRepository) {}

  async createProvider(
    createProviderDto: CreateProviderDto,
    userId: bigint,
  ): Promise<ServiceProvider> {
    // Validate serviceTypeId exists
    const serviceTypeExists = await this.providersRepository.checkServiceTypeExists(
      BigInt(createProviderDto.serviceTypeId),
    );

    if (!serviceTypeExists) {
      throw new BadRequestException('Service type not found');
    }

    // Prepare data for creation using Prisma's relation connect
    const providerData: any = {
      userId: BigInt(userId),
      serviceType: {
        connect: { id: BigInt(createProviderDto.serviceTypeId) },
      },
      lat: createProviderDto.lat,
      lng: createProviderDto.lng,
      advancePayType: (createProviderDto.advancePayType || 'percent') as AdvancePayType,
      advanceValue: createProviderDto.advanceValue,
      hasCancellation: createProviderDto.hasCancellation ? 1 : 0,
      cancellationTime: createProviderDto.cancellationTime,
      capacity: createProviderDto.capacity || 1,
      status: 0,
      isDeleted: 0,
      advancePay: 0,
    };

    return this.providersRepository.create(providerData);
  }

  async getProviderById(id: string | bigint): Promise<ServiceProvider> {
    const providerId = typeof id === 'string' ? BigInt(id) : id;
    const provider = await this.providersRepository.findById(providerId);

    if (!provider) {
      throw new NotFoundException(`Provider with ID ${id} not found`);
    }

    return provider;
  }

  async updateProvider(
    id: string | bigint,
    updateProviderDto: UpdateProviderDto,
  ): Promise<ServiceProvider> {
    const providerId = typeof id === 'string' ? BigInt(id) : id;

    // Check if provider exists
    await this.getProviderById(providerId);

    // If serviceTypeId is being updated, validate it exists
    if (updateProviderDto.serviceTypeId) {
      const serviceTypeExists = await this.providersRepository.checkServiceTypeExists(
        BigInt(updateProviderDto.serviceTypeId),
      );

      if (!serviceTypeExists) {
        throw new BadRequestException('Service type not found');
      }
    }

    // Prepare update data
    const updateData: any = {};

    if (updateProviderDto.serviceTypeId !== undefined) {
      updateData.serviceType = {
        connect: { id: BigInt(updateProviderDto.serviceTypeId) },
      };
    }

    if (updateProviderDto.lat !== undefined) {
      updateData.lat = updateProviderDto.lat;
    }

    if (updateProviderDto.lng !== undefined) {
      updateData.lng = updateProviderDto.lng;
    }

    if (updateProviderDto.advancePayType !== undefined) {
      updateData.advancePayType = updateProviderDto.advancePayType;
    }

    if (updateProviderDto.advanceValue !== undefined) {
      updateData.advanceValue = updateProviderDto.advanceValue;
    }

    if (updateProviderDto.hasCancellation !== undefined) {
      updateData.hasCancellation = updateProviderDto.hasCancellation ? 1 : 0;
    }

    if (updateProviderDto.cancellationTime !== undefined) {
      updateData.cancellationTime = updateProviderDto.cancellationTime;
    }

    if (updateProviderDto.capacity !== undefined) {
      updateData.capacity = updateProviderDto.capacity;
    }

    return this.providersRepository.update(providerId, updateData);
  }

  async getProvidersByUserId(userId: bigint): Promise<ServiceProvider[]> {
    return this.providersRepository.findByUserId(userId);
  }

  async deleteProvider(id: string | bigint): Promise<ServiceProvider> {
    const providerId = typeof id === 'string' ? BigInt(id) : id;

    // Check if provider exists
    await this.getProviderById(providerId);

    return this.providersRepository.softDelete(providerId);
  }
}