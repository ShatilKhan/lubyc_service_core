import { Test, TestingModule } from '@nestjs/testing';
import { BusinessHoursService } from './business-hours.service';
import { BusinessHoursRepository } from './business-hours.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateBusinessHoursDto } from './dto/create-business-hours.dto';
import { UpdateBusinessHoursDto } from './dto/update-business-hours.dto';

describe('BusinessHoursService', () => {
  let service: BusinessHoursService;
  let repository: jest.Mocked<BusinessHoursRepository>;

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
    const mockRepository = {
      create: jest.fn(),
      findByProviderId: jest.fn(),
      findByProviderIdAndDay: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      upsert: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessHoursService,
        {
          provide: BusinessHoursRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BusinessHoursService>(BusinessHoursService);
    repository = module.get(BusinessHoursRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBusinessHours', () => {
    it('should create business hours successfully', async () => {
      const createDto: CreateBusinessHoursDto = {
        dayOfWeek: 1,
        openTime: '09:00',
        closeTime: '17:00',
        isClosed: false,
      };

      repository.findByProviderIdAndDay.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockBusinessHours);

      const result = await service.createBusinessHours('1', createDto);

      expect(result).toEqual(mockBusinessHours);
      expect(repository.findByProviderIdAndDay).toHaveBeenCalledWith(BigInt(1), 1);
      expect(repository.create).toHaveBeenCalled();
    });

    it('should throw error if business hours already exist for the day', async () => {
      const createDto: CreateBusinessHoursDto = {
        dayOfWeek: 1,
        openTime: '09:00',
        closeTime: '17:00',
        isClosed: false,
      };

      repository.findByProviderIdAndDay.mockResolvedValue(mockBusinessHours);

      await expect(service.createBusinessHours('1', createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw error if close time is before open time', async () => {
      const createDto: CreateBusinessHoursDto = {
        dayOfWeek: 1,
        openTime: '17:00',
        closeTime: '09:00',
        isClosed: false,
      };

      repository.findByProviderIdAndDay.mockResolvedValue(null);

      await expect(service.createBusinessHours('1', createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create closed business hours', async () => {
      const createDto: CreateBusinessHoursDto = {
        dayOfWeek: 1,
        openTime: '09:00',
        closeTime: '17:00',
        isClosed: true,
      };

      repository.findByProviderIdAndDay.mockResolvedValue(null);
      repository.create.mockResolvedValue({ ...mockBusinessHours, isClosed: 1 });

      const result = await service.createBusinessHours('1', createDto);

      expect(result.isClosed).toBe(1);
    });
  });

  describe('getProviderBusinessHours', () => {
    it('should return business hours for a provider', async () => {
      const businessHoursList = [mockBusinessHours];
      repository.findByProviderId.mockResolvedValue(businessHoursList);

      const result = await service.getProviderBusinessHours('1');

      expect(result).toEqual(businessHoursList);
      expect(repository.findByProviderId).toHaveBeenCalledWith(BigInt(1));
    });

    it('should return empty array if no business hours found', async () => {
      repository.findByProviderId.mockResolvedValue([]);

      const result = await service.getProviderBusinessHours('1');

      expect(result).toEqual([]);
    });
  });

  describe('updateBusinessHours', () => {
    it('should update business hours successfully', async () => {
      const updateDto: UpdateBusinessHoursDto = {
        openTime: '10:00',
        closeTime: '18:00',
      };

      repository.findById.mockResolvedValue(mockBusinessHours);
      repository.update.mockResolvedValue({
        ...mockBusinessHours,
        openTime: '10:00',
        closeTime: '18:00',
      });

      const result = await service.updateBusinessHours('1', updateDto);

      expect(result.openTime).toBe('10:00');
      expect(result.closeTime).toBe('18:00');
    });

    it('should throw error if business hours not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.updateBusinessHours('1', { openTime: '10:00' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw error if updated close time is before open time', async () => {
      const updateDto: UpdateBusinessHoursDto = {
        openTime: '18:00',
        closeTime: '10:00',
        isClosed: false,
      };

      repository.findById.mockResolvedValue(mockBusinessHours);

      await expect(service.updateBusinessHours('1', updateDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('deleteBusinessHours', () => {
    it('should soft delete business hours successfully', async () => {
      repository.findById.mockResolvedValue(mockBusinessHours);
      repository.softDelete.mockResolvedValue({
        ...mockBusinessHours,
        isDeleted: 1,
      });

      const result = await service.deleteBusinessHours('1');

      expect(result.isDeleted).toBe(1);
      expect(repository.softDelete).toHaveBeenCalledWith(BigInt(1));
    });

    it('should throw error if business hours not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.deleteBusinessHours('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('isTimeWithinBusinessHours', () => {
    it('should return true if time is within business hours', async () => {
      repository.findByProviderIdAndDay.mockResolvedValue(mockBusinessHours);

      const result = await service.isTimeWithinBusinessHours('1', 1, '10:00');

      expect(result).toBe(true);
    });

    it('should return false if time is before opening', async () => {
      repository.findByProviderIdAndDay.mockResolvedValue(mockBusinessHours);

      const result = await service.isTimeWithinBusinessHours('1', 1, '08:00');

      expect(result).toBe(false);
    });

    it('should return false if time is after closing', async () => {
      repository.findByProviderIdAndDay.mockResolvedValue(mockBusinessHours);

      const result = await service.isTimeWithinBusinessHours('1', 1, '18:00');

      expect(result).toBe(false);
    });

    it('should return false if day is closed', async () => {
      repository.findByProviderIdAndDay.mockResolvedValue({
        ...mockBusinessHours,
        isClosed: 1,
      });

      const result = await service.isTimeWithinBusinessHours('1', 1, '10:00');

      expect(result).toBe(false);
    });

    it('should return false if no business hours for the day', async () => {
      repository.findByProviderIdAndDay.mockResolvedValue(null);

      const result = await service.isTimeWithinBusinessHours('1', 1, '10:00');

      expect(result).toBe(false);
    });
  });

  describe('bulkUpsertBusinessHours', () => {
    it('should bulk upsert business hours successfully', async () => {
      const businessHoursList: CreateBusinessHoursDto[] = [
        { dayOfWeek: 1, openTime: '09:00', closeTime: '17:00', isClosed: false },
        { dayOfWeek: 2, openTime: '09:00', closeTime: '17:00', isClosed: false },
      ];

      repository.upsert.mockResolvedValue(mockBusinessHours);

      const result = await service.bulkUpsertBusinessHours('1', businessHoursList);

      expect(result).toHaveLength(2);
      expect(repository.upsert).toHaveBeenCalledTimes(2);
    });

    it('should throw error if close time is before open time in bulk', async () => {
      const businessHoursList: CreateBusinessHoursDto[] = [
        { dayOfWeek: 1, openTime: '17:00', closeTime: '09:00', isClosed: false },
      ];

      await expect(
        service.bulkUpsertBusinessHours('1', businessHoursList),
      ).rejects.toThrow(BadRequestException);
    });
  });
});