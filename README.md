# Lubyc Service Core

A comprehensive backend service for managing service providers, their business hours, service catalogues, and bookings. Built with NestJS, Prisma, and PostgreSQL.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Contributing](#contributing)

## 🎯 Overview

Lubyc Service Core is a robust backend API service designed to manage the complete lifecycle of service-based businesses. It enables service providers to register their businesses, manage operating hours, create service catalogues, and handle customer bookings efficiently.

### Key Use Cases:
- **Service Provider Management**: Register and manage service providers (salons, spas, clinics, etc.)
- **Business Hours Configuration**: Set operating hours for each day of the week
- **Service Catalogue**: Create and manage services with pricing, duration, and descriptions
- **Location-Based Search**: Find services based on geographic proximity
- **Booking System**: Handle advance payments, cancellations, and capacity management

## ✨ Features

- **Multi-Provider Support**: Manage multiple service providers with unique configurations
- **Flexible Business Hours**: Support for different hours each day, including breaks
- **Service Catalogue Management**: Create detailed service offerings with pricing tiers
- **Geographic Search**: Location-based service discovery with radius filtering
- **Advanced Booking Rules**: Configure advance payment requirements and cancellation policies
- **Capacity Management**: Handle concurrent bookings based on provider capacity
- **RESTful API**: Clean, well-documented REST endpoints
- **Swagger Documentation**: Interactive API documentation and testing interface
- **Type Safety**: Full TypeScript support with Prisma ORM
- **Data Validation**: Comprehensive input validation using class-validator

## 🛠 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) - Progressive Node.js framework
- **Database**: PostgreSQL - Robust relational database
- **ORM**: [Prisma](https://www.prisma.io/) - Next-generation TypeScript ORM
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Language**: TypeScript
- **Package Manager**: npm

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **PostgreSQL** (v14.0 or higher)
- **Git**

## 🚀 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/ShatilKhan/lubyc_service_core.git
cd lubyc_service_core
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```
Or create a new `.env` file with:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/lubyc_service_core?schema=public"
PORT=3003
```

## 💾 Database Setup

1. **Create the database:**
```bash
createdb lubyc_service_core
```

2. **Run Prisma migrations:**
```bash
npx prisma db push
```

3. **Generate Prisma client:**
```bash
npx prisma generate
```

4. **Seed the database with initial data:**
```bash
npm run seed
```

This will populate the database with:
- 10 default service types (Barber Shop, Spa, Hair Salon, etc.)
- Sample data for testing

## 🏃 Running the Application

### Development Mode
```bash
npm run start:dev
```
The server will start on http://localhost:3003 with hot-reload enabled.

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

## 📚 API Documentation

Once the application is running, you can access the interactive Swagger documentation at:

**http://localhost:3003/api-docs**

### Main API Endpoints

#### Service Providers
- `POST /api/v1/services/providers` - Create a service provider
- `GET /api/v1/services/providers/:id` - Get provider details
- `PUT /api/v1/services/providers/:id` - Update provider
- `DELETE /api/v1/services/providers/:id` - Delete provider
- `GET /api/v1/services/providers/user/:userId` - Get providers by user

#### Business Hours
- `POST /api/v1/services/providers/:providerId/business-hours` - Add business hours
- `GET /api/v1/services/providers/:providerId/business-hours` - Get business hours
- `PUT /api/v1/services/providers/:providerId/business-hours/:hoursId` - Update hours
- `DELETE /api/v1/services/providers/:providerId/business-hours/:hoursId` - Delete hours
- `POST /api/v1/services/providers/:providerId/business-hours/bulk` - Bulk update hours

#### Service Catalogue
- `POST /api/v1/services/providers/:providerId/catalogue` - Add service
- `GET /api/v1/services/providers/:providerId/catalogue` - List services
- `GET /api/v1/services/providers/:providerId/catalogue/:catalogueId` - Get service details
- `PUT /api/v1/services/providers/:providerId/catalogue/:catalogueId` - Update service
- `DELETE /api/v1/services/providers/:providerId/catalogue/:catalogueId` - Delete service

#### Search
- `GET /api/v1/services/search/services` - Search services by location, type, or keyword

### Example API Calls

**Create a Provider:**
```bash
curl -X POST http://localhost:3003/api/v1/services/providers \
  -H 'Content-Type: application/json' \
  -d '{
    "serviceTypeId": 3,
    "lat": "40.7128",
    "lng": "-74.0060",
    "capacity": 3
  }'
```

**Add Business Hours:**
```bash
curl -X POST http://localhost:3003/api/v1/services/providers/1/business-hours \
  -H 'Content-Type: application/json' \
  -d '{
    "dayOfWeek": 1,
    "openTime": "09:00",
    "closeTime": "18:00"
  }'
```

**Search Services:**
```bash
curl -X GET "http://localhost:3003/api/v1/services/search/services?serviceTypeId=3&lat=40.7128&lng=-74.0060"
```

## 📁 Project Structure

```
lubyc_service_core/
├── src/
│   ├── modules/
│   │   ├── providers/           # Service provider module
│   │   │   ├── dto/            # Data transfer objects
│   │   │   ├── providers.controller.ts
│   │   │   ├── providers.service.ts
│   │   │   └── providers.repository.ts
│   │   ├── business-hours/     # Business hours module
│   │   │   ├── dto/
│   │   │   ├── business-hours.controller.ts
│   │   │   ├── business-hours.service.ts
│   │   │   └── business-hours.repository.ts
│   │   └── service-catalogue/   # Service catalogue module
│   │       ├── dto/
│   │       ├── service-catalogue.controller.ts
│   │       ├── service-catalogue.service.ts
│   │       ├── service-catalogue.repository.ts
│   │       └── search.controller.ts
│   ├── core/
│   │   └── prisma/             # Prisma service
│   ├── app.module.ts           # Root application module
│   └── main.ts                 # Application entry point
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seeding script
├── docs/                        # Additional documentation
├── test/                        # Test files
└── package.json                 # Dependencies and scripts
```

## 📝 Available Scripts

```bash
# Development
npm run start:dev          # Start in watch mode
npm run start:debug        # Start with debug
npm run start              # Start normally

# Building
npm run build              # Build the project
npm run start:prod         # Start production build

# Database
npm run seed               # Seed database with initial data
npx prisma studio         # Open Prisma Studio GUI

# Code Quality
npm run format            # Format code with Prettier
npm run lint              # Lint and fix with ESLint

# Testing
npm run test              # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:cov          # Generate coverage report
npm run test:debug        # Debug tests
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/lubyc_service_core?schema=public"

# Application
PORT=3003
NODE_ENV=development

# Optional: API Keys for future integrations
# STRIPE_API_KEY=your_stripe_key
# SENDGRID_API_KEY=your_sendgrid_key
```

## 🧪 Testing

Run the test suite:

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow the existing code style
- Use meaningful variable and function names
- Write unit tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is proprietary and confidential.

## 👥 Contact

- **Development Team**: dev@lubyc.com
- **GitHub**: [https://github.com/ShatilKhan/lubyc_service_core](https://github.com/ShatilKhan/lubyc_service_core)

## 🔧 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Find process using port 3003
lsof -i :3003
# Kill the process
kill -9 <PID>
```

**Database Connection Error:**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env file
- Verify database exists: `psql -l`

**Prisma Client Issues:**
```bash
npx prisma generate
npm run build
```

---

Built with ❤️ by the Lubyc Development Team
