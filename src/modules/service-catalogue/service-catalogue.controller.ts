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
import { ServiceCatalogueService } from './service-catalogue.service';
import { CreateServiceCatalogueDto } from './dto/create-service-catalogue.dto';
import { UpdateServiceCatalogueDto } from './dto/update-service-catalogue.dto';

@Controller('api/v1/services/providers/:providerId/catalogue')
export class ServiceCatalogueController {
  constructor(private readonly serviceCatalogueService: ServiceCatalogueService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('providerId') providerId: string,
    @Body() dto: CreateServiceCatalogueDto,
  ) {
    const userId = '1';
    return this.serviceCatalogueService.createService(providerId, userId, dto);
  }

  @Get()
  async findAll(@Param('providerId') providerId: string) {
    return this.serviceCatalogueService.getProviderServices(providerId);
  }

  @Get(':catalogueId')
  async findOne(
    @Param('providerId') providerId: string,
    @Param('catalogueId') catalogueId: string,
  ) {
    return this.serviceCatalogueService.getServiceById(providerId, catalogueId);
  }

  @Put(':catalogueId')
  async update(
    @Param('providerId') providerId: string,
    @Param('catalogueId') catalogueId: string,
    @Body() dto: UpdateServiceCatalogueDto,
  ) {
    return this.serviceCatalogueService.updateService(providerId, catalogueId, dto);
  }

  @Delete(':catalogueId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('providerId') providerId: string,
    @Param('catalogueId') catalogueId: string,
  ) {
    await this.serviceCatalogueService.deleteService(providerId, catalogueId);
  }
}