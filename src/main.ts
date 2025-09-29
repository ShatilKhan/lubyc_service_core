import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// Fix BigInt serialization for JSON responses
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for external access
  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.setGlobalPrefix('api/v1/services');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Lubyc Service Core API')
    .setDescription('API documentation for Lubyc Service Core - Service Catalogue Management System')
    .setVersion('1.0')
    .addTag('Providers', 'Service provider management endpoints')
    .addTag('Business Hours', 'Business hours management endpoints')
    .addTag('Service Catalogue', 'Service catalogue management endpoints')
    .addTag('Search', 'Service search endpoints')
    .addServer('http://localhost:3003', 'Local Development')
    .addServer('http://0.0.0.0:3003', 'Network Access')
    .setContact('Lubyc Development Team', 'https://lubyc.com', 'dev@lubyc.com')
    .setLicense('Proprietary', 'https://lubyc.com/license')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: true,
      filter: true,
      displayRequestDuration: true,
    },
  });

  // Listen on all network interfaces for external access
  await app.listen(3003, '0.0.0.0');
  console.log(`Application is running on: http://localhost:3003`);
  console.log(`API Documentation available at: http://localhost:3003/api-docs`);
  console.log(`Network access: http://0.0.0.0:3003/api-docs`);
}
bootstrap();