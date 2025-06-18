# Planner Module Documentation

## 📋 Overview

The Planner module is the core of the Sokoke Planner API, providing comprehensive project planning and task management functionality. It implements a Domain-Driven Design (DDD) architecture with clear separation of concerns across multiple layers.

## 🏗️ Architecture

### Layered Architecture

```text
HTTP Layer (Controllers)
    ↓
Business Logic Layer (Services)
    ↓
Data Access Layer (Repositories)
    ↓
Database Abstraction Layer (DAOs)
    ↓
Database Layer (MongoDB/Mongoose)
```

### Components

| Layer | Description | Examples |
|-------|-------------|----------|
| **Controllers** | Handle HTTP requests, validation, and responses | `ProjectController`, `TaskController` |
| **Services** | Business logic, orchestration, and domain rules | `ProjectService`, `TaskService` |
| **Repositories** | Data access abstraction, database-agnostic | `ProjectRepository`, `TaskRepository` |
| **DAOs** | Database-specific implementations | `MongoDBProjectDAO`, `MongoDBTaskDAO` |
| **Factories** | Create appropriate DAO instances | `ProjectDaoFactory`, `TaskDaoFactory` |
| **DTOs** | Data transfer objects for API communication | `CreateProjectDto`, `UpdateTaskDto` |
| **Schemas** | Database schema definitions | `ProjectSchema`, `TaskSchema` |

## 📊 Data Model

### Core Entities

#### Project
A project represents a main work unit that contains tasks, features, and requirements.

