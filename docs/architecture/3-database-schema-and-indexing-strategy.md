# 3. Database Schema and Indexing Strategy

## Prisma Schema (`schema.prisma`)

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

## Indexing Strategy Summary

*   **Foreign Keys:** All foreign key fields are automatically indexed by Prisma.
*   **Geospatial Search:** An index on `[lat, lng]` in `service_providers` for efficient location-based queries.
*   **Text Search:** An index on `title` in `service_catalogue` for fast service searches.
*   **Common Lookups:** Indexes on frequently queried fields like `userId` and `serviceProviderId`.
