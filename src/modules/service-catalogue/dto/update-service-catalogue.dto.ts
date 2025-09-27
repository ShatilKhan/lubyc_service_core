import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceCatalogueDto } from './create-service-catalogue.dto';

export class UpdateServiceCatalogueDto extends PartialType(CreateServiceCatalogueDto) {}