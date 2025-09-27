import { Controller, Get, Query } from '@nestjs/common';
import { ServiceCatalogueService } from './service-catalogue.service';

@Controller('api/v1/services/search')
export class SearchController {
  constructor(private readonly serviceCatalogueService: ServiceCatalogueService) {}

  @Get('services')
  async searchServices(
    @Query('serviceTypeId') serviceTypeId?: string,
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('keyword') keyword?: string,
  ) {
    const filters = {
      serviceTypeId,
      lat,
      lng,
      keyword,
    };

    return this.serviceCatalogueService.searchPublicServices(
      Object.keys(filters).some(key => filters[key] !== undefined) ? filters : undefined,
    );
  }
}