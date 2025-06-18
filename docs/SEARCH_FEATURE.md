# Enhanced Search Feature Documentation

## Overview

The enhanced search feature provides powerful and flexible querying capabilities across all entities in the Sokoke Planner API. It supports filtering, pagination, sorting, text search, and advanced query options.

## Key Features

- **Flexible Filtering**: Filter by any entity properties
- **Pagination**: Efficient pagination with metadata
- **Sorting**: Multi-field sorting with configurable order
- **Text Search**: Full-text search across specified fields
- **Date Range Filtering**: Query entities within date ranges
- **Numeric Range Filtering**: Filter by numeric value ranges
- **Field Selection**: Return only specific fields
- **Population**: Automatically populate referenced entities
- **Performance Optimization**: Efficient MongoDB queries with indexing support

## TSearch Type Interface

```typescript
type TSearch<T> = {
    filters?: Partial<T>;
    pagination?: {
        page: number;        // 1-based page number
        limit: number;       // Max 100 items per page
    };
    sort?: {
        field: keyof T;      // Field to sort by
        order: 'asc' | 'desc'; // Sort direction
    }[];
    search?: {
        query: string;       // Search query string
        fields?: (keyof T)[]; // Fields to search in
        options?: {
            caseSensitive?: boolean;
            useRegex?: boolean;
            fuzzyTolerance?: number; // 0-1
        };
    };
    advanced?: {
        dateRange?: {
            field: keyof T;
            start?: Date;
            end?: Date;
        }[];
        numericRange?: {
            field: keyof T;
            min?: number;
            max?: number;
        }[];
        includeDeleted?: boolean;
        select?: (keyof T)[];     // Select specific fields
        populate?: (keyof T)[];   // Populate references
    };
} | undefined;
```

## TSearchResult Type Interface

```typescript
type TSearchResult<T> = {
    items: T[];              // Array of found items
    metadata: {
        total: number;       // Total items found
        page: number;        // Current page
        limit: number;       // Items per page
        totalPages: number;  // Total pages available
        hasMore: boolean;    // Whether more pages exist
        searchTime?: number; // Execution time in ms
    };
};
```

## Usage Examples

### Basic Usage

#### Simple Filtering
```typescript
const searchParams: TSearch<TProject> = {
    filters: {
        completed: false,
        priority: 5
    }
};

const result = await projectDAO.readAll(searchParams);
console.log(`Found ${result.metadata.total} projects`);
```

#### Pagination
```typescript
const searchParams: TSearch<TProject> = {
    pagination: {
        page: 1,
        limit: 10
    }
};

const result = await projectDAO.readAll(searchParams);
// Returns first 10 projects with metadata
```

#### Sorting
```typescript
const searchParams: TSearch<TProject> = {
    sort: [
        { field: 'priority', order: 'desc' },
        { field: 'updatedAt', order: 'desc' }
    ]
};

const result = await projectDAO.readAll(searchParams);
// Projects sorted by priority (high to low), then by updatedAt
```

### Advanced Usage

#### Text Search
```typescript
const searchParams: TSearch<TProject> = {
    search: {
        query: 'mobile app development',
        fields: ['name', 'description', 'impactDescription'],
        options: {
            caseSensitive: false,
            useRegex: false
        }
    },
    pagination: { page: 1, limit: 20 }
};

const result = await projectDAO.readAll(searchParams);
// Search for "mobile app development" in name, description, and impact description
```

#### Date Range Filtering
```typescript
const searchParams: TSearch<TProject> = {
    advanced: {
        dateRange: [{
            field: 'startDate',
            start: new Date('2024-01-01'),
            end: new Date('2024-12-31')
        }]
    },
    sort: [{ field: 'startDate', order: 'asc' }]
};

const result = await projectDAO.readAll(searchParams);
// Projects starting in 2024, sorted by start date
```

#### Numeric Range Filtering
```typescript
const searchParams: TSearch<TProject> = {
    advanced: {
        numericRange: [{
            field: 'priority',
            min: 7,
            max: 10
        }]
    }
};

const result = await projectDAO.readAll(searchParams);
// High priority projects (7-10)
```

