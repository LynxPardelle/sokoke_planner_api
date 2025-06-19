# Developer Guide

## 📋 Overview

This guide provides comprehensive information for developers working with the Sokoke Planner API. It covers architecture patterns, coding standards, development workflows, and best practices used throughout the project.

## 🏗️ Architecture Overview

### Domain-Driven Design (DDD)

The application follows Domain-Driven Design principles with clear separation of concerns:

```text
┌─────────────────────────────────────────────────────────────┐
│                        HTTP Layer                           │
│  Controllers (HTTP requests/responses, validation)          │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                      Business Layer                        │
│    Services (Business logic, orchestration)                │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                     Data Access Layer                      │
│  Repositories (Data abstraction, business queries)         │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                  Database Abstraction Layer                │
│      DAOs (Database-specific implementations)              │
└─────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────┐
│                      Database Layer                        │
│        MongoDB/Mongoose (Data persistence)                 │
└─────────────────────────────────────────────────────────────┘
```

### Module Structure

Each feature module follows a consistent structure:

```text
src/
├── {module}/
│   ├── controllers/          # HTTP endpoints
│   │   ├── {entity}.controller.ts
│   │   └── {entity}.controller.spec.ts
│   ├── services/            # Business logic
│   │   ├── {entity}.service.ts
│   │   └── {entity}.service.spec.ts
│   ├── repositories/        # Data access abstraction
│   │   └── {entity}.repository.ts
│   ├── DAOs/               # Database implementations
│   │   ├── {entity}.factory.ts
│   │   └── mongo/
│   │       └── mongo{Entity}.dao.ts
│   ├── DTOs/               # Data transfer objects
│   │   ├── create{Entity}.dto.ts
│   │   └── update{Entity}.dto.ts
│   ├── schemas/            # Database schemas
│   │   └── {entity}.schema.ts
│   ├── types/              # Type definitions
│   │   └── {entity}.type.ts
│   └── {module}.module.ts   # Module configuration
```

## 🔧 Development Setup

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **MongoDB** >= 5.0
- **Docker** (optional but recommended)
- **Git**

### Environment Setup

1. **Clone and setup:**

   ```bash
   git clone https://github.com/LynxPardelle/sokoke_planner_api.git
   cd sokoke_planner_api
   npm install
   ```

2. **Environment configuration:**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database setup:**

   ```bash
   # Start MongoDB locally
   mongod --dbpath ./data/db
   
   # Or use Docker
   docker run -d -p 27017:27017 --name mongodb mongo:5.0
   ```

4. **Start development server:**

   ```bash
   npm run start:dev
   ```

### Development Scripts

| Script | Description | Usage |
|--------|-------------|-------|
| `npm run start:dev` | Start with hot reload | Development |
| `npm run start:debug` | Start with debugger | Debugging |
| `npm run build` | Build for production | CI/CD |
| `npm run test` | Run unit tests | Testing |
| `npm run test:e2e` | Run e2e tests | Integration testing |
| `npm run lint` | ESLint code checking | Code quality |
| `npm run format` | Prettier formatting | Code formatting |

## 📁 File Organization

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **Files** | kebab-case | `project-category.service.ts` |
| **Classes** | PascalCase | `ProjectCategoryService` |
| **Interfaces** | PascalCase with `I` prefix | `IProjectRepository` |
| **Types** | PascalCase with `T` prefix | `TProject` |
| **Constants** | SCREAMING_SNAKE_CASE | `DEFAULT_PAGE_SIZE` |
| **Variables** | camelCase | `projectData` |
| **Functions** | camelCase | `createProject` |

### Import Organization

Organize imports in the following order:

```typescript
// 1. Node.js built-ins
import { readFile } from 'fs/promises';

// 2. External libraries
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

// 3. Internal modules (absolute paths)
import { LoggerService } from '@src/shared/services/logger.service';

// 4. Relative imports
import { ProjectRepository } from '../repositories/project.repository';
import { TProject } from '../types/project.type';
```

## 🎯 Coding Standards

### TypeScript Configuration

The project uses strict TypeScript configuration:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Code Style Guidelines

#### 1. Function Documentation

```typescript
/**
 * Brief description of what the function does
 * 
 * Detailed description if needed, including business rules,
 * side effects, and important implementation details.
 * 
 * @param {Type} paramName - Description of parameter
 * @param {Type} optionalParam - Optional parameter description
 * @returns {Type} Description of return value
 * 
 * @throws {ErrorType} When this error occurs
 * 
 * @example
 * ```typescript
 * const result = await functionName(param1, param2);
 * console.log(result);
 * ```
 */
async function functionName(
  paramName: Type,
  optionalParam?: Type,
): Promise<ReturnType> {
  // Implementation
}
```

#### 2. Class Documentation

