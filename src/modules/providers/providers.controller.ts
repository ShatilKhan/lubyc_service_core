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
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ServiceProvider } from '@prisma/client';

@ApiTags('Providers')
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new service provider',
    description: 'Creates a new service provider profile with business location and settings',
  })
  @ApiBody({
    type: CreateProviderDto,
    description: 'Provider creation data',
    examples: {
      minimal: {
        summary: 'Minimal required fields',
        description: 'Only the required serviceTypeId field',
        value: {
          serviceTypeId: 1,
        },
      },
      basic: {
        summary: 'Basic provider with location',
        description: 'Provider with service type and location coordinates',
        value: {
          serviceTypeId: 3,
          lat: '40.7128',
          lng: '-74.0060',
        },
      },
      comprehensive: {
        summary: 'Comprehensive provider setup',
        description: 'All optional fields populated with business rules',
        value: {
          serviceTypeId: 3,
          lat: '40.7128',
          lng: '-74.0060',
          advancePayType: 'percent',
          advanceValue: 25,
          hasCancellation: true,
          cancellationTime: 1440,
          capacity: 3,
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Provider created successfully',
    schema: {
      example: {
        id: '1',
        userId: '1',
        companyId: null,
        serviceTypeId: '3',
        lat: '40.7128',
        lng: '-74.0060',
        geoRadius: 10,
        advancePay: 0,
        advancePayType: 'percent',
        advanceValue: 25,
        hasCancellation: 1,
        cancellationTime: 1440,
        capacity: 3,
        logo: null,
        status: 0,
        createdAt: '2025-09-29T10:00:00.000Z',
        updatedAt: '2025-09-29T10:00:00.000Z',
        updatedBy: null,
        isDeleted: 0,
        serviceType: {
          id: '3',
          name: 'Hair Salon',
          description: 'Professional hair styling and treatment services',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      example: {
        statusCode: 400,
        message: ['serviceTypeId must be a positive number'],
        error: 'Bad Request',
      },
    },
  })
  async createProvider(
    @Body() createProviderDto: CreateProviderDto,
    @Request() req?: any,
  ): Promise<ServiceProvider> {
    // For now, using a default userId since auth is disabled
    // In production, this would come from the authenticated user
    const userId = req?.user?.id || BigInt(1);

    return this.providersService.createProvider(createProviderDto, userId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a provider by ID',
    description: 'Retrieves a service provider profile including service type information',
  })
  @ApiParam({
    name: 'id',
    description: 'Provider ID',
    example: '1',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Provider found',
    schema: {
      example: {
        id: '1',
        userId: '1',
        serviceTypeId: '3',
        lat: '40.7128',
        lng: '-74.0060',
        geoRadius: 10,
        advancePay: 0,
        advancePayType: 'percent',
        advanceValue: 25,
        hasCancellation: 1,
        cancellationTime: 1440,
        capacity: 3,
        status: 0,
        createdAt: '2025-09-29T10:00:00.000Z',
        updatedAt: '2025-09-29T10:00:00.000Z',
        serviceType: {
          id: '3',
          name: 'Hair Salon',
          description: 'Professional hair styling services',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Provider not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Provider not found',
        error: 'Not Found',
      },
    },
  })
  async getProvider(@Param('id') id: string): Promise<ServiceProvider> {
    return this.providersService.getProviderById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a provider',
    description: 'Updates provider information including location and business settings',
  })
  @ApiParam({
    name: 'id',
    description: 'Provider ID',
    example: '1',
    type: String,
  })
  @ApiBody({
    type: UpdateProviderDto,
    description: 'Provider update data',
    examples: {
      updateLocation: {
        summary: 'Update location only',
        value: {
          lat: '40.7580',
          lng: '-73.9855',
        },
      },
      updateSettings: {
        summary: 'Update business settings',
        value: {
          advancePayType: 'amount',
          advanceValue: 50,
          hasCancellation: true,
          cancellationTime: 2880,
          capacity: 5,
        },
      },
      updateAll: {
        summary: 'Update all fields',
        value: {
          serviceTypeId: 2,
          lat: '40.7580',
          lng: '-73.9855',
          advancePayType: 'amount',
          advanceValue: 50,
          hasCancellation: false,
          capacity: 5,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Provider updated successfully',
    schema: {
      example: {
        id: '1',
        userId: '1',
        serviceTypeId: '2',
        lat: '40.7580',
        lng: '-73.9855',
        geoRadius: 10,
        advancePay: 0,
        advancePayType: 'amount',
        advanceValue: 50,
        hasCancellation: 0,
        cancellationTime: null,
        capacity: 5,
        status: 0,
        createdAt: '2025-09-29T10:00:00.000Z',
        updatedAt: '2025-09-29T11:00:00.000Z',
        updatedBy: '1',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Provider not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid update data',
  })
  async updateProvider(
    @Param('id') id: string,
    @Body() updateProviderDto: UpdateProviderDto,
  ): Promise<ServiceProvider> {
    return this.providersService.updateProvider(id, updateProviderDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a provider',
    description: 'Soft deletes a service provider (marks as deleted)',
  })
  @ApiParam({
    name: 'id',
    description: 'Provider ID',
    example: '1',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Provider deleted successfully',
    schema: {
      example: {
        id: '1',
        isDeleted: 1,
        updatedAt: '2025-09-29T11:00:00.000Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Provider not found',
  })
  async deleteProvider(@Param('id') id: string): Promise<ServiceProvider> {
    return this.providersService.deleteProvider(id);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get providers by user ID',
    description: 'Retrieves all service providers belonging to a specific user',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '1',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'List of providers',
    schema: {
      example: [
        {
          id: '1',
          userId: '1',
          serviceTypeId: '3',
          lat: '40.7128',
          lng: '-74.0060',
          capacity: 3,
          serviceType: {
            id: '3',
            name: 'Hair Salon',
          },
        },
        {
          id: '2',
          userId: '1',
          serviceTypeId: '1',
          lat: '40.7580',
          lng: '-73.9855',
          capacity: 1,
          serviceType: {
            id: '1',
            name: 'Barber Shop',
          },
        },
      ],
    },
  })
  async getProvidersByUser(@Param('userId') userId: string): Promise<ServiceProvider[]> {
    return this.providersService.getProvidersByUserId(BigInt(userId));
  }
}