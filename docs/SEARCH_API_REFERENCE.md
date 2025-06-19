# Search and Filtering API Documentation

This document describes the enhanced search and filtering capabilities available across all `readAll` endpoints in the Sokoke Planner API.

## Overview

All collection endpoints (GET /resource) now support advanced search, filtering, pagination, and sorting capabilities through query parameters. This provides a consistent and powerful interface for retrieving data across all resources.

## Base URL Structure

```
GET /api/{resource}?{search_parameters}
```

## Universal Query Parameters

### Pagination

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number (1-based) |
| `limit` | number | 10 | Items per page (max: 100) |

**Examples:**
```http
GET /api/project?page=2&limit=25
GET /api/task?limit=50
```

### Sorting

| Parameter | Type | Format | Description |
|-----------|------|---------|-------------|
| `sort` | string | `field:order` | Sort by field(s). Multiple sorts separated by comma |

**Format:** `field:order[,field2:order2]`
**Order:** `asc` (ascending) or `desc` (descending)

**Examples:**
```http
GET /api/project?sort=name:asc
GET /api/task?sort=priority:desc,dueDate:asc
GET /api/feature?sort=createdAt:desc
```

### Text Search

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search query string |
| `searchFields` | string | Comma-separated fields to search in |
| `caseSensitive` | boolean | Case-sensitive search (default: false) |
| `useRegex` | boolean | Use regex patterns (default: false) |

**Examples:**
```http
GET /api/project?search=e-commerce
GET /api/task?search=bug&searchFields=title,description
GET /api/feature?search=API&caseSensitive=true
GET /api/project?search=^test.*&useRegex=true
```

### Date Range Filtering

| Parameter | Type | Format | Description |
|-----------|------|---------|-------------|
| `dateFrom` | string | ISO 8601 | Start date for range filter |
| `dateTo` | string | ISO 8601 | End date for range filter |
| `dateField` | string | field name | Field to apply date range (default: createdAt) |

**Examples:**
```http
GET /api/project?dateFrom=2024-01-01&dateTo=2024-12-31
GET /api/task?dateFrom=2024-06-01&dateField=dueDate
```

### Numeric Range Filtering

| Parameter | Type | Description |
|-----------|------|-------------|
| `numMin` | number | Minimum value |
| `numMax` | number | Maximum value |
| `numField` | string | Field to apply numeric range |

**Examples:**
```http
GET /api/project?numMin=100&numMax=5000&numField=budget
GET /api/task?numMin=1&numMax=3&numField=priority
```

### Advanced Options

| Parameter | Type | Description |
|-----------|------|-------------|
| `select` | string | Comma-separated fields to return |
| `populate` | string | Comma-separated fields to populate |
| `includeDeleted` | boolean | Include soft-deleted items |

**Examples:**
```http
GET /api/project?select=id,name,status
GET /api/task?populate=project,assignedUser
GET /api/project?includeDeleted=true
```

## Resource-Specific Filters

Each resource supports specific filter parameters based on their properties:

### Projects (/api/project)

| Filter | Type | Description |
|--------|------|-------------|
| `status` | string | Project status |
| `categoryId` | string | Category ID |
| `subCategoryId` | string | Subcategory ID |
| `priority` | number | Priority level |
| `isActive` | boolean | Active status |
| `ownerId` | string | Owner/creator ID |
| `assignedTo` | string | Assigned user ID |
| `tags` | string | Project tags |
| `budget` | number | Project budget |
| `progress` | number | Progress percentage |

### Features (/api/feature)

| Filter | Type | Description |
|--------|------|-------------|
| `projectId` | string | Parent project ID |
| `status` | string | Feature status |
| `priority` | number | Priority level |
| `categoryId` | string | Category ID |
| `isActive` | boolean | Active status |
| `createdBy` | string | Creator ID |
| `assignedTo` | string | Assigned user ID |
| `tags` | string | Feature tags |
| `type` | string | Feature type |

### Tasks (/api/task)

| Filter | Type | Description |
|--------|------|-------------|
| `parentId` | string | Parent (project/feature) ID |
| `parentType` | string | Parent type (project, feature) |
| `status` | string | Task status |
| `priority` | number | Priority level |
| `assignedTo` | string | Assigned user ID |
| `isCompleted` | boolean | Completion status |
| `tags` | string | Task tags |
| `categoryId` | string | Category ID |
| `projectId` | string | Project ID |
| `featureId` | string | Feature ID |

### Requirements (/api/requeriment)

| Filter | Type | Description |
|--------|------|-------------|
| `projectId` | string | Project ID |
| `status` | string | Requirement status |
| `priority` | number | Priority level |
| `type` | string | Requirement type |
| `isActive` | boolean | Active status |
| `assignedTo` | string | Assigned user ID |
| `categoryId` | string | Category ID |

