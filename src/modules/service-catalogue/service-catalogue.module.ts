import { Module } from '@nestjs/common';
import { ServiceCatalogueController } from './service-catalogue.controller';
import { ServiceCatalogueService } from './service-catalogue.service';
import { ServiceCatalogueRepository } from './service-catalogue.repository';
import { SearchController } from './search.controller';
import { PrismaService } from '../../core/prisma/prisma.service';
import { ProvidersModule } from '../providers/providers.module';

@Module({
  imports: [ProvidersModule],
  controllers: [ServiceCatalogueController, SearchController],
  providers: [ServiceCatalogueService, ServiceCatalogueRepository, PrismaService],
  exports: [ServiceCatalogueService],
})
export class ServiceCatalogueModule {}