import { IsNumber, IsOptional, IsString, IsEnum, IsBoolean, IsNotEmpty, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AdvancePayType {
  AMOUNT = 'amount',
  PERCENT = 'percent',
}

export class CreateProviderDto {
  @ApiProperty({
    description: 'ID of the service type this provider offers',
    example: 1,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  serviceTypeId: number;

  @ApiPropertyOptional({
    description: 'Latitude coordinate of the provider location',
    example: '40.7128',
  })
  @IsOptional()
  @IsString()
  lat?: string;

  @ApiPropertyOptional({
    description: 'Longitude coordinate of the provider location',
    example: '-74.0060',
  })
  @IsOptional()
  @IsString()
  lng?: string;

  @ApiPropertyOptional({
    description: 'Type of advance payment required',
    enum: AdvancePayType,
    example: AdvancePayType.PERCENT,
    default: AdvancePayType.PERCENT,
  })
  @IsOptional()
  @IsEnum(AdvancePayType)
  advancePayType?: AdvancePayType;

  @ApiPropertyOptional({
    description: 'Value of advance payment (percentage if type is percent, amount if type is amount)',
    example: 25,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  advanceValue?: number;

  @ApiPropertyOptional({
    description: 'Whether the provider allows cancellations',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hasCancellation?: boolean;

  @ApiPropertyOptional({
    description: 'Time window for cancellation in minutes',
    example: 1440,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  cancellationTime?: number;

  @ApiPropertyOptional({
    description: 'Maximum number of concurrent bookings the provider can handle',
    example: 3,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  capacity?: number;

  // These will be handled internally
  userId: bigint;
}