### Users (/api/user)

| Filter | Type | Description |
|--------|------|-------------|
| `isActive` | boolean | Active status |
| `role` | string | User role |
| `isVerified` | boolean | Verification status |
| `department` | string | Department |
| `status` | string | User status |

### Statuses (/api/status)

| Filter | Type | Description |
|--------|------|-------------|
| `parentId` | string | Parent ID |
| `parentType` | string | Parent type |
| `isActive` | boolean | Active status |
| `isDefault` | boolean | Default status |
| `order` | number | Display order |
| `color` | string | Status color |

### Categories (/api/project-category, /api/project-sub-category)

| Filter | Type | Description |
|--------|------|-------------|
| `isActive` | boolean | Active status |
| `parentId` | string | Parent category ID |
| `projectCategoryId` | string | Parent category ID (for subcategories) |
| `order` | number | Display order |
| `color` | string | Category color |
| `icon` | string | Category icon |

## Complex Query Examples

### 1. Project Search with Multiple Filters
```http
GET /api/project?search=website&page=1&limit=20&sort=priority:desc&status=active&categoryId=64a7b8c9d2e3f4a5b6c7d8e9&dateFrom=2024-01-01&select=id,name,status,priority
```

### 2. Task Management Dashboard
```http
GET /api/task?assignedTo=64a7b8c9d2e3f4a5b6c7d8ea&status=in-progress&sort=priority:desc,dueDate:asc&page=1&limit=25
```

### 3. Feature Planning
```http
GET /api/feature?projectId=64a7b8c9d2e3f4a5b6c7d8eb&search=authentication&searchFields=name,description&sort=priority:desc&select=id,name,priority,status
```

### 4. User Management
```http
GET /api/user?search=john&searchFields=name,email&isActive=true&role=developer&sort=name:asc
```

### 5. Historical Data Analysis
```http
GET /api/project?dateFrom=2024-01-01&dateTo=2024-06-30&dateField=endDate&status=completed&select=id,name,endDate,budget&sort=endDate:desc
```

## Response Format

All search endpoints return a standardized response format:

```json
{
  "success": true,
  "message": "Resources retrieved successfully",
  "data": [
    {
      // Resource objects
    }
  ],
  "metadata": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8,
    "hasMore": true,
    "searchTime": 45
  }
}
```

## Error Handling

### Invalid Parameters
```json
{
  "success": false,
  "message": "Invalid query parameters",
  "error": {
    "code": "INVALID_PARAMETERS",
    "details": "Invalid date format for dateFrom parameter"
  }
}
```

### Security Restrictions
```json
{
  "success": false,
  "message": "Unauthorized filter field",
  "error": {
    "code": "SECURITY_VIOLATION",
    "details": "Filter field 'password' is not allowed"
  }
}
```

## Performance Considerations

1. **Pagination Limits**: Maximum 100 items per page
2. **Search Optimization**: Use specific `searchFields` for better performance
3. **Index Usage**: Date and status fields are indexed for faster queries
4. **Caching**: Frequently used queries may be cached
5. **Rate Limiting**: Search endpoints may have rate limits

## Security Features

1. **Field Allowlisting**: Only predefined fields can be used as filters
2. **Input Sanitization**: All query parameters are sanitized
3. **Access Control**: Authentication required for all endpoints
4. **Audit Logging**: Search queries are logged for security monitoring

## Implementation Notes

- All search functionality is implemented using the `transformQueryToSearch` utility
- The `TSearch` type provides type safety for search parameters
- MongoDB query optimization is handled by the `SearchService`
- Field validation prevents SQL injection and unauthorized data access

## Migration Guide

### For Existing API Consumers

No changes required for basic usage. Enhanced functionality is available through query parameters:

**Before:**
```http
GET /api/project
```

**After (enhanced):**
```http
GET /api/project?page=1&limit=10&sort=name:asc&status=active
```

### For Developers

1. Import the search utility:
```typescript
import { transformQueryToSearch, SearchQueryParams } from '@src/shared/utils/search.util';
```

2. Update method parameters:
```typescript
async readAll(@Query() query: SearchQueryParams)
```

3. Transform query parameters:
```typescript
const searchArgs: TSearch<T> = transformQueryToSearch<T>(query, allowedFilterFields);
```

## Testing Examples

### Basic Search Test
```http
GET /api/project?search=test&page=1&limit=5
```

### Advanced Filter Test
```http
GET /api/task?parentType=project&status=active&priority=1&sort=dueDate:asc&dateFrom=2024-01-01
```

### Complex Query Test
```http
GET /api/feature?search=api&searchFields=name,description&projectId=123&page=2&limit=25&sort=priority:desc&select=id,name,status
```