```typescript
/**
 * Brief description of the class purpose
 * 
 * Detailed description of the class responsibilities,
 * patterns used, and important implementation notes.
 * 
 * @author Author Name
 * @version 1.0.0
 * @since 2024-01-10
 */
@Injectable()
export class ExampleService {
  /**
   * Constructor documentation
   * 
   * @param {DependencyType} dependency - Description of injected dependency
   */
  constructor(private dependency: DependencyType) {}
}
```

#### 3. Interface Documentation

```typescript
/**
 * Interface description
 * 
 * @interface
 */
export interface IExample {
  /** Property description */
  id: string;
  
  /** Optional property description */
  name?: string;
  
  /**
   * Method description
   * 
   * @param {string} param - Parameter description
   * @returns {Promise<boolean>} Return description
   */
  methodName(param: string): Promise<boolean>;
}
```

### Error Handling

#### 1. Service Layer Errors

```typescript
// Use typed errors with proper context
import { NotFoundException, BadRequestException } from '@nestjs/common';

async findProject(id: string): Promise<Project> {
  if (!id) {
    throw new BadRequestException('Project ID is required');
  }
  
  const project = await this.repository.findById(id);
  if (!project) {
    throw new NotFoundException(`Project with ID ${id} not found`);
  }
  
  return project;
}
```

#### 2. Repository Layer Errors

```typescript
// Return result objects instead of throwing
async findById(id: string): Promise<TRepositoryResponse<Project>> {
  try {
    const project = await this.model.findById(id);
    
    return {
      success: true,
      data: project,
      message: 'Project retrieved successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to retrieve project',
      error: error.message
    };
  }
}
```

### Validation Patterns

#### 1. DTO Validation

```typescript
import { IsString, IsOptional, IsDate, Length, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProjectDTO {
  /**
   * Project name
   * Must be between 3 and 100 characters
   */
  @IsString({ message: 'Project name must be a string' })
  @Length(3, 100, { message: 'Project name must be between 3 and 100 characters' })
  name: string;

  /**
   * Project description (optional)
   * Maximum 500 characters
   */
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @Length(0, 500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  /**
   * Project start date
   * Automatically converted from string to Date
   */
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Start date must be a valid date' })
  startDate: Date;
}
```

#### 2. Custom Validators

```typescript
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isAfter', async: false })
export class IsAfterConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    
    if (!value || !relatedValue) return true;
    
    return new Date(value) > new Date(relatedValue);
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} must be after ${relatedPropertyName}`;
  }
}
```

## 🗄️ Database Patterns

### Schema Definition

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * Project database schema
 * 
 * Defines the structure and validation rules for project documents
 * in MongoDB, including indexes and default values.
 */
@Schema({
  timestamps: true, // Automatic createdAt/updatedAt
  collection: 'projects',
  versionKey: false, // Disable __v field
})
export class Project extends Document {
  /**
   * Unique project identifier
   * Automatically generated MongoDB ObjectId
   */
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  /**
   * Project name
   * Required field with unique constraint within category
   */
  @Prop({
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters'],
    index: true, // Create index for faster searches
  })
  name: string;

  /**
   * Project description
   * Optional field with length limit
   */
  @Prop({
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    trim: true,
  })
  description?: string;

  /**
   * Project category reference
   * Foreign key to ProjectCategory collection
   */
  @Prop({
    type: Types.ObjectId,
    ref: 'ProjectCategory',
    index: true,
  })
  categoryId?: Types.ObjectId;

  /**
   * Automatic timestamp fields
   */
  createdAt: Date;
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

// Add compound indexes
ProjectSchema.index({ name: 1, categoryId: 1 }, { unique: true });
ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ status: 1, categoryId: 1 });
```

### DAO Implementation

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

/**
 * MongoDB implementation of project data access
 * 
 * Handles all database operations for projects using Mongoose.
 * Implements the repository interface with MongoDB-specific logic.
 */
@Injectable()
export class MongoDBProjectDAO {
  constructor(
    @InjectModel('Project') private projectModel: Model<Project>,
  ) {}

  /**
   * Create a new project document
   * 
   * @param {CreateProjectDTO} data - Project creation data
   * @returns {Promise<TRepositoryResponse<Project>>} Created project or error
   */
  async create(data: CreateProjectDTO): Promise<TRepositoryResponse<Project>> {
    try {
      const project = new this.projectModel(data);
      const savedProject = await project.save();
      
      return {
        success: true,
        data: savedProject.toObject(),
        message: 'Project created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create project',
        error: this.handleMongoError(error),
      };
    }
  }

