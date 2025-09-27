# Lubyc Service Core Architecture Document

## 1. High-Level Architecture (Revised with Caching)

This section defines the overall structure of the system, its boundaries, and how it interacts with the existing Lubyc ecosystem.

### Technical Summary

We will architect the **Service Core Module** as a self-contained, Dockerized **Node.js (TypeScript)** application. It will expose a comprehensive **RESTful API** to be consumed by the Lubyc frontend or other clients. The service will be stateless to support horizontal scaling. A **Redis** in-memory cache will be implemented to optimize read performance for frequently accessed data like service pages and templates. All data persistence will be managed via the **Prisma ORM** to a dedicated **PostgreSQL** database. For integration, the module will communicate with existing Lubyc services (Auth, HRM, Calendar) via their respective APIs, treating them as external dependencies.

### System Context Diagram

```mermaid
graph TD
    subgraph User
        A[Customer / Provider]
    end

    subgraph Existing Lubyc Platform
        B[Lubyc Frontend]
    end

    subgraph New Service Core Module
        C[Service API <br> (Node.js/Express/NestJS)]
        R[Redis Cache]
        D[PostgreSQL Database]
        C -- 1. Check Cache --> R
        R -- 2. Cache Miss --> C
        C -- 3. Fetch from DB --> D
        D -- 4. Return Data --> C
        C -- 5. Populate Cache --> R
        R -- Cache Hit --> C
    end

    subgraph Existing Lubyc Services (External Dependencies)
        E[Auth Service]
        F[Employee/HRM Service]
        G[Calendar Service]
    end

    A -- Interacts with --> B
    B -- Makes API Calls [HTTPS/JSON] --> C
    C -- Validates JWT (Assumed API) --> E
    C -- Fetches Employee Data (Assumed API) --> F
    C -- Manages Schedules (Assumed API) --> G

    style C fill:#D5F5E3,stroke:#333,stroke-width:2px
    style R fill:#FADBD8,stroke:#333,stroke-width:2px
    style D fill:#D5F5E3,stroke:#333,stroke-width:2px
    style B fill:#EBF5FB,stroke:#333,stroke-width:2px
    style E fill:#FEF9E7,stroke:#333,stroke-width:2px
    style F fill:#FEF9E7,stroke:#333,stroke-width:2px
    style G fill:#FEF9E7,stroke:#333,stroke-width:2px
```

### Caching Strategy

*   **What We Will Cache:**
    *   Public Service Pages
    *   Service Templates & Categories
    *   Provider Service Lists
*   **Cache Invalidation:**
    1.  **Time-To-Live (TTL):** Data expires after a set period (e.g., 15-60 minutes).
    2.  **Event-Driven Invalidation:** Explicitly delete cache keys when underlying data is updated.

## 2. REST API Specification (Revised for Auth-Disabled Development)

