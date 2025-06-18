# Search Implementation

This folder contains the enhanced search functionality for the Sokoke Planner API.

## Files

### `types/search.type.ts`
- **TSearch<T>**: Main search interface supporting filtering, pagination, sorting, text search, and advanced options
- **TSearchResult<T>**: Standardized response format with items and metadata
- Full TypeScript support with generic types

### `services/search.service.ts`
- **SearchService**: Utility class for MongoDB search operations
- **buildMongoQuery()**: Converts TSearch parameters to MongoDB queries
- **executeSearch()**: Executes search with metadata collection
- **buildAggregationPipeline()**: Creates aggregation pipelines for complex queries

## Key Features

- **Type Safety**: Full TypeScript support with compile-time validation
- **Performance**: Optimized MongoDB queries with proper indexing
- **Flexibility**: Supports any entity type through generics
- **Metadata**: Rich search metadata including execution time and pagination info
- **Text Search**: Full-text search capabilities across specified fields
- **Advanced Filtering**: Date ranges, numeric ranges, field selection, and population

## Usage in DAOs

All DAOs use the SearchService for consistent search implementation:

```typescript
async readAll(args?: TSearch<TEntity>): Promise<TSearchResult<TEntity>> {
    return await SearchService.executeSearch(
        this._model,
        args,
        transformerFunction
    );
}
```

## Performance Considerations

1. Always use pagination to limit result sets
2. Create appropriate MongoDB indexes for searched fields
3. Use field selection to reduce payload size
4. Consider caching for frequently accessed search results

For detailed documentation, see `/docs/SEARCH_FEATURE.md`.
