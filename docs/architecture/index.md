# Lubyc Service Core Architecture Document

## Table of Contents

- [Lubyc Service Core Architecture Document](#table-of-contents)
  - [1. High-Level Architecture (Revised with Caching)](./1-high-level-architecture-revised-with-caching.md)
    - [Technical Summary](./1-high-level-architecture-revised-with-caching.md#technical-summary)
    - [System Context Diagram](./1-high-level-architecture-revised-with-caching.md#system-context-diagram)
    - [Caching Strategy](./1-high-level-architecture-revised-with-caching.md#caching-strategy)
  - [2. REST API Specification (Revised for Auth-Disabled Development)](./2-rest-api-specification-revised-for-auth-disabled-development.md)
  - [3. Database Schema and Indexing Strategy](./3-database-schema-and-indexing-strategy.md)
    - [Prisma Schema ()](./3-database-schema-and-indexing-strategy.md#prisma-schema)
    - [Indexing Strategy Summary](./3-database-schema-and-indexing-strategy.md#indexing-strategy-summary)
  - [4. Source Tree (Project Folder Structure)](./4-source-tree-project-folder-structure.md)
  - [5. Coding Standards and Critical Rules](./5-coding-standards-and-critical-rules.md)
    - [A. Core Standards](./5-coding-standards-and-critical-rules.md#a-core-standards)
    - [B. Naming Conventions](./5-coding-standards-and-critical-rules.md#b-naming-conventions)
    - [C. Critical Implementation Rules](./5-coding-standards-and-critical-rules.md#c-critical-implementation-rules)
    - [D. Security Mandates](./5-coding-standards-and-critical-rules.md#d-security-mandates)
    - [E. Testing Requirements](./5-coding-standards-and-critical-rules.md#e-testing-requirements)
