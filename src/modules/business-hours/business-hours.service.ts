import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BusinessHoursRepository } from './business-hours.repository';
import { CreateBusinessHoursDto } from './dto/create-business-hours.dto';
import { UpdateBusinessHoursDto } from './dto/update-business-hours.dto';
import { BusinessHours } from '@prisma/client';

@Injectable()
export class BusinessHoursService {
  constructor(private readonly businessHoursRepository: BusinessHoursRepository) {}

  async createBusinessHours(
    providerId: string | bigint,
    createDto: CreateBusinessHoursDto,
  ): Promise<BusinessHours> {
    const providerIdBigInt = typeof providerId === 'string' ? BigInt(providerId) : providerId;

    // Check if business hours already exist for this provider and day
    const existing = await this.businessHoursRepository.findByProviderIdAndDay(
      providerIdBigInt,
      createDto.dayOfWeek,
    );

    if (existing && existing.isDeleted === 0) {
      throw new BadRequestException(
        `Business hours already exist for day ${createDto.dayOfWeek}. Use update instead.`,
      );
    }

    // Validate time logic
    if (!createDto.isClosed && createDto.openTime >= createDto.closeTime) {
      throw new BadRequestException('Close time must be after open time');
    }

    const businessHoursData = {
      providerId: providerIdBigInt,
      dayOfWeek: createDto.dayOfWeek,
      openTime: createDto.openTime,
      closeTime: createDto.closeTime,
      isClosed: createDto.isClosed ? 1 : 0,
      status: 1,
      isDeleted: 0,
      provider: {
        connect: { id: providerIdBigInt },
      },
    };

    return this.businessHoursRepository.create(businessHoursData);
  }

  async getProviderBusinessHours(providerId: string | bigint): Promise<BusinessHours[]> {
    const providerIdBigInt = typeof providerId === 'string' ? BigInt(providerId) : providerId;
    return this.businessHoursRepository.findByProviderId(providerIdBigInt);
  }

  async updateBusinessHours(
    id: string | bigint,
    updateDto: UpdateBusinessHoursDto,
  ): Promise<BusinessHours> {
    const hoursId = typeof id === 'string' ? BigInt(id) : id;

    // Check if business hours exist
    const existing = await this.businessHoursRepository.findById(hoursId);
    if (!existing) {
      throw new NotFoundException(`Business hours with ID ${id} not found`);
    }

    // Validate time logic if both times are provided
    if (updateDto.openTime && updateDto.closeTime && !updateDto.isClosed) {
      if (updateDto.openTime >= updateDto.closeTime) {
        throw new BadRequestException('Close time must be after open time');
      }
    }

    const updateData: any = {};

    if (updateDto.dayOfWeek !== undefined) {
      updateData.dayOfWeek = updateDto.dayOfWeek;
    }

    if (updateDto.openTime !== undefined) {
      updateData.openTime = updateDto.openTime;
    }

    if (updateDto.closeTime !== undefined) {
      updateData.closeTime = updateDto.closeTime;
    }

    if (updateDto.isClosed !== undefined) {
      updateData.isClosed = updateDto.isClosed ? 1 : 0;
    }

    return this.businessHoursRepository.update(hoursId, updateData);
  }

  async deleteBusinessHours(id: string | bigint): Promise<BusinessHours> {
    const hoursId = typeof id === 'string' ? BigInt(id) : id;

    // Check if business hours exist
    const existing = await this.businessHoursRepository.findById(hoursId);
    if (!existing) {
      throw new NotFoundException(`Business hours with ID ${id} not found`);
    }

    return this.businessHoursRepository.softDelete(hoursId);
  }

  async isTimeWithinBusinessHours(
    providerId: string | bigint,
    dayOfWeek: number,
    time: string,
  ): Promise<boolean> {
    const providerIdBigInt = typeof providerId === 'string' ? BigInt(providerId) : providerId;

    const businessHours = await this.businessHoursRepository.findByProviderIdAndDay(
      providerIdBigInt,
      dayOfWeek,
    );

    if (!businessHours || businessHours.isClosed === 1) {
      return false;
    }

    return time >= businessHours.openTime && time <= businessHours.closeTime;
  }

  async bulkUpsertBusinessHours(
    providerId: string | bigint,
    businessHoursList: CreateBusinessHoursDto[],
  ): Promise<BusinessHours[]> {
    const providerIdBigInt = typeof providerId === 'string' ? BigInt(providerId) : providerId;
    const results: BusinessHours[] = [];

    for (const hours of businessHoursList) {
      // Validate time logic
      if (!hours.isClosed && hours.openTime >= hours.closeTime) {
        throw new BadRequestException(
          `Close time must be after open time for day ${hours.dayOfWeek}`,
        );
      }

      const businessHoursData = {
        providerId: providerIdBigInt,
        dayOfWeek: hours.dayOfWeek,
        openTime: hours.openTime,
        closeTime: hours.closeTime,
        isClosed: hours.isClosed ? 1 : 0,
        status: 1,
        isDeleted: 0,
        provider: {
          connect: { id: providerIdBigInt },
        },
      };

      const result = await this.businessHoursRepository.upsert(
        providerIdBigInt,
        hours.dayOfWeek,
        businessHoursData,
      );
      results.push(result);
    }

    return results;
  }
}