# SQL Migrations Guide

This guide explains how to use SQL migrations in the Sokoke Planner API to manage database schema changes.

## Overview

The project includes migration scripts for all supported SQL databases:

- SQLite
- MySQL
- PostgreSQL

Migrations ensure that database schema changes are applied consistently across different environments.

## Migration Scripts Available

### NPM Scripts

- `npm run migration:generate <MigrationName>` - Generate a new migration based on entity changes
- `npm run migration:create <MigrationName>` - Create a new empty migration file
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert the last migration
- `npm run migration:show` - Show migration status

## Initial Schema Migrations

The project includes initial schema migrations for each database type:

### 1. SQLite Migration

**File:** `src/migrations/1701000000000-InitialSQLSchema.ts`

- Creates all required tables with proper relationships
- Includes indexes for performance optimization
- Uses SQLite-specific syntax

### 2. MySQL Migration

**File:** `src/migrations/1701000000001-InitialMySQLSchema.ts`

- MySQL-optimized table creation with proper charset (utf8mb4)
- Uses InnoDB engine for ACID compliance
- Includes MySQL-specific foreign key constraints

### 3. PostgreSQL Migration

**File:** `src/migrations/1701000000002-InitialPostgreSQLSchema.ts`

- PostgreSQL-specific table creation
- Includes automatic updated_at triggers
- Uses PostgreSQL functions for timestamp updates

## Usage Instructions

### 1. Database Configuration

Ensure your environment variables are properly configured in `.env`:

```bash
# Database Configuration
PERSISTENCE=sql
DATABASE_TYPE=mysql # or postgresql, sqlite
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=sokoke_planner
```

### 2. Running Initial Migration

For a new database, run the initial migration:

```bash
npm run migration:run
```

This will create all necessary tables and relationships.

### 3. Creating New Migrations

When you modify entities, generate a new migration:

```bash
npm run migration:generate AddNewColumnToUsers
```

This will analyze entity changes and create appropriate SQL statements.

### 4. Manual Migration Creation

For custom changes not reflected in entities:

```bash
npm run migration:create CustomDataUpdate
```

Then edit the generated file to add your custom SQL.

### 5. Migration Management

Check migration status:

```bash
npm run migration:show
```

Revert the last migration if needed:

```bash
npm run migration:revert
```

## Migration File Structure

Each migration implements the `MigrationInterface`:

```typescript
export class MigrationName1234567890000 implements MigrationInterface {
  name = 'MigrationName1234567890000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // SQL statements to apply changes
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // SQL statements to revert changes
  }
}
```

## Database-Specific Considerations

### SQLite

- Uses `datetime('now')` for default timestamps
- Simple foreign key syntax
- No advanced constraint naming

### MySQL

- Uses `CURRENT_TIMESTAMP` with `ON UPDATE CURRENT_TIMESTAMP`
- Requires explicit charset and collation specification
- Named constraints for better error messages

### PostgreSQL

- Uses `now()` function for timestamps
- Supports advanced trigger-based timestamp updates
- More sophisticated constraint and index management

## Best Practices

1. **Always test migrations** in development before production
2. **Backup production data** before running migrations
3. **Use descriptive migration names** that explain the change
4. **Keep migrations atomic** - each migration should be a single logical change
5. **Include both up and down methods** for reversibility
6. **Never modify existing migrations** that have been run in production

## Troubleshooting

### Migration Fails

1. Check database connection settings
2. Verify database permissions
3. Review migration SQL syntax for database compatibility
4. Check for conflicting data that violates new constraints

### Schema Sync Issues

1. Ensure entities match the actual database schema
2. Use `migration:generate` to detect discrepancies
3. Manual schema adjustments may require custom migrations

### Database Type Switch

When switching between database types, you may need to:

1. Export data from the old database
2. Run the appropriate initial migration for the new database type
3. Import the exported data

## Environment Examples

See `.env.sql.example` for complete configuration examples for all supported database types.

## Related Documentation

- [SQL DAOs Documentation](./SQL_DAOS.md)
- [Configuration Documentation](../src/config/README.md)
- [TypeORM Documentation](https://typeorm.io/migrations)
