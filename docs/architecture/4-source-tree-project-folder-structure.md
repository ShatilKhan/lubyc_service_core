# 4. Source Tree (Project Folder Structure)

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
