# 2. REST API Specification (Revised for Auth-Disabled Development)

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
