# Technical Assumptions

*   **Repository Structure:** Monorepo (assumed for ease of potential future integration with other Lubyc services).
*   **Service Architecture:** The module will be built as a self-contained, containerized (Docker) microservice.
*   **Backend Technology:** Node.js with TypeScript, using a modern framework like NestJS or Express.
*   **Database:** PostgreSQL, accessed via the Prisma ORM.
*   **Caching:** Redis will be used for caching frequently accessed data like service pages and templates.
*   **API Style:** A RESTful API will be exposed, with its contract defined by an OpenAPI 3.0 (Swagger) specification.
