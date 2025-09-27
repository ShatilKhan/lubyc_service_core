import { Module } from '@nestjs/common';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { ProvidersRepository } from './providers.repository';
import { PrismaService } from '../../core/prisma/prisma.service';

@Module({
  controllers: [ProvidersController],
  providers: [ProvidersService, ProvidersRepository, PrismaService],
  exports: [ProvidersService, ProvidersRepository],
})
export class ProvidersModule {}