#### Field Selection and Population
```typescript
const searchParams: TSearch<TProject> = {
    advanced: {
        select: ['name', 'description', 'status', 'priority'],
        populate: ['status', 'category']
    },
    pagination: { page: 1, limit: 50 }
};

const result = await projectDAO.readAll(searchParams);
// Returns only selected fields with status and category populated
```

#### Complex Combined Search
```typescript
const searchParams: TSearch<TProject> = {
    filters: {
        completed: false
    },
    search: {
        query: 'API development',
        fields: ['name', 'description']
    },
    advanced: {
        numericRange: [{
            field: 'priority',
            min: 5
        }],
        dateRange: [{
            field: 'startDate',
            start: new Date('2024-01-01')
        }]
    },
    sort: [
        { field: 'priority', order: 'desc' },
        { field: 'startDate', order: 'asc' }
    ],
    pagination: { page: 1, limit: 25 }
};

const result = await projectDAO.readAll(searchParams);
```

## DAO Methods

### Enhanced readAll Method

All DAOs now implement an enhanced `readAll` method:

```typescript
async readAll(args?: TSearch<T>): Promise<TSearchResult<T>>
```

### Additional Search Methods

Many DAOs provide specialized search methods:

## Performance Considerations

### MongoDB Indexing

For optimal performance, ensure proper indexing on frequently searched fields:

```typescript
// Example MongoDB indexes
db.projects.createIndex({ "name": "text", "description": "text" });
db.projects.createIndex({ "priority": -1, "updatedAt": -1 });
db.projects.createIndex({ "startDate": 1 });
db.projects.createIndex({ "completed": 1, "priority": -1 });
```

### Best Practices

1. **Limit Results**: Always use pagination to limit result sets
2. **Select Fields**: Use field selection to reduce payload size
3. **Index Strategy**: Create compound indexes for common search patterns
4. **Text Search**: Use MongoDB text indexes for better text search performance
5. **Cache Results**: Consider caching frequently accessed search results

## Error Handling

The search service provides comprehensive error handling:

```typescript
try {
    const result = await projectDAO.readAll(searchParams);
    console.log('Search successful:', result.metadata);
} catch (error) {
    console.error('Search failed:', error.message);
    // Handle specific search errors
}
```

## Migration Guide

### From Previous Implementation

The enhanced search feature is backward compatible. Previous simple array returns are now wrapped in the `TSearchResult` structure:

```typescript
// Previous implementation
const projects: TProject[] = await projectDAO.readAll();

// New implementation
const result: TSearchResult<TProject> = await projectDAO.readAll();
const projects: TProject[] = result.items;
const totalCount = result.metadata.total;
```

### Updating Controllers

Controllers should be updated to handle the new return format:

```typescript
// Previous controller method
@Get()
async getAllProjects(@Query() search?: TSearch<TProject>) {
    return await this.projectDAO.readAll(search);
}

// Updated controller method
@Get()
async getAllProjects(@Query() search?: TSearch<TProject>) {
    const result = await this.projectDAO.readAll(search);
    return {
        data: result.items,
        meta: result.metadata
    };
}
```

## TypeScript Integration

The search feature provides full TypeScript support with:

- **Type Safety**: All search parameters are type-checked
- **IntelliSense**: Auto-completion for entity fields
- **Generic Support**: Works with any entity type
- **Compile-Time Validation**: Catch errors at build time

## Testing

Example test cases for the enhanced search:

```typescript
describe('Enhanced Search', () => {
    it('should filter projects by completion status', async () => {
        const result = await projectDAO.readAll({
            filters: { completed: false }
        });
        
        expect(result.items.every(p => !p.completed)).toBe(true);
        expect(result.metadata.total).toBeGreaterThan(0);
    });

    it('should paginate results correctly', async () => {
        const result = await projectDAO.readAll({
            pagination: { page: 1, limit: 5 }
        });
        
        expect(result.items.length).toBeLessThanOrEqual(5);
        expect(result.metadata.page).toBe(1);
        expect(result.metadata.limit).toBe(5);
    });
});
```
