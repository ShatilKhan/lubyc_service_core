import { PartialType } from '@nestjs/swagger';
import { CreateServiceCatalogueDto } from './create-service-catalogue.dto';

export class UpdateServiceCatalogueDto extends PartialType(CreateServiceCatalogueDto) {}