import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ServiceCatalogueService } from './service-catalogue.service';
import { CreateServiceCatalogueDto } from './dto/create-service-catalogue.dto';
import { UpdateServiceCatalogueDto } from './dto/update-service-catalogue.dto';

@ApiTags('Service Catalogue')
@Controller('providers/:providerId/catalogue')
export class ServiceCatalogueController {
  constructor(private readonly serviceCatalogueService: ServiceCatalogueService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create service',
    description: 'Add a new service to provider catalogue',
  })
  @ApiParam({ name: 'providerId', description: 'Service Provider ID' })
  @ApiBody({
    type: CreateServiceCatalogueDto,
    examples: {
      haircut: {
        summary: 'Haircut service',
        value: {
          title: 'Premium Haircut',
          description: 'Professional haircut with styling consultation',
          price: 50,
          duration: 45,
          durationType: 'minute',
          currency: 'USD',
          maxBookingAdvanceDays: 30,
          minBookingNoticeHours: 2,
        },
      },
      massage: {
        summary: 'Massage therapy',
        value: {
          title: 'Deep Tissue Massage',
          description: 'Therapeutic deep tissue massage for muscle relief',
          price: 120,
          duration: 90,
          durationType: 'minute',
          currency: 'USD',
          maxBookingAdvanceDays: 14,
          minBookingNoticeHours: 24,
        },
      },
      consultation: {
        summary: 'Consultation service',
        value: {
          title: 'Initial Consultation',
          description: 'Free consultation to discuss your needs',
          price: 0,
          duration: 30,
          durationType: 'minute',
          currency: 'USD',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Service created successfully',
    schema: {
      example: {
        id: '1',
        serviceProviderId: '1',
        title: 'Premium Haircut',
        description: 'Professional haircut with styling consultation',
        price: 50,
        duration: 45,
        durationType: 'minute',
        currency: 'USD',
        maxBookingAdvanceDays: 30,
        minBookingNoticeHours: 2,
        status: 0,
        createdAt: '2025-01-01T10:00:00.000Z',
        updatedAt: '2025-01-01T10:00:00.000Z',
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
  async create(
    @Param('providerId') providerId: string,
    @Body() dto: CreateServiceCatalogueDto,
  ) {
    const userId = '1';
    return this.serviceCatalogueService.createService(providerId, userId, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List provider services',
    description: 'Get all services offered by a provider',
  })
  @ApiParam({ name: 'providerId', description: 'Service Provider ID' })
  @ApiResponse({
    status: 200,
    description: 'Services retrieved successfully',
    schema: {
      example: [
        {
          id: '1',
          serviceProviderId: '1',
          title: 'Premium Haircut',
          description: 'Professional haircut with styling consultation',
          price: 50,
          duration: 45,
          durationType: 'minute',
          currency: 'USD',
        },
        {
          id: '2',
          serviceProviderId: '1',
          title: 'Beard Trim',
          description: 'Professional beard shaping and trimming',
          price: 25,
          duration: 30,
          durationType: 'minute',
          currency: 'USD',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Service provider not found',
  })
  async findAll(@Param('providerId') providerId: string) {
    return this.serviceCatalogueService.getProviderServices(providerId);
  }

  @Get(':catalogueId')
  @ApiOperation({
    summary: 'Get service details',
    description: 'Get detailed information about a specific service',
  })
  @ApiParam({ name: 'providerId', description: 'Service Provider ID' })
  @ApiParam({ name: 'catalogueId', description: 'Service Catalogue ID' })
  @ApiResponse({
    status: 200,
    description: 'Service details retrieved successfully',
    schema: {
      example: {
        id: '1',
        serviceProviderId: '1',
        title: 'Premium Haircut',
        description: 'Professional haircut with styling consultation',
        price: 50,
        duration: 45,
        durationType: 'minute',
        currency: 'USD',
        maxBookingAdvanceDays: 30,
        minBookingNoticeHours: 2,
        status: 0,
        createdAt: '2025-01-01T10:00:00.000Z',
        updatedAt: '2025-01-01T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found',
  })
  async findOne(
    @Param('providerId') providerId: string,
    @Param('catalogueId') catalogueId: string,
  ) {
    return this.serviceCatalogueService.getServiceById(providerId, catalogueId);
  }

  @Put(':catalogueId')
  @ApiOperation({
    summary: 'Update service',
    description: 'Update service information in provider catalogue',
  })
  @ApiParam({ name: 'providerId', description: 'Service Provider ID' })
  @ApiParam({ name: 'catalogueId', description: 'Service Catalogue ID' })
  @ApiBody({
    type: UpdateServiceCatalogueDto,
    examples: {
      updatePrice: {
        summary: 'Update price',
        value: {
          price: 60,
        },
      },
      updateDuration: {
        summary: 'Update duration',
        value: {
          duration: 60,
          durationType: 'minute',
        },
      },
      updateDetails: {
        summary: 'Update service details',
        value: {
          title: 'Premium Haircut & Styling',
          description: 'Professional haircut with complete styling service',
          price: 75,
        },
      },
      updateBookingRules: {
        summary: 'Update booking rules',
        value: {
          maxBookingAdvanceDays: 60,
          minBookingNoticeHours: 4,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Service updated successfully',
    schema: {
      example: {
        id: '1',
        serviceProviderId: '1',
        title: 'Premium Haircut & Styling',
        description: 'Professional haircut with complete styling service',
        price: 75,
        duration: 60,
        durationType: 'minute',
        currency: 'USD',
        updatedAt: '2025-01-01T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found',
  })
  async update(
    @Param('providerId') providerId: string,
    @Param('catalogueId') catalogueId: string,
    @Body() dto: UpdateServiceCatalogueDto,
  ) {
    return this.serviceCatalogueService.updateService(providerId, catalogueId, dto);
  }

  @Delete(':catalogueId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete service',
    description: 'Remove service from provider catalogue',
  })
  @ApiParam({ name: 'providerId', description: 'Service Provider ID' })
  @ApiParam({ name: 'catalogueId', description: 'Service Catalogue ID' })
  @ApiResponse({
    status: 204,
    description: 'Service deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Service not found',
  })
  async remove(
    @Param('providerId') providerId: string,
    @Param('catalogueId') catalogueId: string,
  ) {
    await this.serviceCatalogueService.deleteService(providerId, catalogueId);
  }
}