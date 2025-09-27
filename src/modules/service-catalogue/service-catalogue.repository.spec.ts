import { Test, TestingModule } from '@nestjs/testing';
import { ServiceCatalogueRepository } from './service-catalogue.repository';
import { PrismaService } from '../../core/prisma/prisma.service';
import { DurationType, Prisma } from '@prisma/client';

describe('ServiceCatalogueRepository', () => {
  let repository: ServiceCatalogueRepository;
  let prismaService: jest.Mocked<PrismaService>;

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

  const mockProvider = {
    id: BigInt(1),
    userId: BigInt(1),
    serviceTypeId: BigInt(1),
    businessName: 'Test Business',
    latitude: new Prisma.Decimal(40.7128),
    longitude: new Prisma.Decimal(-74.0060),
    isDeleted: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceCatalogueRepository,
        {
          provide: PrismaService,
          useValue: {
            serviceCatalogue: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<ServiceCatalogueRepository>(ServiceCatalogueRepository);
    prismaService = module.get(PrismaService);
  });

  describe('create', () => {
    it('should create a new service catalogue entry', async () => {
      const createData = {
        provider: {
          connect: { id: BigInt(1) },
        },
        userId: BigInt(1),
        title: 'Test Service',
        price: new Prisma.Decimal(50.00),
        duration: 60,
        durationType: DurationType.minute,
      } as Prisma.ServiceCatalogueCreateInput;

      (prismaService.serviceCatalogue.create as jest.Mock).mockResolvedValue(mockServiceCatalogue);

      const result = await repository.create(createData);

      expect(prismaService.serviceCatalogue.create).toHaveBeenCalledWith({
        data: createData,
      });
      expect(result).toEqual(mockServiceCatalogue);
    });
  });

  describe('findByProviderId', () => {
    it('should return all services for a provider', async () => {
      const mockServices = [mockServiceCatalogue, { ...mockServiceCatalogue, id: BigInt(2) }];
      (prismaService.serviceCatalogue.findMany as jest.Mock).mockResolvedValue(mockServices);

      const result = await repository.findByProviderId(BigInt(1));

      expect(prismaService.serviceCatalogue.findMany).toHaveBeenCalledWith({
        where: {
          serviceProviderId: BigInt(1),
          isDeleted: 0,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result).toEqual(mockServices);
    });

    it('should return empty array when no services found', async () => {
      (prismaService.serviceCatalogue.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repository.findByProviderId(BigInt(1));

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a service by id', async () => {
      (prismaService.serviceCatalogue.findFirst as jest.Mock).mockResolvedValue(mockServiceCatalogue);

      const result = await repository.findById(BigInt(1));

      expect(prismaService.serviceCatalogue.findFirst).toHaveBeenCalledWith({
        where: {
          id: BigInt(1),
          isDeleted: 0,
        },
      });
      expect(result).toEqual(mockServiceCatalogue);
    });

    it('should return null when service not found', async () => {
      (prismaService.serviceCatalogue.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById(BigInt(999));

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a service catalogue entry', async () => {
      const updateData = {
        title: 'Updated Service',
        price: new Prisma.Decimal(75.00),
      };

      const updatedService = {
        ...mockServiceCatalogue,
        ...updateData,
      };

      (prismaService.serviceCatalogue.update as jest.Mock).mockResolvedValue(updatedService);

      const result = await repository.update(BigInt(1), updateData);

      expect(prismaService.serviceCatalogue.update).toHaveBeenCalledWith({
        where: { id: BigInt(1) },
        data: updateData,
      });
      expect(result).toEqual(updatedService);
    });
  });

  describe('delete', () => {
    it('should soft delete a service', async () => {
      const deletedService = {
        ...mockServiceCatalogue,
        isDeleted: 1,
        updatedBy: BigInt(1),
      };

      (prismaService.serviceCatalogue.update as jest.Mock).mockResolvedValue(deletedService);

      const result = await repository.delete(BigInt(1), BigInt(1));

      expect(prismaService.serviceCatalogue.update).toHaveBeenCalledWith({
        where: { id: BigInt(1) },
        data: {
          isDeleted: 1,
          updatedBy: BigInt(1),
        },
      });
      expect(result.isDeleted).toBe(1);
    });

    it('should soft delete without updatedBy', async () => {
      const deletedService = {
        ...mockServiceCatalogue,
        isDeleted: 1,
      };

      (prismaService.serviceCatalogue.update as jest.Mock).mockResolvedValue(deletedService);

      const result = await repository.delete(BigInt(1));

      expect(prismaService.serviceCatalogue.update).toHaveBeenCalledWith({
        where: { id: BigInt(1) },
        data: {
          isDeleted: 1,
          updatedBy: undefined,
        },
      });
      expect(result.isDeleted).toBe(1);
    });
  });

  describe('findPublicServices', () => {
    it('should return all public services without filters', async () => {
      const mockServices = [
        { ...mockServiceCatalogue, provider: mockProvider },
      ];

      (prismaService.serviceCatalogue.findMany as jest.Mock).mockResolvedValue(mockServices);

      const result = await repository.findPublicServices();

      expect(prismaService.serviceCatalogue.findMany).toHaveBeenCalledWith({
        where: {
          isDeleted: 0,
        },
        include: {
          provider: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result).toEqual(mockServices);
    });

    it('should filter by keyword in title', async () => {
      const mockServices = [
        { ...mockServiceCatalogue, provider: mockProvider },
      ];

      (prismaService.serviceCatalogue.findMany as jest.Mock).mockResolvedValue(mockServices);

      const result = await repository.findPublicServices({
        keyword: 'test',
      });

      expect(prismaService.serviceCatalogue.findMany).toHaveBeenCalledWith({
        where: {
          isDeleted: 0,
          OR: [
            { title: { contains: 'test', mode: 'insensitive' } },
            { description: { contains: 'test', mode: 'insensitive' } },
          ],
        },
        include: {
          provider: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result).toEqual(mockServices);
    });

    it('should handle multiple filters', async () => {
      const mockServices = [];

      (prismaService.serviceCatalogue.findMany as jest.Mock).mockResolvedValue(mockServices);

      const result = await repository.findPublicServices({
        serviceTypeId: 1,
        keyword: 'haircut',
        lat: '40.7128',
        lng: '-74.0060',
      });

      expect(prismaService.serviceCatalogue.findMany).toHaveBeenCalledWith({
        where: {
          isDeleted: 0,
          OR: [
            { title: { contains: 'haircut', mode: 'insensitive' } },
            { description: { contains: 'haircut', mode: 'insensitive' } },
          ],
        },
        include: {
          provider: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result).toEqual(mockServices);
    });
  });

  describe('Decimal handling', () => {
    it('should correctly handle Decimal values in create', async () => {
      const createData = {
        provider: {
          connect: { id: BigInt(1) },
        },
        userId: BigInt(1),
        title: 'Test Service',
        price: new Prisma.Decimal(99.99),
        rangePrice: new Prisma.Decimal(199.99),
        duration: 60,
        durationType: DurationType.minute,
      } as Prisma.ServiceCatalogueCreateInput;

      const expectedService = {
        ...mockServiceCatalogue,
        price: new Prisma.Decimal(99.99),
        rangePrice: new Prisma.Decimal(199.99),
      };

      (prismaService.serviceCatalogue.create as jest.Mock).mockResolvedValue(expectedService);

      const result = await repository.create(createData);

      expect(result.price).toEqual(new Prisma.Decimal(99.99));
      expect(result.rangePrice).toEqual(new Prisma.Decimal(199.99));
    });
  });
});