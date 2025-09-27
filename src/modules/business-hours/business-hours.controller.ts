import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { BusinessHoursService } from './business-hours.service';
import { CreateBusinessHoursDto } from './dto/create-business-hours.dto';
import { UpdateBusinessHoursDto } from './dto/update-business-hours.dto';
import { BusinessHours } from '@prisma/client';

@Controller('providers/:providerId/business-hours')
export class BusinessHoursController {
  constructor(private readonly businessHoursService: BusinessHoursService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBusinessHours(
    @Param('providerId') providerId: string,
    @Body() createDto: CreateBusinessHoursDto,
  ): Promise<BusinessHours> {
    return this.businessHoursService.createBusinessHours(providerId, createDto);
  }

  @Get()
  async getBusinessHours(@Param('providerId') providerId: string): Promise<BusinessHours[]> {
    return this.businessHoursService.getProviderBusinessHours(providerId);
  }

  @Put(':hoursId')
  async updateBusinessHours(
    @Param('providerId') providerId: string,
    @Param('hoursId') hoursId: string,
    @Body() updateDto: UpdateBusinessHoursDto,
  ): Promise<BusinessHours> {
    return this.businessHoursService.updateBusinessHours(hoursId, updateDto);
  }

  @Delete(':hoursId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBusinessHours(
    @Param('providerId') providerId: string,
    @Param('hoursId') hoursId: string,
  ): Promise<void> {
    await this.businessHoursService.deleteBusinessHours(hoursId);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  async bulkUpsertBusinessHours(
    @Param('providerId') providerId: string,
    @Body() businessHoursList: CreateBusinessHoursDto[],
  ): Promise<BusinessHours[]> {
    return this.businessHoursService.bulkUpsertBusinessHours(providerId, businessHoursList);
  }
}