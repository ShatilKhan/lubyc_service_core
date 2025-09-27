import { IsNumber, IsOptional, IsString, IsEnum, IsBoolean, IsNotEmpty, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum AdvancePayType {
  AMOUNT = 'amount',
  PERCENT = 'percent',
}

export class CreateProviderDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  serviceTypeId: number;

  @IsOptional()
  @IsString()
  lat?: string;

  @IsOptional()
  @IsString()
  lng?: string;

  @IsOptional()
  @IsEnum(AdvancePayType)
  advancePayType?: AdvancePayType;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  advanceValue?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hasCancellation?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  cancellationTime?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  capacity?: number;

  // These will be handled internally
  userId: bigint;
}