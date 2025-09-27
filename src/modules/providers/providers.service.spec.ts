import { Test, TestingModule } from '@nestjs/testing';
import { ProvidersService } from './providers.service';
import { ProvidersRepository } from './providers.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';

describe('ProvidersService', () => {
  let service: ProvidersService;
  let repository: ProvidersRepository;

  const mockRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findByUserId: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    checkServiceTypeExists: jest.fn(),
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
    capacity: 1,
    logo: null,
    status: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: null,
    isDeleted: 0,
    serviceType: {
      id: BigInt(1),
      userId: BigInt(1),
      name: 'Test Service',
      description: 'Test Description',
      icon: null,
      status: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: null,
      isDeleted: 0,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvidersService,
        {
          provide: ProvidersRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProvidersService>(ProvidersService);
    repository = module.get<ProvidersRepository>(ProvidersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProvider', () => {
    it('should create a provider with valid data', async () => {
      // Arrange
      const createProviderDto: CreateProviderDto = {
        serviceTypeId: 1,
        lat: '23.8103',
        lng: '90.4125',
        userId: BigInt(1),
      };

      mockRepository.checkServiceTypeExists.mockResolvedValue(true);
      mockRepository.create.mockResolvedValue(mockProvider);

      // Act
      const result = await service.createProvider(createProviderDto, BigInt(1));

      // Assert
      expect(result).toEqual(mockProvider);
      expect(mockRepository.checkServiceTypeExists).toHaveBeenCalledWith(BigInt(1));
      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('should set default capacity to 1 when not provided', async () => {
      // Arrange
      const createProviderDto: CreateProviderDto = {
        serviceTypeId: 1,
        lat: '23.8103',
        lng: '90.4125',
        userId: BigInt(1),
      };

      mockRepository.checkServiceTypeExists.mockResolvedValue(true);
      mockRepository.create.mockResolvedValue(mockProvider);

      // Act
      await service.createProvider(createProviderDto, BigInt(1));

      // Assert
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          capacity: 1,
        }),
      );
    });

    it('should set custom capacity when provided', async () => {
      // Arrange
      const createProviderDto: CreateProviderDto = {
        serviceTypeId: 1,
        lat: '23.8103',
        lng: '90.4125',
        capacity: 5,
        userId: BigInt(1),
      };

      const providerWithCapacity = { ...mockProvider, capacity: 5 };
      mockRepository.checkServiceTypeExists.mockResolvedValue(true);
      mockRepository.create.mockResolvedValue(providerWithCapacity);

      // Act
      const result = await service.createProvider(createProviderDto, BigInt(1));

      // Assert
      expect(result.capacity).toBe(5);
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          capacity: 5,
        }),
      );
    });

    it('should throw BadRequestException when serviceTypeId does not exist', async () => {
      // Arrange
      const createProviderDto: CreateProviderDto = {
        serviceTypeId: 999,
        userId: BigInt(1),
      };

      mockRepository.checkServiceTypeExists.mockResolvedValue(false);

      // Act & Assert
      await expect(
        service.createProvider(createProviderDto, BigInt(1)),
      ).rejects.toThrow(BadRequestException);
      expect(mockRepository.checkServiceTypeExists).toHaveBeenCalledWith(BigInt(999));
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getProviderById', () => {
    it('should return a provider when found', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(mockProvider);

      // Act
      const result = await service.getProviderById('1');

      // Assert
      expect(result).toEqual(mockProvider);
      expect(mockRepository.findById).toHaveBeenCalledWith(BigInt(1));
    });

    it('should throw NotFoundException when provider not found', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getProviderById('999')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.findById).toHaveBeenCalledWith(BigInt(999));
    });
  });

  describe('updateProvider', () => {
    it('should update a provider with valid data', async () => {
      // Arrange
      const updateProviderDto: UpdateProviderDto = {
        lat: '23.8200',
        lng: '90.4200',
      };

      mockRepository.findById.mockResolvedValue(mockProvider);
      mockRepository.update.mockResolvedValue({
        ...mockProvider,
        ...updateProviderDto,
      });

      // Act
      const result = await service.updateProvider('1', updateProviderDto);

      // Assert
      expect(result.lat).toBe('23.8200');
      expect(result.lng).toBe('90.4200');
      expect(mockRepository.update).toHaveBeenCalled();
    });

    it('should update capacity when provided', async () => {
      // Arrange
      const updateProviderDto: UpdateProviderDto = {
        capacity: 10,
      };

      mockRepository.findById.mockResolvedValue(mockProvider);
      mockRepository.update.mockResolvedValue({
        ...mockProvider,
        capacity: 10,
      });

      // Act
      const result = await service.updateProvider('1', updateProviderDto);

      // Assert
      expect(result.capacity).toBe(10);
      expect(mockRepository.update).toHaveBeenCalledWith(
        BigInt(1),
        expect.objectContaining({
          capacity: 10,
        }),
      );
    });

    it('should validate new serviceTypeId when updating', async () => {
      // Arrange
      const updateProviderDto: UpdateProviderDto = {
        serviceTypeId: 2,
      };

      mockRepository.findById.mockResolvedValue(mockProvider);
      mockRepository.checkServiceTypeExists.mockResolvedValue(true);
      mockRepository.update.mockResolvedValue({
        ...mockProvider,
        serviceTypeId: BigInt(2),
      });

      // Act
      const result = await service.updateProvider('1', updateProviderDto);

      // Assert
      expect(mockRepository.checkServiceTypeExists).toHaveBeenCalledWith(BigInt(2));
      expect(result.serviceTypeId).toBe(BigInt(2));
    });

    it('should throw BadRequestException when new serviceTypeId does not exist', async () => {
      // Arrange
      const updateProviderDto: UpdateProviderDto = {
        serviceTypeId: 999,
      };

      mockRepository.findById.mockResolvedValue(mockProvider);
      mockRepository.checkServiceTypeExists.mockResolvedValue(false);

      // Act & Assert
      await expect(
        service.updateProvider('1', updateProviderDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteProvider', () => {
    it('should soft delete a provider', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(mockProvider);
      mockRepository.softDelete.mockResolvedValue({
        ...mockProvider,
        isDeleted: 1,
      });

      // Act
      const result = await service.deleteProvider('1');

      // Assert
      expect(result.isDeleted).toBe(1);
      expect(mockRepository.softDelete).toHaveBeenCalledWith(BigInt(1));
    });

    it('should throw NotFoundException when provider not found', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.deleteProvider('999')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.softDelete).not.toHaveBeenCalled();
    });
  });
});