import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { ServiceCatalogueService } from './service-catalogue.service';
import { DurationType, Prisma } from '@prisma/client';

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
      businessName: 'Test Business',
      latitude: '40.7128',
      longitude: '-74.0060',
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

      const result = await controller.searchServices();

      expect(serviceCatalogueService.searchPublicServices).toHaveBeenCalledWith(undefined);
      expect(result).toEqual([mockServiceWithProvider]);
    });

    it('should search services with keyword filter', async () => {
      serviceCatalogueService.searchPublicServices.mockResolvedValue([mockServiceWithProvider]);

      const result = await controller.searchServices(undefined, undefined, undefined, 'haircut');

      expect(serviceCatalogueService.searchPublicServices).toHaveBeenCalledWith({
        serviceTypeId: undefined,
        lat: undefined,
        lng: undefined,
        keyword: 'haircut',
      });
      expect(result).toEqual([mockServiceWithProvider]);
    });

    it('should search services with serviceTypeId filter', async () => {
      serviceCatalogueService.searchPublicServices.mockResolvedValue([mockServiceWithProvider]);

      const result = await controller.searchServices('1', undefined, undefined, undefined);

      expect(serviceCatalogueService.searchPublicServices).toHaveBeenCalledWith({
        serviceTypeId: '1',
        lat: undefined,
        lng: undefined,
        keyword: undefined,
      });
      expect(result).toEqual([mockServiceWithProvider]);
    });

    it('should search services with location filters', async () => {
      serviceCatalogueService.searchPublicServices.mockResolvedValue([mockServiceWithProvider]);

      const result = await controller.searchServices(undefined, '40.7128', '-74.0060', undefined);

      expect(serviceCatalogueService.searchPublicServices).toHaveBeenCalledWith({
        serviceTypeId: undefined,
        lat: '40.7128',
        lng: '-74.0060',
        keyword: undefined,
      });
      expect(result).toEqual([mockServiceWithProvider]);
    });

    it('should search services with all filters', async () => {
      serviceCatalogueService.searchPublicServices.mockResolvedValue([mockServiceWithProvider]);

      const result = await controller.searchServices('1', '40.7128', '-74.0060', 'haircut');

      expect(serviceCatalogueService.searchPublicServices).toHaveBeenCalledWith({
        serviceTypeId: '1',
        lat: '40.7128',
        lng: '-74.0060',
        keyword: 'haircut',
      });
      expect(result).toEqual([mockServiceWithProvider]);
    });

    it('should return empty array when no services found', async () => {
      serviceCatalogueService.searchPublicServices.mockResolvedValue([]);

      const result = await controller.searchServices(undefined, undefined, undefined, 'nonexistent');

      expect(result).toEqual([]);
    });

    it('should filter out deleted services', async () => {
      const activeService = { ...mockServiceWithProvider, isDeleted: 0 };
      serviceCatalogueService.searchPublicServices.mockResolvedValue([activeService]);

      const result = await controller.searchServices();

      expect(result).toEqual([activeService]);
      expect(result[0].isDeleted).toBe(0);
    });

    it('should handle services with price ranges', async () => {
      const serviceWithRange = {
        ...mockServiceWithProvider,
        isPriceRange: 1,
        rangePrice: 100.00,
      };
      serviceCatalogueService.searchPublicServices.mockResolvedValue([serviceWithRange]);

      const result = await controller.searchServices();

      expect(result[0].isPriceRange).toBe(1);
      expect(result[0].rangePrice).toBe(100.00);
    });

    it('should include provider information in results', async () => {
      serviceCatalogueService.searchPublicServices.mockResolvedValue([mockServiceWithProvider]);

      const result = await controller.searchServices();

      expect(result[0].provider).toBeDefined();
      expect(result[0].provider.businessName).toBe('Test Business');
      expect(result[0].provider.latitude).toBe('40.7128');
      expect(result[0].provider.longitude).toBe('-74.0060');
    });

    it('should handle multiple services in results', async () => {
      const service1 = { ...mockServiceWithProvider };
      const service2 = { ...mockServiceWithProvider, id: '2', title: 'Another Service' };
      const service3 = { ...mockServiceWithProvider, id: '3', title: 'Third Service' };

      serviceCatalogueService.searchPublicServices.mockResolvedValue([service1, service2, service3]);

      const result = await controller.searchServices();

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
      expect(result[2].id).toBe('3');
    });
  });
});