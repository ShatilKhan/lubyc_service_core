import { IsNumber, IsString, IsOptional, IsBoolean, Min, Max, Matches, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBusinessHoursDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(6)
  dayOfWeek: number; // 0=Sunday, 6=Saturday

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'openTime must be in HH:MM format',
  })
  openTime: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'closeTime must be in HH:MM format',
  })
  closeTime: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isClosed?: boolean;
}