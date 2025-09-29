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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DurationType } from '@prisma/client';

export class CreateServiceCatalogueDto {
  @ApiProperty({
    description: 'Service title/name',
    example: 'Premium Haircut',
    maxLength: 255,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Service price',
    example: 50,
    minimum: 0.01,
    type: Number,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Duration of the service',
    example: 45,
    minimum: 1,
    type: Number,
  })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({
    description: 'Unit of duration',
    enum: DurationType,
    example: 'minute',
    type: String,
  })
  @IsEnum(DurationType)
  durationType: DurationType;

  @ApiPropertyOptional({
    description: 'Detailed description of the service',
    example: 'Professional haircut with styling consultation',
    type: String,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'URL or path to service image',
    example: 'https://example.com/haircut.jpg',
    type: String,
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({
    description: 'Currency code',
    example: 'USD',
    default: 'USD',
    maxLength: 10,
    type: String,
  })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  currency?: string;

  @ApiPropertyOptional({
    description: 'Whether the price is a range (0=fixed price, 1=price range)',
    example: 0,
    default: 0,
    type: Number,
  })
  @IsInt()
  @IsOptional()
  isPriceRange?: number;

  @ApiPropertyOptional({
    description: 'Maximum price if price is a range',
    example: 75,
    minimum: 0.01,
    type: Number,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  rangePrice?: number;

  @ApiPropertyOptional({
    description: 'How many customers can be served simultaneously',
    example: 1,
    default: 1,
    minimum: 1,
    type: Number,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  serveCapacity?: number;
}