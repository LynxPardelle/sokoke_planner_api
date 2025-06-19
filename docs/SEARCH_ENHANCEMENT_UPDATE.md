# API Reference Update - Search Enhancement

## Overview

The Sokoke Planner API has been enhanced with comprehensive search and filtering capabilities across all collection endpoints. This update provides a unified, powerful interface for querying data with advanced filtering, pagination, sorting, and text search features.

## Added Components

### Search Utility Module

**File:** `src/shared/utils/search.util.ts`

#### Functions

##### `transformQueryToSearch<T>(queryParams, allowedFilterFields?): TSearch<T>`

Transforms HTTP query parameters into a TSearch object for use with services.

**Parameters:**
- `queryParams: SearchQueryParams` - Raw HTTP query parameters
- `allowedFilterFields?: string[]` - Optional array of allowed filter field names

**Returns:** `TSearch<T> | undefined`

##### `getSearchExamples(): { [key: string]: string }`

Returns a comprehensive list of example query parameters for documentation.

#### Types

##### `SearchQueryParams`

Interface representing HTTP query parameters for search operations.

```typescript
interface SearchQueryParams {
  // Pagination
  page?: string | number;
  limit?: string | number;
  
  // Sorting
  sort?: string;
  
  // Text search
  search?: string;
  searchFields?: string;
  caseSensitive?: string | boolean;
  useRegex?: string | boolean;
  fuzzyTolerance?: string | number;
  
  // Date range filters
  dateFrom?: string;
  dateTo?: string;
  dateField?: string;
  
  // Numeric range filters
  numMin?: string | number;
  numMax?: string | number;
  numField?: string;
  
  // Advanced options
  includeDeleted?: string | boolean;
  select?: string;
  populate?: string;
  
  // Generic filters
  [key: string]: any;
}
```

## Enhanced Controllers

All `readAll` methods in the following controllers have been updated:

### Updated Controllers List

1. **FeatureController** (`/feature`)
2. **TaskController** (`/task`)
3. **ProjectController** (`/project`)
4. **StatusController** (`/status`)
5. **RequerimentController** (`/requeriment`)
6. **ProjectCategoryController** (`/project-category`)
7. **ProjectSubCategoryController** (`/project-sub-category`)
8. **UserController** (`/user`)

### Enhanced Method Signature

```typescript
@Get('')
async readAll(@Query() query: SearchQueryParams) {
  this._loggerService.info('ControllerName.readAll', 'ControllerName');
  
  const allowedFilterFields = [
    // Resource-specific allowed fields
  ];
  
  const searchArgs: TSearch<T> = transformQueryToSearch<T>(
    query, 
    allowedFilterFields
  );
  
  return await this._service.readAll(searchArgs);
}
```

### Controller-Specific Allowed Filter Fields

#### FeatureController
```typescript
const allowedFilterFields = [
  'projectId', 'status', 'priority', 'categoryId', 'isActive', 
  'createdBy', 'assignedTo', 'tags', 'type'
];
```

#### TaskController
```typescript
const allowedFilterFields = [
  'parentId', 'parentType', 'status', 'priority', 'assignedTo', 
  'isCompleted', 'tags', 'categoryId', 'projectId', 'featureId'
];
```

#### ProjectController
```typescript
const allowedFilterFields = [
  'status', 'categoryId', 'subCategoryId', 'priority', 'isActive', 
  'ownerId', 'assignedTo', 'tags', 'budget', 'progress'
];
```

#### StatusController
```typescript
const allowedFilterFields = [
  'parentId', 'parentType', 'isActive', 'isDefault', 'order', 'color'
];
```

#### RequerimentController
```typescript
const allowedFilterFields = [
  'projectId', 'status', 'priority', 'type', 'isActive', 'assignedTo', 'categoryId'
];
```

#### ProjectCategoryController
```typescript
const allowedFilterFields = [
  'isActive', 'parentId', 'order', 'color', 'icon'
];
```

#### ProjectSubCategoryController
```typescript
const allowedFilterFields = [
  'projectCategoryId', 'isActive', 'order', 'color', 'icon'
];
```