  /**
   * Handle MongoDB-specific errors
   * 
   * @param {any} error - MongoDB error object
   * @returns {string} User-friendly error message
   */
  private handleMongoError(error: any): string {
    if (error.code === 11000) {
      return 'Project name already exists in this category';
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return messages.join(', ');
    }
    
    return error.message || 'Database operation failed';  }
}
```

### Enhanced Search Implementation

The API features a comprehensive search system that provides powerful querying capabilities across all entities. The search implementation is built around the `TSearch<T>` interface and `SearchService` utility.

#### Search Architecture

```typescript
/**
 * Search interface supporting filtering, pagination, sorting, and text search
 */
type TSearch<T> = {
    filters?: Partial<T>;           // Entity property filters
    pagination?: {                 // Page configuration
        page: number;
        limit: number;
    };
    sort?: {                       // Multi-field sorting
        field: keyof T;
        order: 'asc' | 'desc';
    }[];
    search?: {                     // Text search configuration
        query: string;
        fields?: (keyof T)[];
        options?: {
            caseSensitive?: boolean;
            useRegex?: boolean;
            fuzzyTolerance?: number;
        };
    };
    advanced?: {                   // Advanced filtering
        dateRange?: Array<{
            field: keyof T;
            start?: Date;
            end?: Date;
        }>;
        numericRange?: Array<{
            field: keyof T;
            min?: number;
            max?: number;
        }>;
        select?: (keyof T)[];      // Field selection
        populate?: (keyof T)[];    // Reference population
    };
};
```

#### SearchService Implementation

```typescript
import { SearchService } from '@src/shared/services/search.service';

/**
 * Enhanced DAO readAll method using SearchService
 */
async readAll(args?: TSearch<TProject>): Promise<TSearchResult<TProject>> {
    return await SearchService.executeSearch(
        this._projectModel,
        args,
        asTProject  // Transformer function
    );
}

#### Search Response Format

All search operations return a standardized response:

```typescript
type TSearchResult<T> = {
    items: T[];                    // Found entities
    metadata: {
        total: number;             // Total count (before pagination)
        page: number;              // Current page
        limit: number;             // Items per page
        totalPages: number;        // Total available pages
        hasMore: boolean;          // More pages available
        searchTime?: number;       // Execution time in ms
    };
};
```

#### Implementation Best Practices

1. **Performance Optimization**
   ```typescript
   // Create compound indexes for common search patterns
   db.projects.createIndex({ "name": "text", "description": "text" });
   db.projects.createIndex({ "priority": -1, "updatedAt": -1 });
   db.projects.createIndex({ "completed": 1, "category": 1 });
   ```

2. **Type Safety**
   ```typescript
   // Search parameters are fully typed
   const searchParams: TSearch<TProject> = {
       filters: {
           completed: false,    // Type-checked against TProject
           priority: 5          // Autocomplete available
       }
   };
   ```

3. **Error Handling**
   ```typescript
   try {
       const result = await projectDAO.readAll(searchParams);
       console.log(`Found ${result.metadata.total} projects`);
   } catch (error) {
       logger.error('Search failed:', error.message);
       // Handle search-specific errors
   }
   ```

For comprehensive search documentation, see `/docs/SEARCH_FEATURE.md`.

## 🧪 Testing Strategies

### Unit Testing

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { ProjectRepository } from '../repositories/project.repository';
import { LoggerService } from '@src/shared/services/logger.service';

/**
 * ProjectService unit tests
 * 
 * Tests business logic in isolation using mocked dependencies
 */
describe('ProjectService', () => {
  let service: ProjectService;
  let repository: jest.Mocked<ProjectRepository>;
  let logger: jest.Mocked<LoggerService>;

  beforeEach(async () => {
    // Create mocked dependencies
    const mockRepository = {
      create: jest.fn(),
      read: jest.fn(),
      readAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        { provide: ProjectRepository, useValue: mockRepository },
        { provide: LoggerService, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    repository = module.get(ProjectRepository);
    logger = module.get(LoggerService);
  });

  describe('create', () => {
    it('should create a project successfully', async () => {
      // Arrange
      const projectData = {
        name: 'Test Project',
        description: 'Test Description',
      };
      
      const expectedResult = {
        success: true,
        data: { id: '123', ...projectData },
        message: 'Project created successfully',
      };

      repository.create.mockResolvedValue(expectedResult);

      // Act
      const result = await service.create(projectData);

      // Assert
      expect(repository.create).toHaveBeenCalledWith(projectData);
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining('Creating project'),
        'ProjectService.create',
      );
      expect(result).toEqual(expectedResult);
    });

    it('should handle creation errors', async () => {
      // Arrange
      const projectData = { name: 'Test Project' };
      const errorResult = {
        success: false,
        message: 'Creation failed',
        error: 'Database error',
      };

      repository.create.mockResolvedValue(errorResult);

      // Act
      const result = await service.create(projectData);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toContain('Creation failed');
    });
  });
});
```

### Integration Testing

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { PlannerModule } from '../planner.module';

/**
 * Project controller integration tests
 * 
 * Tests HTTP endpoints with real database interactions
 */
describe('ProjectController (e2e)', () => {
  let app: INestApplication;
  let projectId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/test'),
        PlannerModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/project (POST)', () => {
    it('should create a new project', () => {
      const projectData = {
        name: 'Test Project',
        description: 'Integration test project',
      };

      return request(app.getHttpServer())
        .post('/project')
        .send(projectData)
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.name).toBe(projectData.name);
          projectId = res.body.data.id;
        });
    });
  });

  describe('/project/:id (GET)', () => {
    it('should retrieve a project by id', () => {
      return request(app.getHttpServer())
        .get(`/project/${projectId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.id).toBe(projectId);
        });
    });
  });
});
```

### Test Data Factories

```typescript
import { faker } from '@faker-js/faker';
import { CreateProjectDTO } from '../DTOs/createProject.dto';