```typescript
interface Project {
  id: string;
  name: string;
  description?: string;
  categoryId?: string;
  subCategoryId?: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Task
Tasks are actionable items within a project that can be assigned and tracked.

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  assignedTo?: string;
  statusId: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Feature
Features represent functionality or capabilities within a project.

```typescript
interface Feature {
  id: string;
  name: string;
  description?: string;
  projectId: string;
  statusId: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  updatedAt: Date;
}
```

#### Requirement
Requirements define what needs to be accomplished or specified.

```typescript
interface Requirement {
  id: string;
  title: string;
  description?: string;
  projectId?: string;
  featureId?: string;
  type: 'functional' | 'non-functional' | 'business';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Status
Status entities define workflow states for various entities.

```typescript
interface Status {
  id: string;
  name: string;
  description?: string;
  color?: string;
  order: number;
  isDefault: boolean;
  isFinal: boolean;
  applicableToProjects: boolean;
  applicableToTasks: boolean;
  applicableToFeatures: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Project Category & Subcategory
Hierarchical organization system for projects.

```typescript
interface ProjectCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectSubCategory {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🌐 API Endpoints

### Projects (`/project`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/project` | List all projects | ✅ |
| `GET` | `/project/:id` | Get project by ID | ✅ |
| `POST` | `/project` | Create new project | ✅ |
| `PUT` | `/project/:id` | Update project | ✅ |
| `PATCH` | `/project/:id` | Partially update project | ✅ |
| `DELETE` | `/project/:id` | Delete project | ✅ |

### Tasks (`/task`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/task` | List all tasks | ✅ |
| `GET` | `/task/:id` | Get task by ID | ✅ |
| `GET` | `/task/project/:projectId` | Get tasks by project | ✅ |
| `POST` | `/task` | Create new task | ✅ |
| `PUT` | `/task/:id` | Update task | ✅ |
| `PATCH` | `/task/:id` | Partially update task | ✅ |
| `DELETE` | `/task/:id` | Delete task | ✅ |

### Features (`/feature`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/feature` | List all features | ✅ |
| `GET` | `/feature/:id` | Get feature by ID | ✅ |
| `GET` | `/feature/project/:projectId` | Get features by project | ✅ |
| `POST` | `/feature` | Create new feature | ✅ |
| `PUT` | `/feature/:id` | Update feature | ✅ |
| `PATCH` | `/feature/:id` | Partially update feature | ✅ |
| `DELETE` | `/feature/:id` | Delete feature | ✅ |

### Requirements (`/requirement`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/requirement` | List all requirements | ✅ |
| `GET` | `/requirement/:id` | Get requirement by ID | ✅ |
| `GET` | `/requirement/project/:projectId` | Get requirements by project | ✅ |
| `GET` | `/requirement/feature/:featureId` | Get requirements by feature | ✅ |
| `POST` | `/requirement` | Create new requirement | ✅ |
| `PUT` | `/requirement/:id` | Update requirement | ✅ |
| `PATCH` | `/requirement/:id` | Partially update requirement | ✅ |
| `DELETE` | `/requirement/:id` | Delete requirement | ✅ |

### Status Management (`/status`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/status` | List all statuses | ✅ |
| `GET` | `/status/:id` | Get status by ID | ✅ |
| `GET` | `/status/projects` | Get project-applicable statuses | ✅ |
| `GET` | `/status/tasks` | Get task-applicable statuses | ✅ |
| `GET` | `/status/features` | Get feature-applicable statuses | ✅ |
| `POST` | `/status` | Create new status | ✅ |
| `PUT` | `/status/:id` | Update status | ✅ |
| `PATCH` | `/status/:id` | Partially update status | ✅ |
| `DELETE` | `/status/:id` | Delete status | ✅ |

### Project Categories (`/project-category`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/project-category` | List all categories | ✅ |
| `GET` | `/project-category/:id` | Get category by ID | ✅ |
| `POST` | `/project-category` | Create new category | ✅ |
| `PUT` | `/project-category/:id` | Update category | ✅ |
| `PATCH` | `/project-category/:id` | Partially update category | ✅ |
| `DELETE` | `/project-category/:id` | Delete category | ✅ |

### Project Subcategories (`/project-subcategory`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/project-subcategory` | List all subcategories | ✅ |
| `GET` | `/project-subcategory/:id` | Get subcategory by ID | ✅ |
| `GET` | `/project-subcategory/category/:categoryId` | Get subcategories by category | ✅ |
| `POST` | `/project-subcategory` | Create new subcategory | ✅ |
| `PUT` | `/project-subcategory/:id` | Update subcategory | ✅ |
| `PATCH` | `/project-subcategory/:id` | Partially update subcategory | ✅ |
| `DELETE` | `/project-subcategory/:id` | Delete subcategory | ✅ |

## 📝 Request/Response Examples

### Create Project

**Request:**
```http
POST /project
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "name": "E-commerce Website",
  "description": "Complete e-commerce solution with cart and payment integration",
  "categoryId": "64a7b8c9d2e3f4a5b6c7d8e9",
  "subCategoryId": "64a7b8c9d2e3f4a5b6c7d8ea",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-06-15T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": "64a7b8c9d2e3f4a5b6c7d8eb",
    "name": "E-commerce Website",
    "description": "Complete e-commerce solution with cart and payment integration",
    "categoryId": "64a7b8c9d2e3f4a5b6c7d8e9",
    "subCategoryId": "64a7b8c9d2e3f4a5b6c7d8ea",
    "status": "planning",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-06-15T00:00:00.000Z",
    "createdBy": "64a7b8c9d2e3f4a5b6c7d8ec",
    "createdAt": "2024-01-10T10:30:00.000Z",
    "updatedAt": "2024-01-10T10:30:00.000Z"
  }
}
```

### Create Task

**Request:**
```http
POST /task
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "title": "Implement user authentication",
  "description": "Create login/logout functionality with JWT tokens",
  "projectId": "64a7b8c9d2e3f4a5b6c7d8eb",
  "assignedTo": "64a7b8c9d2e3f4a5b6c7d8ed",
  "priority": "high",
  "dueDate": "2024-01-25T00:00:00.000Z",
  "estimatedHours": 16
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "64a7b8c9d2e3f4a5b6c7d8ee",
    "title": "Implement user authentication",
    "description": "Create login/logout functionality with JWT tokens",
    "projectId": "64a7b8c9d2e3f4a5b6c7d8eb",
    "assignedTo": "64a7b8c9d2e3f4a5b6c7d8ed",
    "statusId": "64a7b8c9d2e3f4a5b6c7d8ef",
    "priority": "high",
    "dueDate": "2024-01-25T00:00:00.000Z",
    "estimatedHours": 16,
    "actualHours": null,
    "createdAt": "2024-01-10T10:35:00.000Z",
    "updatedAt": "2024-01-10T10:35:00.000Z"
  }
}
```

## 🔒 Security & Validation

### Authentication
All endpoints require authentication using either:
- **JWT Bearer Token** for user sessions
- **API Key** for external integrations

### Input Validation
All input data is validated using:
- **Class-validator** decorators on DTOs
- **Custom validation pipes** for business rules
- **MongoDB schema validation** as a final layer

### Authorization
- Users can only access their own projects and tasks
- Admin users have elevated permissions
- API keys have configurable permissions

## 🔄 Business Rules

### Project Management
- Projects must have a valid status
- Start date cannot be after end date
- Projects can only be deleted if they have no associated tasks
- Category changes are allowed but tracked for audit

### Task Management
- Tasks must belong to an existing project
- Tasks cannot be assigned to inactive users
- Task status transitions follow defined workflows
- Due dates generate automatic notifications

### Status Workflow
- Status transitions are enforced based on configuration
- Final statuses cannot be changed
- Default statuses are automatically assigned to new entities
- Custom statuses can be created per project

## 🔍 Filtering & Searching

### Query Parameters

All list endpoints support the following query parameters:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (1-based) | `?page=2` |
| `limit` | number | Items per page (max 100) | `?limit=25` |
| `sort` | string | Sort field and direction | `?sort=createdAt:desc` |
| `search` | string | Search in name/title/description | `?search=authentication` |
| `status` | string | Filter by status | `?status=in-progress` |
| `priority` | string | Filter by priority | `?priority=high` |
| `assignedTo` | string | Filter by assigned user | `?assignedTo=userId` |
| `projectId` | string | Filter by project | `?projectId=projectId` |
| `categoryId` | string | Filter by category | `?categoryId=categoryId` |

### Example Queries

```http
# Get high priority tasks in a specific project
GET /task?projectId=64a7b8c9d2e3f4a5b6c7d8eb&priority=high

# Search for tasks containing "authentication"
GET /task?search=authentication

# Get paginated projects sorted by creation date
GET /project?page=1&limit=10&sort=createdAt:desc

# Get tasks assigned to a specific user
GET /task?assignedTo=64a7b8c9d2e3f4a5b6c7d8ed
```

## 🚨 Error Handling

### Standard Error Response

```json
{
  "success": false,
  "message": "Detailed error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details",
    "timestamp": "2024-01-10T10:40:00.000Z",
    "path": "/project/invalid-id"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `RESOURCE_NOT_FOUND` | 404 | Requested resource doesn't exist |
| `VALIDATION_FAILED` | 400 | Input validation errors |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `DUPLICATE_RESOURCE` | 409 | Resource already exists |
| `INVALID_REFERENCE` | 422 | Referenced resource doesn't exist |

## 📈 Performance Considerations

### Database Optimization
- Indexed fields for common queries (projectId, assignedTo, status)
- Aggregation pipelines for complex reports
- Pagination limits to prevent large data transfers
- Connection pooling for database efficiency

### Caching Strategy
- Response caching for read-heavy endpoints
- Cache invalidation on data updates
- Redis integration for session management
- Static reference data caching (statuses, categories)

### Monitoring
- Request/response logging
- Performance metrics collection
- Error rate monitoring
- Database query performance tracking

## 🧪 Testing

### Test Coverage
- Unit tests for all services and repositories
- Integration tests for API endpoints
- End-to-end tests for complete workflows
- Database interaction tests with test containers

### Test Data
- Factory pattern for test data generation
- Realistic test scenarios
- Edge case coverage
- Performance test suites

## 📚 Related Documentation

- [Authentication Module](../auth/AUTHENTICATION-SUMMARY.md)
- [User Module](../user/README.md)
- [Shared Utilities](../shared/README.md)
- [Configuration Guide](../config/README.md)

---

For additional support or questions, please refer to the main [API Documentation](../../README.md) or create an issue in the repository.
