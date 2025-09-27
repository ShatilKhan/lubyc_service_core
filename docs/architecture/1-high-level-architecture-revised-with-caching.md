# 1. High-Level Architecture (Revised with Caching)

This section defines the overall structure of the system, its boundaries, and how it interacts with the existing Lubyc ecosystem.

## Technical Summary

We will architect the **Service Core Module** as a self-contained, Dockerized **Node.js (TypeScript)** application. It will expose a comprehensive **RESTful API** to be consumed by the Lubyc frontend or other clients. The service will be stateless to support horizontal scaling. A **Redis** in-memory cache will be implemented to optimize read performance for frequently accessed data like service pages and templates. All data persistence will be managed via the **Prisma ORM** to a dedicated **PostgreSQL** database. For integration, the module will communicate with existing Lubyc services (Auth, HRM, Calendar) via their respective APIs, treating them as external dependencies.

## System Context Diagram

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

## Caching Strategy

*   **What We Will Cache:**
    *   Public Service Pages
    *   Service Templates & Categories
    *   Provider Service Lists
*   **Cache Invalidation:**
    1.  **Time-To-Live (TTL):** Data expires after a set period (e.g., 15-60 minutes).
    2.  **Event-Driven Invalidation:** Explicitly delete cache keys when underlying data is updated.
