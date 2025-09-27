import { Test, TestingModule } from '@nestjs/testing';
import { BusinessHoursRepository } from './business-hours.repository';
import { PrismaService } from '../../core/prisma/prisma.service';

describe('BusinessHoursRepository', () => {
  let repository: BusinessHoursRepository;
  let prisma: any;

  const mockBusinessHours = {
    id: BigInt(1),
    providerId: BigInt(1),
    dayOfWeek: 1,
    openTime: '09:00',
    closeTime: '17:00',
    isClosed: 0,
    status: 1,
    isDeleted: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: null,
  };

  beforeEach(async () => {
    const mockPrismaService = {
      businessHours: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        upsert: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessHoursRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<BusinessHoursRepository>(BusinessHoursRepository);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create business hours', async () => {
      const createData = {
        providerId: BigInt(1),
        dayOfWeek: 1,
        openTime: '09:00',
        closeTime: '17:00',
        isClosed: 0,
        provider: {
          connect: { id: BigInt(1) },
        },
      };

      prisma.businessHours.create.mockResolvedValue(mockBusinessHours);

      const result = await repository.create(createData);

      expect(result).toEqual(mockBusinessHours);
      expect(prisma.businessHours.create).toHaveBeenCalledWith({
        data: createData,
      });
    });
  });

  describe('findByProviderId', () => {
    it('should find all business hours for a provider', async () => {
      const businessHoursList = [mockBusinessHours];
      prisma.businessHours.findMany.mockResolvedValue(businessHoursList);

      const result = await repository.findByProviderId(BigInt(1));

      expect(result).toEqual(businessHoursList);
      expect(prisma.businessHours.findMany).toHaveBeenCalledWith({
        where: {
          providerId: BigInt(1),
          isDeleted: 0,
        },
        orderBy: {
          dayOfWeek: 'asc',
        },
      });
    });

    it('should return empty array if no business hours found', async () => {
      prisma.businessHours.findMany.mockResolvedValue([]);

      const result = await repository.findByProviderId(BigInt(1));

      expect(result).toEqual([]);
    });
  });

  describe('findByProviderIdAndDay', () => {
    it('should find business hours for a specific day', async () => {
      prisma.businessHours.findFirst.mockResolvedValue(mockBusinessHours);

      const result = await repository.findByProviderIdAndDay(BigInt(1), 1);

      expect(result).toEqual(mockBusinessHours);
      expect(prisma.businessHours.findFirst).toHaveBeenCalledWith({
        where: {
          providerId: BigInt(1),
          dayOfWeek: 1,
          isDeleted: 0,
        },
      });
    });

    it('should return null if no business hours found', async () => {
      prisma.businessHours.findFirst.mockResolvedValue(null);

      const result = await repository.findByProviderIdAndDay(BigInt(1), 1);

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find business hours by id', async () => {
      prisma.businessHours.findUnique.mockResolvedValue(mockBusinessHours);

      const result = await repository.findById(BigInt(1));

      expect(result).toEqual(mockBusinessHours);
      expect(prisma.businessHours.findUnique).toHaveBeenCalledWith({
        where: {
          id: BigInt(1),
          isDeleted: 0,
        },
      });
    });

    it('should return null if not found', async () => {
      prisma.businessHours.findUnique.mockResolvedValue(null);

      const result = await repository.findById(BigInt(1));

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update business hours', async () => {
      const updateData = {
        openTime: '10:00',
        closeTime: '18:00',
      };

      const updatedBusinessHours = {
        ...mockBusinessHours,
        openTime: '10:00',
        closeTime: '18:00',
      };

      prisma.businessHours.update.mockResolvedValue(updatedBusinessHours);

      const result = await repository.update(BigInt(1), updateData);

      expect(result).toEqual(updatedBusinessHours);
      expect(prisma.businessHours.update).toHaveBeenCalledWith({
        where: { id: BigInt(1) },
        data: updateData,
      });
    });
  });

  describe('softDelete', () => {
    it('should soft delete business hours', async () => {
      const deletedBusinessHours = {
        ...mockBusinessHours,
        isDeleted: 1,
      };

      prisma.businessHours.update.mockResolvedValue(deletedBusinessHours);

      const result = await repository.softDelete(BigInt(1));

      expect(result).toEqual(deletedBusinessHours);
      expect(prisma.businessHours.update).toHaveBeenCalledWith({
        where: { id: BigInt(1) },
        data: { isDeleted: 1 },
      });
    });
  });

  describe('upsert', () => {
    it('should upsert business hours', async () => {
      const createData = {
        providerId: BigInt(1),
        dayOfWeek: 1,
        openTime: '09:00',
        closeTime: '17:00',
        isClosed: 0,
        provider: {
          connect: { id: BigInt(1) },
        },
      };

      prisma.businessHours.upsert.mockResolvedValue(mockBusinessHours);

      const result = await repository.upsert(BigInt(1), 1, createData);

      expect(result).toEqual(mockBusinessHours);
      expect(prisma.businessHours.upsert).toHaveBeenCalledWith({
        where: {
          providerId_dayOfWeek: {
            providerId: BigInt(1),
            dayOfWeek: 1,
          },
        },
        update: {
          openTime: createData.openTime,
          closeTime: createData.closeTime,
          isClosed: createData.isClosed,
          isDeleted: 0,
          updatedAt: expect.any(Date),
        },
        create: createData,
      });
    });
  });
});