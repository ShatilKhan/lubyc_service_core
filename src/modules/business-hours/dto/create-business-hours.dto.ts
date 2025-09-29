import { IsNumber, IsString, IsOptional, IsBoolean, Min, Max, Matches, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBusinessHoursDto {
  @ApiProperty({
    description: 'Day of the week (0=Sunday, 1=Monday, ..., 6=Saturday)',
    example: 1,
    minimum: 0,
    maximum: 6,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({
    description: 'Opening time in HH:MM format (24-hour)',
    example: '09:00',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'openTime must be in HH:MM format',
  })
  openTime: string;

  @ApiProperty({
    description: 'Closing time in HH:MM format (24-hour)',
    example: '18:00',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'closeTime must be in HH:MM format',
  })
  closeTime: string;

  @ApiPropertyOptional({
    description: 'Indicates if the business is closed on this day',
    example: false,
    default: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isClosed?: boolean;
}