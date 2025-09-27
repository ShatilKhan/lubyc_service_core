import { Module } from '@nestjs/common';
import { BusinessHoursController } from './business-hours.controller';
import { BusinessHoursService } from './business-hours.service';
import { BusinessHoursRepository } from './business-hours.repository';
import { PrismaService } from '../../core/prisma/prisma.service';

@Module({
  controllers: [BusinessHoursController],
  providers: [BusinessHoursService, BusinessHoursRepository, PrismaService],
  exports: [BusinessHoursService],
})
export class BusinessHoursModule {}