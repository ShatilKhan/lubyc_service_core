import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { ServiceCatalogueService } from './service-catalogue.service';
import { SearchServicesDto } from './dto/search-services.dto';
import { DurationType } from '@prisma/client';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

describe('SearchController', () => {
  let controller: SearchController;
  let serviceCatalogueService: jest.Mocked<ServiceCatalogueService>;

  const mockServiceWithProvider = {
    id: '1',
    userId: '1',
    serviceProviderId: '1',
    title: 'Test Service',
    price: 50.00,
    duration: 60,
    durationType: DurationType.minute,
    description: 'Test description',
    currency: 'USD',
    isPriceRange: 0,
    rangePrice: null,
    serveCapacity: 1,
    status: 0,
    isDeleted: 0,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    updatedBy: null,
    image: null,
    provider: {
      id: '1',
      serviceTypeId: '1',
      lat: '40.7128',
      lng: '-74.0060',
      geoRadius: 10,
      serviceType: {
        id: '1',
        name: 'Haircut',
        description: 'Professional haircut service',
      },
      distance: 2.5,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: ServiceCatalogueService,
          useValue: {
            searchPublicServices: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    serviceCatalogueService = module.get(ServiceCatalogueService);
  });

  describe('searchServices', () => {
    it('should return services without filters', async () => {
      serviceCatalogueService.searchPublicServices.mockResolvedValue([mockServiceWithProvider]);
      const dto: SearchServicesDto = {};

      const result = await controller.searchServices(dto);

      expect(serviceCatalogueService.searchPublicServices).toHaveBeenCalledWith(undefined);
      expect(result).toEqual([mockServiceWithProvider]);
    });

    it('should search services with keyword filter', async () => {
      serviceCatalogueService.searchPublicServices.mockResolvedValue([mockServiceWithProvider]);
      const dto: SearchServicesDto = { keyword: 'haircut' };

      const result = await controller.searchServices(dto);

      expect(serviceCatalogueService.searchPublicServices).toHaveBeenCalledWith(dto);
      expect(result).toEqual([mockServiceWithProvider]);
    });

    it('should search services with serviceTypeId filter', async () => {
      serviceCatalogueService.searchPublicServices.mockResolvedValue([mockServiceWithProvider]);
      const dto: SearchServicesDto = { serviceTypeId: '1' };

      const result = await controller.searchServices(dto);

      expect(serviceCatalogueService.searchPublicServices).toHaveBeenCalledWith(dto);
      expect(result).toEqual([mockServiceWithProvider]);
    });

    it('should search services with location filters', async () => {
      serviceCatalogueService.searchPublicServices.mockResolvedValue([mockServiceWithProvider]);
      const dto: SearchServicesDto = { lat: '40.7128', lng: '-74.0060' };

      const result = await controller.searchServices(dto);

      expect(serviceCatalogueService.searchPublicServices).toHaveBeenCalledWith(dto);
      expect(result).toEqual([mockServiceWithProvider]);
    });

    it('should search services with all filters', async () => {
      serviceCatalogueService.searchPublicServices.mockResolvedValue([mockServiceWithProvider]);
      const dto: SearchServicesDto = {
        serviceTypeId: '1',
        lat: '40.7128',
        lng: '-74.0060',
        keyword: 'haircut',
      };

      const result = await controller.searchServices(dto);

      expect(serviceCatalogueService.searchPublicServices).toHaveBeenCalledWith(dto);
      expect(result).toEqual([mockServiceWithProvider]);
    });

    it('should return empty array when no services found', async () => {
      serviceCatalogueService.searchPublicServices.mockResolvedValue([]);
      const dto: SearchServicesDto = { keyword: 'nonexistent' };

      const result = await controller.searchServices(dto);

      expect(result).toEqual([]);
    });

    it('should include provider information with service type in results', async () => {
      serviceCatalogueService.searchPublicServices.mockResolvedValue([mockServiceWithProvider]);
      const dto: SearchServicesDto = {};

      const result = await controller.searchServices(dto);

      expect((result[0] as any).provider).toBeDefined();
      expect((result[0] as any).provider.serviceTypeId).toBe('1');
      expect((result[0] as any).provider.lat).toBe('40.7128');
      expect((result[0] as any).provider.lng).toBe('-74.0060');
      expect((result[0] as any).provider.geoRadius).toBe(10);
      expect((result[0] as any).provider.serviceType).toBeDefined();
      expect((result[0] as any).provider.serviceType.name).toBe('Haircut');
    });

    it('should include distance when location search is performed', async () => {
      serviceCatalogueService.searchPublicServices.mockResolvedValue([mockServiceWithProvider]);
      const dto: SearchServicesDto = { lat: '40.7128', lng: '-74.0060' };

      const result = await controller.searchServices(dto);

      expect((result[0] as any).provider.distance).toBe(2.5);
    });

    it('should handle services with price ranges', async () => {
      const serviceWithRange = {
        ...mockServiceWithProvider,
        isPriceRange: 1,
        rangePrice: 100.00,
      };
      serviceCatalogueService.searchPublicServices.mockResolvedValue([serviceWithRange]);
      const dto: SearchServicesDto = {};

      const result = await controller.searchServices(dto);

      expect(result[0].isPriceRange).toBe(1);
      expect(result[0].rangePrice).toBe(100.00);
    });

    it('should handle multiple services in results', async () => {
      const service1 = { ...mockServiceWithProvider };
      const service2 = { ...mockServiceWithProvider, id: '2', title: 'Another Service' };
      const service3 = { ...mockServiceWithProvider, id: '3', title: 'Third Service' };

      serviceCatalogueService.searchPublicServices.mockResolvedValue([service1, service2, service3]);
      const dto: SearchServicesDto = {};

      const result = await controller.searchServices(dto);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
      expect(result[2].id).toBe('3');
    });

    it('should validate latitude is in valid range', async () => {
      const dto: SearchServicesDto = { lat: '91', lng: '-74.0060' };

      const validationPipe = new ValidationPipe({ transform: true, whitelist: true });
      await expect(validationPipe.transform(dto, { type: 'query', metatype: SearchServicesDto }))
        .rejects.toThrow();
    });

    it('should validate longitude is in valid range', async () => {
      const dto: SearchServicesDto = { lat: '40.7128', lng: '181' };

      const validationPipe = new ValidationPipe({ transform: true, whitelist: true });
      await expect(validationPipe.transform(dto, { type: 'query', metatype: SearchServicesDto }))
        .rejects.toThrow();
    });

    it('should accept valid coordinates', async () => {
      const dto: SearchServicesDto = { lat: '40.7128', lng: '-74.0060' };

      const validationPipe = new ValidationPipe({ transform: true, whitelist: true });
      const result = await validationPipe.transform(dto, { type: 'query', metatype: SearchServicesDto });

      expect(result.lat).toBe('40.7128');
      expect(result.lng).toBe('-74.0060');
    });

    it('should validate serviceTypeId is numeric', async () => {
      const dto: SearchServicesDto = { serviceTypeId: 'abc' };

      const validationPipe = new ValidationPipe({ transform: true, whitelist: true });
      await expect(validationPipe.transform(dto, { type: 'query', metatype: SearchServicesDto }))
        .rejects.toThrow();
    });

    it('should handle services without provider information', async () => {
      const serviceWithoutProvider = {
        ...mockServiceWithProvider,
        provider: undefined,
      };
      serviceCatalogueService.searchPublicServices.mockResolvedValue([serviceWithoutProvider]);
      const dto: SearchServicesDto = {};

      const result = await controller.searchServices(dto);

      expect((result[0] as any).provider).toBeUndefined();
    });
  });
});