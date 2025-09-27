import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ServiceProvider } from '@prisma/client';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProvider(
    @Body() createProviderDto: CreateProviderDto,
    @Request() req?: any,
  ): Promise<ServiceProvider> {
    // For now, using a default userId since auth is disabled
    // In production, this would come from the authenticated user
    const userId = req?.user?.id || BigInt(1);

    return this.providersService.createProvider(createProviderDto, userId);
  }

  @Get(':id')
  async getProvider(@Param('id') id: string): Promise<ServiceProvider> {
    return this.providersService.getProviderById(id);
  }

  @Put(':id')
  async updateProvider(
    @Param('id') id: string,
    @Body() updateProviderDto: UpdateProviderDto,
  ): Promise<ServiceProvider> {
    return this.providersService.updateProvider(id, updateProviderDto);
  }

  @Delete(':id')
  async deleteProvider(@Param('id') id: string): Promise<ServiceProvider> {
    return this.providersService.deleteProvider(id);
  }

  @Get('user/:userId')
  async getProvidersByUser(@Param('userId') userId: string): Promise<ServiceProvider[]> {
    return this.providersService.getProvidersByUserId(BigInt(userId));
  }
}