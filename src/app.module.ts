import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProvidersModule } from './modules/providers/providers.module';
import { BusinessHoursModule } from './modules/business-hours/business-hours.module';
import { ServiceCatalogueModule } from './modules/service-catalogue/service-catalogue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ProvidersModule,
    BusinessHoursModule,
    ServiceCatalogueModule,
  ],
})
export class AppModule {}