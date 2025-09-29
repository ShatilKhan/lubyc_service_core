import { Controller, Get, Query, ValidationPipe, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ServiceCatalogueService } from './service-catalogue.service';
import { SearchServicesDto } from './dto/search-services.dto';

@ApiTags('Search')
@Controller('api/v1/services/search')
export class SearchController {
  constructor(private readonly serviceCatalogueService: ServiceCatalogueService) {}

  @Get('services')
  @ApiOperation({
    summary: 'Search for services by type and location',
    description: 'Search for service providers by service type ID and/or location coordinates',
  })
  @ApiResponse({
    status: 200,
    description: 'List of services matching the search criteria',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async searchServices(@Query() searchDto: SearchServicesDto) {
    const hasFilters = searchDto.serviceTypeId || searchDto.lat || searchDto.lng || searchDto.keyword;

    return this.serviceCatalogueService.searchPublicServices(
      hasFilters ? searchDto : undefined,
    );
  }
}