```yaml
openapi: 3.0.1
info:
  title: "Lubyc Service Core API"
  description: "API for managing service providers, their catalogues, bookings, and more within the Lubyc ecosystem."
  version: "1.0.0"
servers:
  - url: "/api/v1/services"
    description: "Main API Gateway"

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    ServiceProvider:
      type: object
      properties:
        id: { type: integer, example: 1 }
        userId: { type: integer, example: 101 }
        serviceTypeId: { type: integer, example: 3 }
        lat: { type: string, example: "23.8103" }
        lng: { type: string, example: "90.4125" }
        advancePayType: { type: string, enum: [amount, percent], example: "percent" }
        advanceValue: { type: number, format: double, example: 20.0 }
        hasCancellation: { type: boolean, example: true }
        cancellationTime: { type: integer, description: "Minutes before appointment that cancellation is allowed without penalty.", example: 1440 }
        status: { type: string, enum: [pending, approved, rejected], example: "approved" }

    ServiceCatalogueItem:
      type: object
      properties:
        id: { type: integer, example: 25 }
        title: { type: string, example: "Men's Haircut & Style" }
        description: { type: string, example: "A classic haircut including wash, cut, and style." }
        price: { type: number, format: double, example: 25.00 }
        currency: { type: string, example: "USD" }
        duration: { type: integer, example: 45 }
        durationType: { type: string, enum: [minute, hour], example: "minute" }
        serveCapacity: { type: integer, description: "How many customers can be served in this slot simultaneously.", example: 1 }

    ServiceProviderInput:
      type: object
      required: [serviceTypeId]
      properties:
        serviceTypeId: { type: integer }
        lat: { type: string }
        lng: { type: string }
        advancePayType: { type: string, enum: [amount, percent] }
        advanceValue: { type: number }
        hasCancellation: { type: boolean }
        cancellationTime: { type: integer }

    ServiceCatalogueItemInput:
      type: object
      required: [title, price, duration, durationType]
      properties:
        title: { type: string }
        description: { type: string }
        price: { type: number }
        currency: { type: string }
        duration: { type: integer }
        durationType: { type: string, enum: [minute, hour] }
        serveCapacity: { type: integer }

paths:
  /providers:
    post:
      tags: [Provider Management]
      summary: "Create a Service Provider Profile"
      # security: - bearerAuth: [] # Temporarily disabled for initial development
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/ServiceProviderInput' }
      responses:
        '201':
          description: "Provider profile created successfully."
          content:
            application/json:
              schema: { $ref: '#/components/schemas/ServiceProvider' }

  /providers/{providerId}:
    get:
      tags: [Provider Management]
      summary: "Get Provider Details"
      parameters:
        - { name: providerId, in: path, required: true, schema: { type: integer } }
      responses:
        '200':
          description: "Successful response"
          content:
            application/json:
              schema: { $ref: '#/components/schemas/ServiceProvider' }
    put:
      tags: [Provider Management]
      summary: "Update a Provider Profile"
      # security: - bearerAuth: [] # Temporarily disabled
      parameters:
        - { name: providerId, in: path, required: true, schema: { type: integer } }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/ServiceProviderInput' }
      responses:
        '200':
          description: "Provider profile updated successfully."
          content:
            application/json:
              schema: { $ref: '#/components/schemas/ServiceProvider' }

  /providers/{providerId}/catalogue:
    post:
      tags: [Service Catalogue]
      summary: "Add a New Service to a Provider's Catalogue"
      # security: - bearerAuth: [] # Temporarily disabled
      parameters:
        - { name: providerId, in: path, required: true, schema: { type: integer } }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/ServiceCatalogueItemInput' }
      responses:
        '201':
          description: "Service created successfully."
          content:
            application/json:
              schema: { $ref: '#/components/schemas/ServiceCatalogueItem' }
    get:
      tags: [Service Catalogue]
      summary: "List All Services for a Provider"
      parameters:
        - { name: providerId, in: path, required: true, schema: { type: integer } }
      responses:
        '200':
          description: "A list of services."
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/ServiceCatalogueItem' }

  /providers/{providerId}/catalogue/{catalogueId}:
    get:
      tags: [Service Catalogue]
      summary: "Get a Specific Service's Details"
      parameters:
        - { name: providerId, in: path, required: true, schema: { type: integer } }
        - { name: catalogueId, in: path, required: true, schema: { type: integer } }
      responses:
        '200':
          description: "Successful response"
          content:
            application/json:
              schema: { $ref: '#/components/schemas/ServiceCatalogueItem' }
    put:
      tags: [Service Catalogue]
      summary: "Update a Service"
      # security: - bearerAuth: [] # Temporarily disabled
      parameters:
        - { name: providerId, in: path, required: true, schema: { type: integer } }
        - { name: catalogueId, in: path, required: true, schema: { type: integer } }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/ServiceCatalogueItemInput' }
      responses:
        '200':
          description: "Service updated successfully."
          content:
            application/json:
              schema: { $ref: '#/components/schemas/ServiceCatalogueItem' }
```

## 3. Database Schema and Indexing Strategy

### Prisma Schema (`schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// --- ENUMS ---
enum AdvancePayType {
  amount
  percent
}

enum DurationType {
  minute
  hour
}

// --- MODELS ---

model ServiceType {
  id          BigInt   @id @default(autoincrement())
  userId      BigInt   @map("user_id")
  name        String
  description String?  @db.Text
  icon        String?  @db.Text
  status      Int      @default(0) @db.SmallInt
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  updatedBy   BigInt?  @map("updated_by")
  isDeleted   Int      @default(0) @db.SmallInt @map("is_deleted")

  serviceProviders ServiceProvider[]
  categories       CategoryServiceType[]

  @@map("service_types")
}

