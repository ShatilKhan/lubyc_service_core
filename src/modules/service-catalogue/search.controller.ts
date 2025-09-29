import { Controller, Get, Query, ValidationPipe, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ServiceCatalogueService } from './service-catalogue.service';
import { SearchServicesDto } from './dto/search-services.dto';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly serviceCatalogueService: ServiceCatalogueService) {}

  @Get('services')
  @ApiOperation({
    summary: 'Search services',
    description: 'Search for services by type, location, and keywords. Results are sorted by distance when location is provided.',
  })
  @ApiResponse({
    status: 200,
    description: 'Services matching search criteria',
    schema: {
      example: [
        {
          id: '1',
          title: 'Premium Haircut',
          description: 'Professional haircut with styling',
          price: 50.00,
          duration: 60,
          durationType: 'minute',
          currency: 'USD',
          serviceProviderId: '1',
          provider: {
            id: '1',
            serviceTypeId: '3',
            lat: '40.7128',
            lng: '-74.0060',
            geoRadius: 10,
            distance: 2.5,
            serviceType: {
              id: '3',
              name: 'Hair Salon',
              description: 'Professional hair styling services',
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid search parameters',
    schema: {
      example: {
        statusCode: 400,
        message: ['lat must be a latitude string or number'],
        error: 'Bad Request',
      },
    },
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async searchServices(@Query() searchDto: SearchServicesDto) {
    const hasFilters = searchDto.serviceTypeId || searchDto.lat || searchDto.lng || searchDto.keyword;

    return this.serviceCatalogueService.searchPublicServices(
      hasFilters ? searchDto : undefined,
    );
  }
}