/**
 * Factory for generating test project data
 */
export class ProjectTestFactory {
  /**
   * Generate valid project creation data
   */
  static createProjectData(overrides?: Partial<CreateProjectDTO>): CreateProjectDTO {
    return {
      name: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      categoryId: faker.database.mongodbObjectId(),
      startDate: faker.date.future(),
      endDate: faker.date.future({ years: 1 }),
      ...overrides,
    };
  }

  /**
   * Generate multiple project records
   */
  static createMultipleProjects(count: number): CreateProjectDTO[] {
    return Array.from({ length: count }, () => this.createProjectData());
  }

  /**
   * Generate project with specific status
   */
  static createProjectWithStatus(status: string): CreateProjectDTO {
    return this.createProjectData({ status });
  }
}
```

## 🚀 Deployment Guidelines

### Environment Configuration

```typescript
// config/environments/production.ts
export const productionConfig = {
  database: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '5m', // Shorter for production
  },
  logging: {
    level: 'info',
    enableFile: true,
    enableConsole: false,
  },
  security: {
    rateLimitTtl: 60,
    rateLimitLimit: 100,
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || [],
  },
};
```

### Docker Configuration

```dockerfile
# Multi-stage Dockerfile for production
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./

USER nestjs

EXPOSE 4003

CMD ["node", "dist/main"]
```

### Health Checks

```typescript
import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

/**
 * Health check controller for monitoring
 */
@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection() private connection: Connection,
  ) {}

  /**
   * Basic health check endpoint
   */
  @Get()
  async health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  /**
   * Detailed health check with dependencies
   */
  @Get('detailed')
  async detailedHealth() {
    const dbStatus = this.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    return {
      status: dbStatus === 'connected' ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      dependencies: {
        database: {
          status: dbStatus,
          name: this.connection.name,
        },
      },
      version: process.env.npm_package_version,
    };
  }
}
```

## 📚 Additional Resources

### Useful Commands

```bash
# Generate new module
nest generate module feature-name

# Generate controller
nest generate controller feature-name

# Generate service
nest generate service feature-name

# Generate full CRUD resource
nest generate resource feature-name

# Run specific test file
npm test -- --testPathPattern=project.service.spec.ts

# Run tests with coverage
npm run test:cov

# Debug tests
npm run test:debug

# Build and analyze bundle
npm run build
npm run analyze
```

### VS Code Extensions

Recommended extensions for development:

- **NestJS Files** - Generate NestJS files
- **TypeScript Importer** - Auto import TypeScript modules
- **ESLint** - Code quality checking
- **Prettier** - Code formatting
- **MongoDB** - MongoDB integration
- **Docker** - Container management
- **GitLens** - Git integration
- **Thunder Client** - API testing

### Debugging Setup

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug NestJS",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/main.ts",
      "args": [],
      "runtimeArgs": [
        "-r", "ts-node/register",
        "-r", "tsconfig-paths/register"
      ],
      "sourceMaps": true,
      "envFile": "${workspaceFolder}/.env",
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal"
    }
  ]
}
```

## 🤝 Contributing

### Git Workflow

1. **Branch naming:**
   - `feature/feature-name` - New features
   - `fix/bug-description` - Bug fixes
   - `docs/update-description` - Documentation updates
   - `refactor/component-name` - Code refactoring

2. **Commit messages:**
   ```
   type(scope): description
   
   feat(auth): add JWT refresh token functionality
   fix(project): resolve validation error for date fields
   docs(api): update endpoint documentation
   refactor(service): extract common validation logic
   ```

3. **Pull Request process:**
   - Create feature branch from `main`
   - Implement changes with tests
   - Update documentation
   - Submit PR with description
   - Code review and approval
   - Merge to `main`

### Code Review Checklist

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No hardcoded values
- [ ] Error handling is implemented
- [ ] Security considerations addressed
- [ ] Performance impact considered
- [ ] Breaking changes documented

---

For additional support, please refer to the main [API Documentation](../README.md) or create an issue in the repository.
