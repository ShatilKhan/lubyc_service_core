# Lubyc Service Core API Testing Guide

## Overview
This guide provides comprehensive instructions for testing the Lubyc Service Core API, including setup, workflow examples, and troubleshooting.

## Base URL
- **Local Development**: `http://localhost:3003`
- **API Documentation**: `http://localhost:3003/api-docs`
- **API Base Path**: `/api/v1/services`

## Authentication
Currently, authentication is disabled for development. All endpoints use a default userId of 1.

## Testing Workflow

### Step 1: Create a Service Provider
Start by creating a provider profile that will offer services.

#### Minimal Provider Creation
```bash
curl -X POST http://localhost:3003/api/v1/services/providers \
  -H "Content-Type: application/json" \
  -d '{
    "serviceTypeId": 1
  }'
```

#### Complete Provider Setup
```bash
curl -X POST http://localhost:3003/api/v1/services/providers \
  -H "Content-Type: application/json" \
  -d '{
    "serviceTypeId": 3,
    "lat": "40.7128",
    "lng": "-74.0060",
    "advancePayType": "percent",
    "advanceValue": 25,
    "hasCancellation": true,
    "cancellationTime": 1440,
    "capacity": 3
  }'
```

**Expected Response:**
```json
{
  "id": "1",
  "userId": "1",
  "serviceTypeId": "3",
  "lat": "40.7128",
  "lng": "-74.0060",
  "geoRadius": 10,
  "advancePayType": "percent",
  "advanceValue": 25,
  "hasCancellation": 1,
  "cancellationTime": 1440,
  "capacity": 3,
  "status": 0,
  "createdAt": "2025-09-29T10:00:00.000Z"
}
```

### Step 2: Set Business Hours
Configure operating hours for each day of the week.

#### Add Monday-Friday Schedule
```bash
curl -X POST http://localhost:3003/api/v1/services/providers/1/business-hours \
  -H "Content-Type: application/json" \
  -d '{
    "dayOfWeek": 1,
    "openTime": "09:00",
    "closeTime": "17:00",
    "isClosed": false
  }'
```

#### Set Sunday as Closed
```bash
curl -X POST http://localhost:3003/api/v1/services/providers/1/business-hours \
  -H "Content-Type: application/json" \
  -d '{
    "dayOfWeek": 0,
    "isClosed": true,
    "openTime": "00:00",
    "closeTime": "00:00"
  }'
```

### Step 3: Add Services to Catalogue
Add services that the provider offers.

#### Basic Service
```bash
curl -X POST http://localhost:3003/api/v1/services/api/v1/services/providers/1/catalogue \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Basic Haircut",
    "price": 25.00,
    "duration": 30,
    "durationType": "minute"
  }'
```

#### Premium Service with Full Details
```bash
curl -X POST http://localhost:3003/api/v1/services/api/v1/services/providers/1/catalogue \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Premium Hair Styling Package",
    "description": "Complete hair styling service including wash, cut, style, and treatment",
    "price": 75.00,
    "isPriceRange": 1,
    "rangePrice": 150.00,
    "duration": 2,
    "durationType": "hour",
    "currency": "USD",
    "serveCapacity": 1,
    "image": "https://example.com/service-image.jpg"
  }'
```

### Step 4: Search for Services
Search for services using various filters.

#### Search by Location
```bash
curl -X GET "http://localhost:3003/api/v1/services/api/v1/services/search/services?lat=40.7128&lng=-74.0060"
```

#### Search by Service Type
```bash
curl -X GET "http://localhost:3003/api/v1/services/api/v1/services/search/services?serviceTypeId=3"
```

#### Combined Search
```bash
curl -X GET "http://localhost:3003/api/v1/services/api/v1/services/search/services?serviceTypeId=3&lat=40.7128&lng=-74.0060&keyword=premium"
```

#### Keyword Search
```bash
curl -X GET "http://localhost:3003/api/v1/services/api/v1/services/search/services?keyword=haircut"
```

**Expected Search Response:**
```json
[
  {
    "id": "1",
    "title": "Premium Hair Styling Package",
    "description": "Complete hair styling service",
    "price": 75.00,
    "duration": 2,
    "durationType": "hour",
    "currency": "USD",
    "serviceProviderId": "1",
    "provider": {
      "id": "1",
      "serviceTypeId": "3",
      "lat": "40.7128",
      "lng": "-74.0060",
      "geoRadius": 10,
      "distance": 0.5,
      "serviceType": {
        "id": "3",
        "name": "Hair Salon",
        "description": "Professional hair styling services"
      }
    }
  }
]
```

### Step 5: Update Service Details
Modify existing service information.

```bash
curl -X PUT http://localhost:3003/api/v1/services/api/v1/services/providers/1/catalogue/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 80.00,
    "description": "Updated premium service with new features"
  }'
```

### Step 6: Manage Provider Settings
Update provider configuration.

```bash
curl -X PUT http://localhost:3003/api/v1/services/providers/1 \
  -H "Content-Type: application/json" \
  -d '{
    "capacity": 5,
    "hasCancellation": true,
    "cancellationTime": 2880
  }'
```

## Data Types and Validation

### Service Types
- `1` - Barber Shop
- `2` - Spa
- `3` - Hair Salon
- (Add more as configured in your database)

### Duration Types
- `minute` - Duration in minutes
- `hour` - Duration in hours

### Day of Week
- `0` - Sunday
- `1` - Monday
- `2` - Tuesday
- `3` - Wednesday
- `4` - Thursday
- `5` - Friday
- `6` - Saturday

### Advance Pay Types
- `percent` - Percentage of service price
- `amount` - Fixed amount

## Field Validations

### Coordinates
- **Latitude**: -90 to 90
- **Longitude**: -180 to 180

### Numeric Fields
- **serviceTypeId**: Positive integer
- **capacity**: Minimum 1
- **advanceValue**: Minimum 0
- **price**: Positive decimal
- **duration**: Positive integer

### Time Format
- **openTime/closeTime**: "HH:MM" format (24-hour)

## Common Issues and Troubleshooting

### Issue: "Provider not found"
**Solution**: Ensure the provider ID exists and is not deleted. Check with:
```bash
curl -X GET http://localhost:3003/api/v1/services/providers/1
```

### Issue: "Invalid coordinates"
**Solution**: Ensure latitude is between -90 and 90, longitude between -180 and 180.

### Issue: "serviceTypeId must be a positive number"
**Solution**: Provide a valid positive integer for serviceTypeId.

### Issue: Search returns empty results
**Possible Causes**:
- No services match the search criteria
- Provider is marked as deleted
- Services are outside the geoRadius when searching by location

### Issue: Database connection error
**Solution**:
1. Ensure PostgreSQL is running
2. Check `.env` file has correct `DATABASE_URL`
3. Run `npx prisma db push` to ensure schema is synced

## Testing with Swagger UI

1. Open browser to `http://localhost:3003/api-docs`
2. Click on any endpoint to expand
3. Click "Try it out" button
4. Select an example from the dropdown or modify the request
5. Click "Execute" to send the request
6. View the response below

## Environment Variables

Create a `.env` file with:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/lubyc_service_core"
PORT=3003
```

## Postman Collection

Import the collection from `postman/lubyc-service-core.postman_collection.json` for pre-configured requests with examples.

## Health Check

Verify the API is running:
```bash
curl http://localhost:3003/api/v1/services/providers/user/1
```

## Rate Limiting

Currently no rate limiting is implemented. In production, consider adding rate limiting middleware.

## Support

For issues or questions:
- Check the API documentation at `/api-docs`
- Review error messages in responses
- Check application logs with `npm run start:dev`