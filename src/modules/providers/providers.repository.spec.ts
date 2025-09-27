import { Test, TestingModule } from '@nestjs/testing';
import { ProvidersRepository } from './providers.repository';
import { PrismaService } from '../../core/prisma/prisma.service';

describe('ProvidersRepository', () => {
  let repository: ProvidersRepository;
  let prismaService: PrismaService;

  const mockPrismaService = {
    serviceProvider: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    serviceType: {
      findUnique: jest.fn(),
    },
  };

  const mockProvider = {
    id: BigInt(1),
    userId: BigInt(1),
    serviceTypeId: BigInt(1),
    companyId: null,
    lat: '23.8103',
    lng: '90.4125',
    geoRadius: 10,
    advancePay: 0,
    advancePayType: 'percent' as const,
    advanceValue: 20,
    hasCancellation: 1,
    cancellationTime: 1440,
    logo: null,
    status: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: null,
    isDeleted: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvidersRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<ProvidersRepository>(ProvidersRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new provider', async () => {
      // Arrange
      const createData = {
        userId: BigInt(1),
        serviceTypeId: BigInt(1),
        lat: '23.8103',
        lng: '90.4125',
        status: 0,
        isDeleted: 0,
        advancePay: 0,
        advancePayType: 'percent' as const,
        serviceType: {
          connect: { id: BigInt(1) },
        },
      };

      mockPrismaService.serviceProvider.create.mockResolvedValue({
        ...mockProvider,
        serviceType: {
          id: BigInt(1),
          name: 'Test Service',
          userId: BigInt(1),
          description: null,
          icon: null,
          status: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          updatedBy: null,
          isDeleted: 0,
        },
      });

      // Act
      const result = await repository.create(createData);

      // Assert
      expect(result).toBeDefined();
      expect(mockPrismaService.serviceProvider.create).toHaveBeenCalledWith({
        data: createData,
        include: {
          serviceType: true,
        },
      });
    });
  });

  describe('findById', () => {
    it('should find a provider by id', async () => {
      // Arrange
      mockPrismaService.serviceProvider.findUnique.mockResolvedValue(mockProvider);

      // Act
      const result = await repository.findById(BigInt(1));

      // Assert
      expect(result).toEqual(mockProvider);
      expect(mockPrismaService.serviceProvider.findUnique).toHaveBeenCalledWith({
        where: {
          id: BigInt(1),
          isDeleted: 0,
        },
        include: {
          serviceType: true,
        },
      });
    });

    it('should return null when provider not found', async () => {
      // Arrange
      mockPrismaService.serviceProvider.findUnique.mockResolvedValue(null);

      // Act
      const result = await repository.findById(BigInt(999));

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should find all providers for a user', async () => {
      // Arrange
      const providers = [mockProvider];
      mockPrismaService.serviceProvider.findMany.mockResolvedValue(providers);

      // Act
      const result = await repository.findByUserId(BigInt(1));

      // Assert
      expect(result).toEqual(providers);
      expect(mockPrismaService.serviceProvider.findMany).toHaveBeenCalledWith({
        where: {
          userId: BigInt(1),
          isDeleted: 0,
        },
        include: {
          serviceType: true,
        },
      });
    });
  });

  describe('update', () => {
    it('should update a provider', async () => {
      // Arrange
      const updateData = { lat: '23.8200', lng: '90.4200' };
      const updatedProvider = { ...mockProvider, ...updateData };
      mockPrismaService.serviceProvider.update.mockResolvedValue(updatedProvider);

      // Act
      const result = await repository.update(BigInt(1), updateData);

      // Assert
      expect(result).toEqual(updatedProvider);
      expect(mockPrismaService.serviceProvider.update).toHaveBeenCalledWith({
        where: { id: BigInt(1) },
        data: updateData,
        include: {
          serviceType: true,
        },
      });
    });
  });

  describe('softDelete', () => {
    it('should soft delete a provider', async () => {
      // Arrange
      const deletedProvider = { ...mockProvider, isDeleted: 1 };
      mockPrismaService.serviceProvider.update.mockResolvedValue(deletedProvider);

      // Act
      const result = await repository.softDelete(BigInt(1));

      // Assert
      expect(result.isDeleted).toBe(1);
      expect(mockPrismaService.serviceProvider.update).toHaveBeenCalledWith({
        where: { id: BigInt(1) },
        data: { isDeleted: 1 },
      });
    });
  });

  describe('checkServiceTypeExists', () => {
    it('should return true when service type exists', async () => {
      // Arrange
      mockPrismaService.serviceType.findUnique.mockResolvedValue({
        id: BigInt(1),
        name: 'Test Service',
      });

      // Act
      const result = await repository.checkServiceTypeExists(BigInt(1));

      // Assert
      expect(result).toBe(true);
      expect(mockPrismaService.serviceType.findUnique).toHaveBeenCalledWith({
        where: { id: BigInt(1) },
      });
    });

    it('should return false when service type does not exist', async () => {
      // Arrange
      mockPrismaService.serviceType.findUnique.mockResolvedValue(null);

      // Act
      const result = await repository.checkServiceTypeExists(BigInt(999));

      // Assert
      expect(result).toBe(false);
    });
  });
});