model ServiceProvider {
  id                BigInt   @id @default(autoincrement())
  userId            BigInt   @map("user_id")
  companyId         BigInt?  @map("company_id")
  serviceTypeId     BigInt   @map("service_type_id")
  lat               String?  @db.VarChar(50)
  lng               String?  @db.VarChar(50)
  geoRadius         Int?     @default(10) @map("geo_radius")
  advancePay        Int      @default(0) @db.SmallInt @map("advance_pay")
  advancePayType    AdvancePayType @default(percent) @map("advance_pay_type")
  advanceValue      Float?   @map("advance_value")
  hasCancellation   Int      @default(0) @db.SmallInt @map("has_cancellation")
  cancellationTime  Int?     @map("cancellation_time")
  logo              String?  @db.Text
  status            Int      @default(0) @db.SmallInt
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")
  updatedBy         BigInt?  @map("updated_by")
  isDeleted         Int      @default(0) @db.SmallInt @map("is_deleted")

  serviceType       ServiceType @relation(fields: [serviceTypeId], references: [id])
  serviceCatalogue  ServiceCatalogue[]
  serviceAddons     ServiceAddon[]

  @@index([userId])
  @@index([serviceTypeId])
  @@index([lat, lng])
  @@map("service_providers")
}

model ServiceAddon {
  id          BigInt   @id @default(autoincrement())
  userId      BigInt   @map("user_id")
  providerId  BigInt   @map("provider_id")
  title       String
  description String?  @db.Text
  file        String?  @db.Text
  quantity    Int
  price       Decimal  @db.Decimal(10, 2)
  currency    String   @default("USD") @db.VarChar(10)
  durationType DurationType @default(hour) @map("duration_type")
  duration    Int?
  status      Int      @default(0) @db.SmallInt
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  updatedBy   BigInt?  @map("updated_by")
  isDeleted   Int      @default(0) @db.SmallInt @map("is_deleted")

  provider    ServiceProvider @relation(fields: [providerId], references: [id])
  catalogueAddons ServiceCatalogueAddon[]

  @@index([providerId])
  @@map("service_addons")
}

model ServiceCatalogue {
  id                BigInt   @id @default(autoincrement())
  userId            BigInt   @map("user_id")
  serviceProviderId BigInt   @map("service_provider_id")
  image             String?  @db.Text
  title             String
  description       String?  @db.Text
  currency          String   @default("USD") @db.VarChar(10)
  price             Decimal  @db.Decimal(10, 2)
  isPriceRange      Int      @default(0) @db.SmallInt @map("is_price_range")
  rangePrice        Decimal? @db.Decimal(10, 2) @map("range_price")
  durationType      DurationType @default(hour) @map("duration_type")
  duration          Int
  serveCapacity     Int      @default(1) @map("serve_capacity")
  status            Int      @default(0) @db.SmallInt
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")
  updatedBy         BigInt?  @map("updated_by")
  isDeleted         Int      @default(0) @db.SmallInt @map("is_deleted")

  provider          ServiceProvider @relation(fields: [serviceProviderId], references: [id])
  addons            ServiceCatalogueAddon[]
  employees         ServiceCatalogueEmployee[]
  categories        ServiceCatalogCategory[]
  templates         ServiceCatalogueTemplate[]
  dynamicFieldValues ServiceDynamicFieldValue[]

  @@index([serviceProviderId])
  @@index([title])
  @@map("service_catalogue")
}

model ServiceCatalogueAddon {
  id          BigInt   @id @default(autoincrement())
  userId      BigInt   @map("user_id")
  catalogueId BigInt   @map("catalogue_id")
  addonId     BigInt   @map("addon_id")
  status      Int      @default(1) @db.SmallInt
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  updatedBy   BigInt?  @map("updated_by")
  isDeleted   Int      @default(0) @db.SmallInt @map("is_deleted")

  catalogue   ServiceCatalogue @relation(fields: [catalogueId], references: [id])
  addon       ServiceAddon     @relation(fields: [addonId], references: [id])

  @@unique([catalogueId, addonId])
  @@map("service_catalogue_addons")
}

