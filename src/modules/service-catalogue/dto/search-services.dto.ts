import { IsOptional, IsString, IsNumberString, IsLatitude, IsLongitude, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SearchServicesDto {
  @ApiPropertyOptional({
    description: 'Service type ID to filter by',
    example: '1',
  })
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => value?.toString())
  serviceTypeId?: string;

  @ApiPropertyOptional({
    description: 'Latitude coordinate for location-based search',
    example: '40.7128',
  })
  @IsOptional()
  @IsLatitude()
  lat?: string;

  @ApiPropertyOptional({
    description: 'Longitude coordinate for location-based search',
    example: '-74.0060',
  })
  @IsOptional()
  @IsLongitude()
  lng?: string;

  @ApiPropertyOptional({
    description: 'Keyword for text-based search in service titles and descriptions',
    example: 'cleaning',
  })
  @IsOptional()
  @IsString()
  keyword?: string;
}