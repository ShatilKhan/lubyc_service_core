import {
  IsString,
  IsNumber,
  IsInt,
  IsOptional,
  IsEnum,
  IsPositive,
  Min,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { DurationType } from '@prisma/client';

export class CreateServiceCatalogueDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @IsInt()
  @Min(1)
  duration: number;

  @IsEnum(DurationType)
  durationType: DurationType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  currency?: string;

  @IsInt()
  @IsOptional()
  isPriceRange?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  rangePrice?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  serveCapacity?: number;
}