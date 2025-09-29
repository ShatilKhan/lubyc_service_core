import { IsOptional, IsString, IsNumberString, IsLatitude, IsLongitude, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SearchServicesDto {
  @ApiPropertyOptional({
    description: 'Service type ID to filter by (e.g., 1=Barber, 2=Spa, 3=Hair Salon)',
    example: '3',
    examples: {
      barber: { value: '1', summary: 'Barber services' },
      spa: { value: '2', summary: 'Spa services' },
      salon: { value: '3', summary: 'Hair salon services' },
    },
  })
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => value?.toString())
  serviceTypeId?: string;

  @ApiPropertyOptional({
    description: 'Latitude coordinate for location-based search. Results will be filtered by provider geoRadius and sorted by distance.',
    example: '40.7128',
    minimum: -90,
    maximum: 90,
  })
  @IsOptional()
  @IsLatitude()
  lat?: string;

  @ApiPropertyOptional({
    description: 'Longitude coordinate for location-based search. Must be used together with lat parameter.',
    example: '-74.0060',
    minimum: -180,
    maximum: 180,
  })
  @IsOptional()
  @IsLongitude()
  lng?: string;

  @ApiPropertyOptional({
    description: 'Keyword for text-based search in service titles and descriptions. Case-insensitive partial matching.',
    example: 'premium',
    examples: {
      haircut: { value: 'haircut', summary: 'Search for haircut services' },
      premium: { value: 'premium', summary: 'Search for premium services' },
      styling: { value: 'styling', summary: 'Search for styling services' },
    },
  })
  @IsOptional()
  @IsString()
  keyword?: string;
}