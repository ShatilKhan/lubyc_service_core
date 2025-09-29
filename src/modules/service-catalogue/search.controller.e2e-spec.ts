import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../core/prisma/prisma.service';
import { DurationType, AdvancePayType, Prisma } from '@prisma/client';

describe('SearchController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  const testServiceType = {
    id: BigInt(1),
    userId: BigInt(1),
    name: 'Haircut',
    description: 'Professional haircut service',
    icon: null,
    status: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: null,
    isDeleted: 0,
  };

  const testProvider = {
    id: BigInt(1),
    userId: BigInt(1),
    companyId: null,
    serviceTypeId: BigInt(1),
    lat: '40.7128',
    lng: '-74.0060',
    geoRadius: 10,
    advancePay: 0,
    advancePayType: AdvancePayType.percent,
    advanceValue: null,
    hasCancellation: 0,
    cancellationTime: null,
    capacity: 1,
    logo: null,
    status: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: null,
    isDeleted: 0,
  };

  const testService = {
    id: BigInt(1),
    userId: BigInt(1),
    serviceProviderId: BigInt(1),
    image: null,
    title: 'Premium Haircut',
    description: 'Professional haircut with styling',
    currency: 'USD',
    price: new Prisma.Decimal(50.00),
    isPriceRange: 0,
    rangePrice: null,
    durationType: DurationType.minute,
    duration: 60,
    serveCapacity: 1,
    status: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    updatedBy: null,
    isDeleted: 0,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
    }));
    await app.init();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/v1/services/search/services (GET)', () => {
    beforeEach(async () => {
      await prismaService.$transaction([
        prismaService.serviceCatalogue.deleteMany(),
        prismaService.serviceProvider.deleteMany(),
        prismaService.serviceType.deleteMany(),
      ]);
    });

    it('should return empty array when no services exist', () => {
      return request(app.getHttpServer())
        .get('/api/v1/services/search/services')
        .expect(200)
        .expect([]);
    });

    it('should return services without filters', async () => {
      await prismaService.serviceType.create({ data: testServiceType });
      await prismaService.serviceProvider.create({ data: testProvider });
      await prismaService.serviceCatalogue.create({ data: testService });

      return request(app.getHttpServer())
        .get('/api/v1/services/search/services')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(1);
          expect(response.body[0].title).toBe('Premium Haircut');
          expect(response.body[0].provider).toBeDefined();
        });
    });

    it('should filter by serviceTypeId', async () => {
      const serviceType1 = await prismaService.serviceType.create({ data: testServiceType });
      const serviceType2 = await prismaService.serviceType.create({
        data: { ...testServiceType, id: BigInt(2), name: 'Massage' },
      });

      await prismaService.serviceProvider.create({ data: testProvider });
      await prismaService.serviceProvider.create({
        data: { ...testProvider, id: BigInt(2), serviceTypeId: BigInt(2) },
      });

      await prismaService.serviceCatalogue.create({ data: testService });
      await prismaService.serviceCatalogue.create({
        data: { ...testService, id: BigInt(2), serviceProviderId: BigInt(2), title: 'Relaxing Massage' },
      });

      return request(app.getHttpServer())
        .get('/api/v1/services/search/services?serviceTypeId=1')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(1);
          expect(response.body[0].title).toBe('Premium Haircut');
        });
    });

    it('should filter by keyword', async () => {
      await prismaService.serviceType.create({ data: testServiceType });
      await prismaService.serviceProvider.create({ data: testProvider });

      await prismaService.serviceCatalogue.create({ data: testService });
      await prismaService.serviceCatalogue.create({
        data: { ...testService, id: BigInt(2), title: 'Basic Cut' },
      });

      return request(app.getHttpServer())
        .get('/api/v1/services/search/services?keyword=Premium')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(1);
          expect(response.body[0].title).toBe('Premium Haircut');
        });
    });

    it('should filter by location', async () => {
      await prismaService.serviceType.create({ data: testServiceType });

      const nearProvider = await prismaService.serviceProvider.create({ data: testProvider });
      const farProvider = await prismaService.serviceProvider.create({
        data: {
          ...testProvider,
          id: BigInt(2),
          lat: '41.8781',
          lng: '-87.6298',
          geoRadius: 10,
        },
      });

      await prismaService.serviceCatalogue.create({ data: testService });
      await prismaService.serviceCatalogue.create({
        data: { ...testService, id: BigInt(2), serviceProviderId: BigInt(2), title: 'Far Service' },
      });

      return request(app.getHttpServer())
        .get('/api/v1/services/search/services?lat=40.7128&lng=-74.0060')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(1);
          expect(response.body[0].title).toBe('Premium Haircut');
          expect(response.body[0].provider.distance).toBeDefined();
          expect(response.body[0].provider.distance).toBeLessThan(1);
        });
    });

    it('should combine all filters', async () => {
      await prismaService.serviceType.create({ data: testServiceType });
      await prismaService.serviceType.create({
        data: { ...testServiceType, id: BigInt(2), name: 'Massage' },
      });

      await prismaService.serviceProvider.create({ data: testProvider });
      await prismaService.serviceProvider.create({
        data: { ...testProvider, id: BigInt(2), serviceTypeId: BigInt(2) },
      });

      await prismaService.serviceCatalogue.create({ data: testService });
      await prismaService.serviceCatalogue.create({
        data: { ...testService, id: BigInt(2), serviceProviderId: BigInt(2), title: 'Premium Massage' },
      });

      return request(app.getHttpServer())
        .get('/api/v1/services/search/services?serviceTypeId=1&keyword=Premium&lat=40.7128&lng=-74.0060')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(1);
          expect(response.body[0].title).toBe('Premium Haircut');
        });
    });

    it('should validate invalid latitude', () => {
      return request(app.getHttpServer())
        .get('/api/v1/services/search/services?lat=91&lng=-74.0060')
        .expect(400);
    });

    it('should validate invalid longitude', () => {
      return request(app.getHttpServer())
        .get('/api/v1/services/search/services?lat=40.7128&lng=181')
        .expect(400);
    });

    it('should validate non-numeric serviceTypeId', () => {
      return request(app.getHttpServer())
        .get('/api/v1/services/search/services?serviceTypeId=abc')
        .expect(400);
    });

    it('should include provider and service type information', async () => {
      await prismaService.serviceType.create({ data: testServiceType });
      await prismaService.serviceProvider.create({ data: testProvider });
      await prismaService.serviceCatalogue.create({ data: testService });

      return request(app.getHttpServer())
        .get('/api/v1/services/search/services')
        .expect(200)
        .then(response => {
          expect(response.body[0].provider).toBeDefined();
          expect(response.body[0].provider.serviceType).toBeDefined();
          expect(response.body[0].provider.serviceType.name).toBe('Haircut');
          expect(response.body[0].provider.lat).toBe('40.7128');
          expect(response.body[0].provider.lng).toBe('-74.0060');
          expect(response.body[0].provider.geoRadius).toBe(10);
        });
    });

    it('should handle services with price ranges', async () => {
      await prismaService.serviceType.create({ data: testServiceType });
      await prismaService.serviceProvider.create({ data: testProvider });
      await prismaService.serviceCatalogue.create({
        data: {
          ...testService,
          isPriceRange: 1,
          rangePrice: new Prisma.Decimal(100.00),
        },
      });

      return request(app.getHttpServer())
        .get('/api/v1/services/search/services')
        .expect(200)
        .then(response => {
          expect(response.body[0].isPriceRange).toBe(1);
          expect(response.body[0].rangePrice).toBe(100.00);
        });
    });

    it('should exclude deleted services', async () => {
      await prismaService.serviceType.create({ data: testServiceType });
      await prismaService.serviceProvider.create({ data: testProvider });

      await prismaService.serviceCatalogue.create({ data: testService });
      await prismaService.serviceCatalogue.create({
        data: { ...testService, id: BigInt(2), title: 'Deleted Service', isDeleted: 1 },
      });

      return request(app.getHttpServer())
        .get('/api/v1/services/search/services')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(1);
          expect(response.body[0].title).toBe('Premium Haircut');
        });
    });

    it('should exclude services from deleted providers', async () => {
      await prismaService.serviceType.create({ data: testServiceType });

      await prismaService.serviceProvider.create({ data: testProvider });
      await prismaService.serviceProvider.create({
        data: { ...testProvider, id: BigInt(2), isDeleted: 1 },
      });

      await prismaService.serviceCatalogue.create({ data: testService });
      await prismaService.serviceCatalogue.create({
        data: { ...testService, id: BigInt(2), serviceProviderId: BigInt(2), title: 'Service from deleted provider' },
      });

      return request(app.getHttpServer())
        .get('/api/v1/services/search/services')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(1);
          expect(response.body[0].title).toBe('Premium Haircut');
        });
    });

    it('should sort by distance when location is provided', async () => {
      await prismaService.serviceType.create({ data: testServiceType });

      await prismaService.serviceProvider.create({ data: testProvider });
      await prismaService.serviceProvider.create({
        data: {
          ...testProvider,
          id: BigInt(2),
          lat: '40.7328',
          lng: '-74.0160',
          geoRadius: 50,
        },
      });
      await prismaService.serviceProvider.create({
        data: {
          ...testProvider,
          id: BigInt(3),
          lat: '40.7528',
          lng: '-74.0260',
          geoRadius: 50,
        },
      });

      await prismaService.serviceCatalogue.create({
        data: { ...testService, title: 'Nearest Service' },
      });
      await prismaService.serviceCatalogue.create({
        data: { ...testService, id: BigInt(2), serviceProviderId: BigInt(2), title: 'Middle Service' },
      });
      await prismaService.serviceCatalogue.create({
        data: { ...testService, id: BigInt(3), serviceProviderId: BigInt(3), title: 'Farthest Service' },
      });

      return request(app.getHttpServer())
        .get('/api/v1/services/search/services?lat=40.7128&lng=-74.0060')
        .expect(200)
        .then(response => {
          expect(response.body).toHaveLength(3);
          expect(response.body[0].title).toBe('Nearest Service');
          expect(response.body[1].title).toBe('Middle Service');
          expect(response.body[2].title).toBe('Farthest Service');
          expect(response.body[0].provider.distance).toBeLessThan(response.body[1].provider.distance);
          expect(response.body[1].provider.distance).toBeLessThan(response.body[2].provider.distance);
        });
    });
  });
});