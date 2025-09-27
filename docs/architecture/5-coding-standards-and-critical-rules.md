# 5. Coding Standards and Critical Rules

## A. Core Standards
1.  **Language & Runtime:** TypeScript 5.x, Node.js 20.x (LTS).
2.  **Code Style & Formatting:** ESLint and Prettier with a shared project configuration.

## B. Naming Conventions
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

## C. Critical Implementation Rules
1.  **Strict Separation of Concerns:** Adhere to the Controller -> Service -> Repository pattern.
2.  **Dependency Injection (DI) is Mandatory:** Never manually instantiate services or repositories.
3.  **DTOs for All Input:** All `POST`/`PUT` endpoints must use DTOs with validation.
4.  **Centralized Configuration:** Access environment variables only through a dedicated `ConfigService`.
5.  **Structured Error Handling:** Use a global exception filter and custom exceptions.

## D. Security Mandates
1.  **No Raw SQL:** Use Prisma Client methods exclusively.
2.  **Validate All Input:** All external data must be validated via DTOs.
3.  **Do Not Log Sensitive Information:** Avoid logging PII, passwords, or API keys.

## E. Testing Requirements
1.  **Unit Tests are Required:** Every Service and Repository must have a corresponding `*.spec.ts` file.
2.  **Test Pattern:** Follow the Arrange-Act-Assert (AAA) pattern.
