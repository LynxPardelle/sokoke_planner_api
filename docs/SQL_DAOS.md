# SQL Database Support

This document explains how to use the SQL database DAOs in the Sokoke Planner API.

## Configuration

The application now supports multiple database types:
- MongoDB (default)
- MySQL
- PostgreSQL
- SQLite

### Environment Variables

Add the following environment variables to configure SQL databases:

```bash
# Database type selection
PERSISTENCE=mysql  # Options: mongodb, mysql, postgres, sqlite

# SQL Database Configuration (for MySQL/PostgreSQL)
SQL_HOST=localhost
SQL_PORT=3306      # 3306 for MySQL, 5432 for PostgreSQL
SQL_USERNAME=your_username
SQL_PASSWORD=your_password
SQL_DATABASE=sokoke_planner

# SQLite Configuration
SQLITE_PATH=./database.sqlite
```

### Example Configurations

#### MySQL
```bash
PERSISTENCE=mysql
SQL_HOST=localhost
SQL_PORT=3306
SQL_USERNAME=root
SQL_PASSWORD=password
SQL_DATABASE=sokoke_planner
```

#### PostgreSQL
```bash
PERSISTENCE=postgres
SQL_HOST=localhost
SQL_PORT=5432
SQL_USERNAME=postgres
SQL_PASSWORD=password
SQL_DATABASE=sokoke_planner
```

#### SQLite
```bash
PERSISTENCE=sqlite
SQLITE_PATH=./data/database.sqlite
```

## Architecture

The application uses a factory pattern to automatically select the appropriate DAO implementation based on the `PERSISTENCE` environment variable:

1. **Factories**: Select the correct DAO implementation
2. **MongoDB DAOs**: For MongoDB operations (existing)
3. **SQL DAOs**: For SQL database operations (new)
4. **TypeORM Entities**: Define the database schema for SQL databases

## Features

### Enhanced Search
All SQL DAOs support the enhanced search interface with:
- Filtering by entity properties
- Text search across multiple fields
- Pagination with metadata
- Sorting by multiple fields
- Date range filtering
- Performance metrics

### Example Usage

```typescript
// Search with filters
const searchResult = await featureRepository.readAll({
  filters: {
    name: 'API',
    completed: false
  },
  pagination: {
    page: 1,
    limit: 10
  },
  sort: [{
    field: 'createdAt',
    order: 'desc'
  }],
  search: {
    query: 'backend',
    fields: ['name', 'description']
  }
});

console.log(searchResult.items); // Array of features
console.log(searchResult.metadata); // Pagination and performance info
```

## Database Schema

The SQL entities mirror the MongoDB schemas with the following key features:

- **UUID Primary Keys**: All entities use UUID as primary keys
- **Proper Relations**: Foreign key relationships between entities
- **Color Support**: Built-in color properties for UI theming
- **Timestamps**: Automatic creation and update timestamps
- **Cascading**: Proper cascade rules for data integrity

## Migration

When switching from MongoDB to SQL:

1. Update environment variables
2. The application will automatically create tables on first run (development mode)
3. For production, disable `synchronize` and use proper migrations

## Performance

SQL DAOs include performance optimizations:
- Query builders for complex searches
- Eager loading for related entities
- Indexed fields for common queries
- Connection pooling through TypeORM

## Development

To add a new SQL DAO:

1. Create the TypeORM entity in `src/*/entities/`
2. Create the SQL DAO in `src/*/DAOs/sql/`
3. Update the factory to include the new DAO
4. Add the entity to the module imports