#### UserController
```typescript
const allowedFilterFields = [
  'isActive', 'role', 'isVerified', 'department', 'status'
];
```

## Documentation Standards

Each enhanced `readAll` method includes:

- **Comprehensive JSDoc documentation**
- **Route specification**
- **Parameter descriptions**
- **Example usage patterns**
- **Available query parameters list**
- **Security considerations**

### Example Documentation Pattern

```typescript
/**
 * Get all resources with advanced search and filtering options
 * 
 * @route GET /resource
 * @param {SearchQueryParams} query - Search and filter parameters
 * @returns {Promise<TRepositoryResponse<TResource[]>>} Array of resources with metadata
 * 
 * Available query parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 100)
 * - sort: Sort fields (e.g., "name:asc,createdAt:desc")
 * - search: Text search query
 * - searchFields: Fields to search in
 * - [resource-specific filters]
 */
```

## Breaking Changes

⚠️ **Note:** These changes are **backwards compatible**. Existing API calls without query parameters will continue to work as before.

## Migration Guide

### For API Consumers

No migration required for basic usage. Enhanced functionality is available through query parameters:

**Before:**
```http
GET /api/project
```

**After (with enhancements):**
```http
GET /api/project?page=1&limit=10&sort=name:asc&status=active
```

### For Developers

To use the new search functionality in additional controllers:

1. **Import the search utility:**
```typescript
import { transformQueryToSearch, SearchQueryParams } from '@src/shared/utils/search.util';
```

2. **Update method signature:**
```typescript
async readAll(@Query() query: SearchQueryParams)
```

3. **Define allowed filter fields:**
```typescript
const allowedFilterFields = ['field1', 'field2', 'field3'];
```

4. **Transform query parameters:**
```typescript
const searchArgs: TSearch<T> = transformQueryToSearch<T>(query, allowedFilterFields);
```

## Query Parameter Categories

### Universal Parameters
- **Pagination:** `page`, `limit`
- **Sorting:** `sort`
- **Text Search:** `search`, `searchFields`, `caseSensitive`, `useRegex`
- **Date Range:** `dateFrom`, `dateTo`, `dateField`
- **Numeric Range:** `numMin`, `numMax`, `numField`
- **Advanced:** `select`, `populate`, `includeDeleted`

### Resource-Specific Filters
Each controller defines its own set of allowed filter fields based on the resource properties.

## Security Features

1. **Field Allowlisting:** Only predefined fields can be used as filters
2. **Input Sanitization:** All query parameters are sanitized and validated
3. **Type Safety:** TypeScript interfaces ensure type safety
4. **Access Control:** Authentication required for all endpoints

## Performance Optimizations

1. **Pagination Limits:** Maximum 100 items per page
2. **Query Optimization:** Efficient database queries
3. **Index Usage:** Optimized for common search patterns
4. **Caching:** Ready for query result caching

## Testing

### Example Test Cases

#### Basic Search
```http
GET /api/project?search=test&page=1&limit=5
```

#### Advanced Filtering
```http
GET /api/task?parentType=project&status=active&priority=1&sort=dueDate:asc
```

#### Complex Query
```http
GET /api/feature?search=api&searchFields=name,description&projectId=123&page=2&limit=25&sort=priority:desc
```

## Error Handling

The enhanced endpoints include proper error handling for:
- Invalid query parameters
- Unauthorized filter fields
- Malformed date/numeric values
- Pagination boundary errors

## Future Enhancements

The search utility is designed to be extensible for future enhancements such as:
- Advanced text search algorithms
- Geographic filtering
- Custom aggregation functions
- Real-time search suggestions

## Documentation Files

- **Search API Reference:** `docs/SEARCH_API_REFERENCE.md`
- **Implementation Guide:** Available in controller JSDoc comments
- **Type Definitions:** `src/shared/utils/search.util.ts`

## Version Information

- **Feature Version:** 1.0.0
- **Implementation Date:** 2025-06-19
- **Backwards Compatibility:** Full
- **Breaking Changes:** None
