import { Test, TestingModule } from '@nestjs/testing';
import { ServiceCatalogueService } from './service-catalogue.service';
import { ServiceCatalogueRepository } from './service-catalogue.repository';
import { ProvidersRepository } from '../providers/providers.repository';
import { NotFoundException } from '@nestjs/common';
import { DurationType, Prisma } from '@prisma/client';
import { CreateServiceCatalogueDto } from './dto/create-service-catalogue.dto';
import { UpdateServiceCatalogueDto } from './dto/update-service-catalogue.dto';

describe('ServiceCatalogueService', () => {
  let service: ServiceCatalogueService;
  let serviceCatalogueRepository: jest.Mocked<ServiceCatalogueRepository>;
  let providersRepository: jest.Mocked<ProvidersRepository>;

  const mockProvider = {
    id: BigInt(1),
    userId: BigInt(1),
    serviceTypeId: BigInt(1),
    businessName: 'Test Business',
    isDeleted: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockServiceCatalogue = {
    id: BigInt(1),
    userId: BigInt(1),
    serviceProviderId: BigInt(1),
    title: 'Test Service',
    price: new Prisma.Decimal(50.00),
    duration: 60,
    durationType: DurationType.minute,
    description: 'Test description',
    currency: 'USD',
    isPriceRange: 0,
    rangePrice: null,
    serveCapacity: 1,
    status: 0,
    isDeleted: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: null,
    image: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceCatalogueService,
        {
          provide: ServiceCatalogueRepository,
          useValue: {
            create: jest.fn(),
            findByProviderId: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findPublicServices: jest.fn(),
          },
        },
        {
          provide: ProvidersRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ServiceCatalogueService>(ServiceCatalogueService);
    serviceCatalogueRepository = module.get(ServiceCatalogueRepository);
    providersRepository = module.get(ProvidersRepository);
  });

  describe('createService', () => {
    it('should create a new service successfully', async () => {
      const dto: CreateServiceCatalogueDto = {
        title: 'Test Service',
        price: 50.00,
        duration: 60,
        durationType: DurationType.minute,
        description: 'Test description',
      };

      providersRepository.findById.mockResolvedValue(mockProvider as any);
      serviceCatalogueRepository.create.mockResolvedValue(mockServiceCatalogue as any);

      const result = await service.createService('1', '1', dto);

      expect(providersRepository.findById).toHaveBeenCalledWith(BigInt(1));
      expect(serviceCatalogueRepository.create).toHaveBeenCalled();
      expect(result.id).toBe('1');
      expect(result.title).toBe('Test Service');
      expect(result.price).toBe(50);
    });

    it('should throw NotFoundException when provider does not exist', async () => {
      const dto: CreateServiceCatalogueDto = {
        title: 'Test Service',
        price: 50.00,
        duration: 60,
        durationType: DurationType.minute,
      };

      providersRepository.findById.mockResolvedValue(null);

      await expect(service.createService('1', '1', dto)).rejects.toThrow(
        NotFoundException,
      );
      expect(providersRepository.findById).toHaveBeenCalledWith(BigInt(1));
    });

    it('should handle optional fields correctly', async () => {
      const dto: CreateServiceCatalogueDto = {
        title: 'Test Service',
        price: 50.00,
        duration: 60,
        durationType: DurationType.hour,
        currency: 'EUR',
        isPriceRange: 1,
        rangePrice: 100.00,
        serveCapacity: 5,
      };

      providersRepository.findById.mockResolvedValue(mockProvider as any);
      serviceCatalogueRepository.create.mockResolvedValue({
        ...mockServiceCatalogue,
        currency: 'EUR',
        isPriceRange: 1,
        rangePrice: new Prisma.Decimal(100.00),
        serveCapacity: 5,
      } as any);

      const result = await service.createService('1', '1', dto);

      expect(result.currency).toBe('EUR');
      expect(result.isPriceRange).toBe(1);
      expect(result.rangePrice).toBe(100);
      expect(result.serveCapacity).toBe(5);
    });
  });

  describe('getProviderServices', () => {
    it('should return all services for a provider', async () => {
      const mockServices = [mockServiceCatalogue, { ...mockServiceCatalogue, id: BigInt(2) }];
      serviceCatalogueRepository.findByProviderId.mockResolvedValue(mockServices as any);

      const result = await service.getProviderServices('1');

      expect(serviceCatalogueRepository.findByProviderId).toHaveBeenCalledWith(BigInt(1));
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });

    it('should return empty array when no services found', async () => {
      serviceCatalogueRepository.findByProviderId.mockResolvedValue([]);

      const result = await service.getProviderServices('1');

      expect(result).toEqual([]);
    });
  });

  describe('getServiceById', () => {
    it('should return a service by id', async () => {
      serviceCatalogueRepository.findById.mockResolvedValue(mockServiceCatalogue as any);

      const result = await service.getServiceById('1', '1');

      expect(serviceCatalogueRepository.findById).toHaveBeenCalledWith(BigInt(1));
      expect(result.id).toBe('1');
      expect(result.title).toBe('Test Service');
    });

    it('should throw NotFoundException when service does not exist', async () => {
      serviceCatalogueRepository.findById.mockResolvedValue(null);

      await expect(service.getServiceById('1', '1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when service belongs to different provider', async () => {
      serviceCatalogueRepository.findById.mockResolvedValue({
        ...mockServiceCatalogue,
        serviceProviderId: BigInt(2),
      } as any);

      await expect(service.getServiceById('1', '1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateService', () => {
    it('should update service successfully', async () => {
      const dto: UpdateServiceCatalogueDto = {
        title: 'Updated Service',
        price: 75.00,
      };

      serviceCatalogueRepository.findById.mockResolvedValue(mockServiceCatalogue as any);
      serviceCatalogueRepository.update.mockResolvedValue({
        ...mockServiceCatalogue,
        title: 'Updated Service',
        price: new Prisma.Decimal(75.00),
      } as any);

      const result = await service.updateService('1', '1', dto);

      expect(result.title).toBe('Updated Service');
      expect(result.price).toBe(75);
    });

    it('should throw NotFoundException when service does not exist', async () => {
      const dto: UpdateServiceCatalogueDto = {
        title: 'Updated Service',
      };

      serviceCatalogueRepository.findById.mockResolvedValue(null);

      await expect(service.updateService('1', '1', dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle partial updates correctly', async () => {
      const dto: UpdateServiceCatalogueDto = {
        description: 'New description',
      };

      serviceCatalogueRepository.findById.mockResolvedValue(mockServiceCatalogue as any);
      serviceCatalogueRepository.update.mockResolvedValue({
        ...mockServiceCatalogue,
        description: 'New description',
      } as any);

      const result = await service.updateService('1', '1', dto);

      expect(serviceCatalogueRepository.update).toHaveBeenCalledWith(
        BigInt(1),
        expect.objectContaining({
          description: 'New description',
        }),
      );
      expect(result.description).toBe('New description');
    });
  });

  describe('deleteService', () => {
    it('should soft delete service successfully', async () => {
      serviceCatalogueRepository.findById.mockResolvedValue(mockServiceCatalogue as any);
      serviceCatalogueRepository.delete.mockResolvedValue({
        ...mockServiceCatalogue,
        isDeleted: 1,
      } as any);

      await service.deleteService('1', '1');

      expect(serviceCatalogueRepository.delete).toHaveBeenCalledWith(BigInt(1));
    });

    it('should throw NotFoundException when service does not exist', async () => {
      serviceCatalogueRepository.findById.mockResolvedValue(null);

      await expect(service.deleteService('1', '1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('searchPublicServices', () => {
    const mockProviderWithLocation = {
      id: BigInt(1),
      userId: BigInt(1),
      serviceTypeId: BigInt(1),
      lat: '40.7128',
      lng: '-74.0060',
      geoRadius: 10,
      isDeleted: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      serviceType: {
        id: BigInt(1),
        name: 'Haircut',
        description: 'Professional haircut service',
      },
    };

    it('should return filtered services with keyword', async () => {
      const mockServicesWithProvider = [{
        ...mockServiceCatalogue,
        provider: mockProviderWithLocation,
      }];

      serviceCatalogueRepository.findPublicServices.mockResolvedValue(mockServicesWithProvider as any);

      const result = await service.searchPublicServices({
        keyword: 'test',
      });

      expect(serviceCatalogueRepository.findPublicServices).toHaveBeenCalledWith({
        serviceTypeId: undefined,
        keyword: 'test',
        lat: undefined,
        lng: undefined,
      });
      expect((result[0] as any).provider).toBeDefined();
      expect((result[0] as any).provider.serviceType.name).toBe('Haircut');
    });

    it('should filter services by serviceTypeId', async () => {
      const mockServicesWithProvider = [{
        ...mockServiceCatalogue,
        provider: mockProviderWithLocation,
      }];

      serviceCatalogueRepository.findPublicServices.mockResolvedValue(mockServicesWithProvider as any);

      const result = await service.searchPublicServices({
        serviceTypeId: '1',
      });

      expect(serviceCatalogueRepository.findPublicServices).toHaveBeenCalledWith({
        serviceTypeId: BigInt(1),
        keyword: undefined,
        lat: undefined,
        lng: undefined,
      });
      expect(result).toHaveLength(1);
      expect((result[0] as any).provider.serviceTypeId).toBe('1');
    });

    it('should filter services by location', async () => {
      const mockServicesWithProvider = [{
        ...mockServiceCatalogue,
        provider: mockProviderWithLocation,
        distance: 5.2,
      }];

      serviceCatalogueRepository.findPublicServices.mockResolvedValue(mockServicesWithProvider as any);

      const result = await service.searchPublicServices({
        lat: '40.7328',
        lng: '-74.0160',
      });

      expect(serviceCatalogueRepository.findPublicServices).toHaveBeenCalledWith({
        serviceTypeId: undefined,
        keyword: undefined,
        lat: '40.7328',
        lng: '-74.0160',
      });
      expect((result[0] as any).provider.distance).toBe(5.2);
    });

    it('should combine serviceTypeId and location filters', async () => {
      const mockServicesWithProvider = [{
        ...mockServiceCatalogue,
        provider: mockProviderWithLocation,
        distance: 3.5,
      }];

      serviceCatalogueRepository.findPublicServices.mockResolvedValue(mockServicesWithProvider as any);

      const result = await service.searchPublicServices({
        serviceTypeId: '1',
        lat: '40.7328',
        lng: '-74.0160',
        keyword: 'haircut',
      });

      expect(serviceCatalogueRepository.findPublicServices).toHaveBeenCalledWith({
        serviceTypeId: BigInt(1),
        keyword: 'haircut',
        lat: '40.7328',
        lng: '-74.0160',
      });
      expect(result).toHaveLength(1);
      expect((result[0] as any).provider.serviceTypeId).toBe('1');
      expect((result[0] as any).provider.distance).toBe(3.5);
    });

    it('should return all services when no filters provided', async () => {
      serviceCatalogueRepository.findPublicServices.mockResolvedValue([mockServiceCatalogue] as any);

      const result = await service.searchPublicServices();

      expect(serviceCatalogueRepository.findPublicServices).toHaveBeenCalledWith(undefined);
      expect(result).toHaveLength(1);
    });

    it('should include provider details in response', async () => {
      const mockServicesWithProvider = [{
        ...mockServiceCatalogue,
        provider: mockProviderWithLocation,
      }];

      serviceCatalogueRepository.findPublicServices.mockResolvedValue(mockServicesWithProvider as any);

      const result = await service.searchPublicServices({});

      expect((result[0] as any).provider).toBeDefined();
      expect((result[0] as any).provider.lat).toBe('40.7128');
      expect((result[0] as any).provider.lng).toBe('-74.0060');
      expect((result[0] as any).provider.geoRadius).toBe(10);
      expect((result[0] as any).provider.serviceType).toBeDefined();
    });

    it('should handle services without provider information', async () => {
      const serviceWithoutProvider = {
        ...mockServiceCatalogue,
        provider: undefined,
      };

      serviceCatalogueRepository.findPublicServices.mockResolvedValue([serviceWithoutProvider] as any);

      const result = await service.searchPublicServices({});

      expect((result[0] as any).provider).toBeUndefined();
    });

    it('should handle empty result set', async () => {
      serviceCatalogueRepository.findPublicServices.mockResolvedValue([]);

      const result = await service.searchPublicServices({
        keyword: 'nonexistent',
      });

      expect(result).toEqual([]);
    });

    it('should round distance to 2 decimal places', async () => {
      const mockServicesWithProvider = [{
        ...mockServiceCatalogue,
        provider: mockProviderWithLocation,
        distance: 5.238765,
      }];

      serviceCatalogueRepository.findPublicServices.mockResolvedValue(mockServicesWithProvider as any);

      const result = await service.searchPublicServices({
        lat: '40.7328',
        lng: '-74.0160',
      });

      expect((result[0] as any).provider.distance).toBe(5.24);
    });
  });

  describe('transformServiceForResponse', () => {
    it('should correctly transform Decimal values to numbers', async () => {
      providersRepository.findById.mockResolvedValue(mockProvider as any);
      serviceCatalogueRepository.create.mockResolvedValue({
        ...mockServiceCatalogue,
        price: new Prisma.Decimal(99.99),
        rangePrice: new Prisma.Decimal(199.99),
      } as any);

      const dto: CreateServiceCatalogueDto = {
        title: 'Test Service',
        price: 99.99,
        duration: 60,
        durationType: DurationType.minute,
        rangePrice: 199.99,
        isPriceRange: 1,
      };

      const result = await service.createService('1', '1', dto);

      expect(result.price).toBe(99.99);
      expect(result.rangePrice).toBe(199.99);
    });
  });
});