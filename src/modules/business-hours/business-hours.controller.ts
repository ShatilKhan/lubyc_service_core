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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { BusinessHoursService } from './business-hours.service';
import { CreateBusinessHoursDto } from './dto/create-business-hours.dto';
import { UpdateBusinessHoursDto } from './dto/update-business-hours.dto';
import { BusinessHours } from '@prisma/client';

@ApiTags('Business Hours')
@Controller('providers/:providerId/business-hours')
export class BusinessHoursController {
  constructor(private readonly businessHoursService: BusinessHoursService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create business hours',
    description: 'Add business hours for a specific day for a service provider',
  })
  @ApiParam({ name: 'providerId', description: 'Service Provider ID' })
  @ApiBody({
    type: CreateBusinessHoursDto,
    examples: {
      example1: {
        summary: 'Monday business hours',
        value: {
          dayOfWeek: 1,
          openTime: '09:00',
          closeTime: '18:00',
        },
      },
      example2: {
        summary: 'Saturday extended hours',
        value: {
          dayOfWeek: 6,
          openTime: '10:00',
          closeTime: '20:00',
        },
      },
      example3: {
        summary: 'Sunday closed',
        value: {
          dayOfWeek: 0,
          openTime: '00:00',
          closeTime: '00:00',
          isClosed: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Business hours created successfully',
    schema: {
      example: {
        id: '1',
        serviceProviderId: '1',
        dayOfWeek: 1,
        openTime: '09:00',
        closeTime: '18:00',
        breakStartTime: null,
        breakEndTime: null,
        isOpen: true,
        createdAt: '2025-01-01T09:00:00.000Z',
        updatedAt: '2025-01-01T09:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Service provider not found',
  })
  async createBusinessHours(
    @Param('providerId') providerId: string,
    @Body() createDto: CreateBusinessHoursDto,
  ): Promise<BusinessHours> {
    return this.businessHoursService.createBusinessHours(providerId, createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get provider business hours',
    description: 'Retrieve all business hours for a specific service provider',
  })
  @ApiParam({ name: 'providerId', description: 'Service Provider ID' })
  @ApiResponse({
    status: 200,
    description: 'Business hours retrieved successfully',
    schema: {
      example: [
        {
          id: '1',
          serviceProviderId: '1',
          dayOfWeek: 1,
          openTime: '09:00',
          closeTime: '18:00',
          breakStartTime: null,
          breakEndTime: null,
          isOpen: true,
        },
        {
          id: '2',
          serviceProviderId: '1',
          dayOfWeek: 2,
          openTime: '09:00',
          closeTime: '18:00',
          breakStartTime: '12:00',
          breakEndTime: '13:00',
          isOpen: true,
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Service provider not found',
  })
  async getBusinessHours(@Param('providerId') providerId: string): Promise<BusinessHours[]> {
    return this.businessHoursService.getProviderBusinessHours(providerId);
  }

  @Put(':hoursId')
  @ApiOperation({
    summary: 'Update business hours',
    description: 'Update specific business hours entry for a service provider',
  })
  @ApiParam({ name: 'providerId', description: 'Service Provider ID' })
  @ApiParam({ name: 'hoursId', description: 'Business Hours ID' })
  @ApiBody({
    type: UpdateBusinessHoursDto,
    examples: {
      example1: {
        summary: 'Update opening hours',
        value: {
          openTime: '08:00',
          closeTime: '20:00',
        },
      },
      example2: {
        summary: 'Add break time',
        value: {
          breakStartTime: '12:30',
          breakEndTime: '13:30',
        },
      },
      example3: {
        summary: 'Mark as closed',
        value: {
          isOpen: false,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Business hours updated successfully',
    schema: {
      example: {
        id: '1',
        serviceProviderId: '1',
        dayOfWeek: 1,
        openTime: '08:00',
        closeTime: '20:00',
        breakStartTime: null,
        breakEndTime: null,
        isOpen: true,
        updatedAt: '2025-01-01T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Business hours not found',
  })
  async updateBusinessHours(
    @Param('providerId') providerId: string,
    @Param('hoursId') hoursId: string,
    @Body() updateDto: UpdateBusinessHoursDto,
  ): Promise<BusinessHours> {
    return this.businessHoursService.updateBusinessHours(hoursId, updateDto);
  }

  @Delete(':hoursId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete business hours',
    description: 'Remove specific business hours entry for a service provider',
  })
  @ApiParam({ name: 'providerId', description: 'Service Provider ID' })
  @ApiParam({ name: 'hoursId', description: 'Business Hours ID' })
  @ApiResponse({
    status: 204,
    description: 'Business hours deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Business hours not found',
  })
  async deleteBusinessHours(
    @Param('providerId') providerId: string,
    @Param('hoursId') hoursId: string,
  ): Promise<void> {
    await this.businessHoursService.deleteBusinessHours(hoursId);
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Bulk create/update business hours',
    description: 'Create or update multiple business hours entries at once for a service provider',
  })
  @ApiParam({ name: 'providerId', description: 'Service Provider ID' })
  @ApiBody({
    type: [CreateBusinessHoursDto],
    examples: {
      weekdays: {
        summary: 'Full week schedule',
        value: [
          { dayOfWeek: 1, openTime: '09:00', closeTime: '18:00' },
          { dayOfWeek: 2, openTime: '09:00', closeTime: '18:00' },
          { dayOfWeek: 3, openTime: '09:00', closeTime: '18:00' },
          { dayOfWeek: 4, openTime: '09:00', closeTime: '18:00' },
          { dayOfWeek: 5, openTime: '09:00', closeTime: '17:00' },
          { dayOfWeek: 6, openTime: '10:00', closeTime: '14:00' },
          { dayOfWeek: 0, openTime: '00:00', closeTime: '00:00', isClosed: true },
        ],
      },
      withVariedSchedule: {
        summary: 'Varied schedule per day',
        value: [
          {
            dayOfWeek: 1,
            openTime: '08:00',
            closeTime: '20:00',
          },
          {
            dayOfWeek: 2,
            openTime: '08:00',
            closeTime: '20:00',
          },
          {
            dayOfWeek: 3,
            openTime: '10:00',
            closeTime: '18:00',
          },
          {
            dayOfWeek: 4,
            openTime: '08:00',
            closeTime: '20:00',
          },
          {
            dayOfWeek: 5,
            openTime: '08:00',
            closeTime: '22:00',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Business hours created/updated successfully',
    schema: {
      example: [
        {
          id: '1',
          serviceProviderId: '1',
          dayOfWeek: 1,
          openTime: '09:00',
          closeTime: '18:00',
          isOpen: true,
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async bulkUpsertBusinessHours(
    @Param('providerId') providerId: string,
    @Body() businessHoursList: CreateBusinessHoursDto[],
  ): Promise<BusinessHours[]> {
    return this.businessHoursService.bulkUpsertBusinessHours(providerId, businessHoursList);
  }
}