model ServiceCatalogueEmployee {
  id          BigInt   @id @default(autoincrement())
  userId      BigInt   @map("user_id")
  employeeId  BigInt   @map("employee_id")
  catalogueId BigInt   @map("catalogue_id")
  role        String?  @db.VarChar(250)
  status      Int      @default(1) @db.SmallInt
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  updatedBy   BigInt?  @map("updated_by")
  isDeleted   Int      @default(0) @db.SmallInt @map("is_deleted")

  catalogue   ServiceCatalogue @relation(fields: [catalogueId], references: [id])

  @@unique([employeeId, catalogueId])
  @@map("service_catalogue_employees")
}
```

### Indexing Strategy Summary

*   **Foreign Keys:** All foreign key fields are automatically indexed by Prisma.
*   **Geospatial Search:** An index on `[lat, lng]` in `service_providers` for efficient location-based queries.
*   **Text Search:** An index on `title` in `service_catalogue` for fast service searches.
*   **Common Lookups:** Indexes on frequently queried fields like `userId` and `serviceProviderId`.

## 4. Source Tree (Project Folder Structure)

```plaintext
lubyc-service-core/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── config/
│   │   └── index.ts
│   │
│   ├── common/
│   │   ├── middleware/
│   │   └── exceptions/
│   │
│   ├── core/
│   │   ├── prisma/
│   │   │   └── prisma.service.ts
│   │   └── redis/
│   │       └── redis.service.ts
│   │
│   ├── modules/
│   │   ├── providers/
│   │   │   ├── providers.controller.ts
│   │   │   ├── providers.service.ts
│   │   │   ├── providers.repository.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-provider.dto.ts
│   │   │   │   └── update-provider.dto.ts
│   │   │   └── providers.module.ts
│   │   │
│   │   ├── catalogue/
│   │   │   ├── catalogue.controller.ts
│   │   │   ├── catalogue.service.ts
│   │   │   ├── catalogue.repository.ts
│   │   │   ├── dto/
│   │   │   └── catalogue.module.ts
│   │   │
│   │   └── addons/
│   │       ├── addons.controller.ts
│   │       ├── addons.service.ts
│   │       ├── addons.repository.ts
│   │       ├── dto/
│   │       └── addons.module.ts
│   │
│   └── auth/
│       ├── auth.middleware.ts
│       └── jwt.strategy.ts
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 5. Coding Standards and Critical Rules

### A. Core Standards
1.  **Language & Runtime:** TypeScript 5.x, Node.js 20.x (LTS).
2.  **Code Style & Formatting:** ESLint and Prettier with a shared project configuration.

### B. Naming Conventions
| Element Type | Convention | Example |
| :--- | :--- | :--- |
| Module Folder | `kebab-case` | `service-catalogue` |
| Controller File | `*.controller.ts` | `providers.controller.ts` |
| Service File | `*.service.ts` | `providers.service.ts` |
| Repository File | `*.repository.ts` | `providers.repository.ts` |
| DTO File | `*.dto.ts` | `create-provider.dto.ts` |
| Class Names | `PascalCase` | `ProvidersService` |
| Interface Names | `PascalCase` with `I` prefix | `IProvider` |
| Function/Method Names | `camelCase` | `getProviderById` |
| Variable Names | `camelCase` | `activeProvider` |

### C. Critical Implementation Rules
1.  **Strict Separation of Concerns:** Adhere to the Controller -> Service -> Repository pattern.
2.  **Dependency Injection (DI) is Mandatory:** Never manually instantiate services or repositories.
3.  **DTOs for All Input:** All `POST`/`PUT` endpoints must use DTOs with validation.
4.  **Centralized Configuration:** Access environment variables only through a dedicated `ConfigService`.
5.  **Structured Error Handling:** Use a global exception filter and custom exceptions.

### D. Security Mandates
1.  **No Raw SQL:** Use Prisma Client methods exclusively.
2.  **Validate All Input:** All external data must be validated via DTOs.
3.  **Do Not Log Sensitive Information:** Avoid logging PII, passwords, or API keys.

### E. Testing Requirements
1.  **Unit Tests are Required:** Every Service and Repository must have a corresponding `*.spec.ts` file.
2.  **Test Pattern:** Follow the Arrange-Act-Assert (AAA) pattern.
