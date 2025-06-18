# API Reference

## 📋 Overview

This document provides a comprehensive reference for all API endpoints available in the Sokoke Planner API. It includes detailed information about request/response formats, authentication requirements, error codes, and usage examples.

## 🔗 Base Information

- **Base URL**: `http://localhost:3000` (development) / `https://api.sokoke.com` (production)
- **API Version**: v1
- **Content-Type**: `application/json`
- **Authentication**: JWT Bearer Token or API Key

## 🔐 Authentication

### JWT Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <jwt-token>
```

### API Key Authentication

For external integrations, use API key authentication:

```http
X-API-KEY: <your-api-key>
```

### Authentication Endpoints

#### Register User

```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "a1b2c3d4e5f6...",
    "user": {
      "id": "64a7b8c9d2e3f4a5b6c7d8e9",
      "email": "john.doe@example.com",
      "name": "John",
      "lastName": "Doe",
      "verified": false
    },
    "expiresIn": 900
  }
}
```

#### Login User

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "a1b2c3d4e5f6...",
    "user": {
      "id": "64a7b8c9d2e3f4a5b6c7d8e9",
      "email": "john.doe@example.com",
      "name": "John",
      "lastName": "Doe"
    },
    "expiresIn": 900
  }
}
```

#### Refresh Token

```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

## � Enhanced Search Feature

### Search Query Parameters

All entity endpoints support advanced search functionality through query parameters. The search feature provides filtering, pagination, sorting, text search, and more.

#### Base Search Structure

```http
GET /endpoint?search=<encoded-search-object>
```

#### Search Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `filters` | `object` | Filter by entity properties |
| `pagination` | `object` | Page number and limit |
| `sort` | `array` | Sorting configuration |
| `search` | `object` | Text search configuration |
| `advanced` | `object` | Advanced filtering options |

#### Pagination Object

```json
{
  "page": 1,
  "limit": 20
}
```

#### Sort Object

```json
[
  {
    "field": "priority",
    "order": "desc"
  },
  {
    "field": "updatedAt", 
    "order": "desc"
  }
]
```

#### Text Search Object

```json
{
  "query": "mobile app development",
  "fields": ["name", "description"],
  "options": {
    "caseSensitive": false,
    "useRegex": false
  }
}
```

#### Advanced Filtering Object

```json
{
  "dateRange": [
    {
      "field": "startDate",
      "start": "2024-01-01T00:00:00.000Z",
      "end": "2024-12-31T23:59:59.999Z"
    }
  ],
  "numericRange": [
    {
      "field": "priority",
      "min": 5,
      "max": 10
    }
  ],
  "select": ["name", "description", "priority"],
  "populate": ["status", "category"]
}
```

### Search Response Format

All search endpoints return results in a standardized format:

```json
{
  "items": [
    // Array of found entities
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

### Search Examples

#### Basic Filtering
```http
GET /projects?search={"filters":{"completed":false,"priority":5}}
```

#### Text Search with Pagination
```http
GET /projects?search={"search":{"query":"mobile app","fields":["name","description"]},"pagination":{"page":1,"limit":10}}
```

#### Date Range Filtering
```http
GET /projects?search={"advanced":{"dateRange":[{"field":"startDate","start":"2024-01-01T00:00:00.000Z","end":"2024-12-31T23:59:59.999Z"}]}}
```

#### Complex Combined Search
```http
GET /projects?search={"filters":{"completed":false},"search":{"query":"API development"},"advanced":{"numericRange":[{"field":"priority","min":5}]},"sort":[{"field":"priority","order":"desc"}],"pagination":{"page":1,"limit":25}}
```

### Entity-Specific Search Examples

#### Projects
```http
# Search high-priority incomplete projects
GET /projects?search={"filters":{"completed":false},"advanced":{"numericRange":[{"field":"priority","min":7}]},"sort":[{"field":"priority","order":"desc"}]}

# Text search in project names and descriptions
GET /projects?search={"search":{"query":"e-commerce","fields":["name","description","impactDescription"]}}
```

#### Tasks
```http
# Search tasks by assigned user
GET /tasks?search={"filters":{"assignedUsers":"64a7b8c9d2e3f4a5b6c7d8e9"}}

# Search tasks with text and date range
GET /tasks?search={"search":{"query":"bug fix"},"advanced":{"dateRange":[{"field":"startDate","start":"2024-01-01T00:00:00.000Z"}]}}
```

#### Users
```http
# Search users by name or email
GET /users?search={"search":{"query":"john","fields":["name","lastName","email"]}}

# Get recently updated users
GET /users?search={"sort":[{"field":"updatedAt","order":"desc"}],"pagination":{"page":1,"limit":10}}
```

### Performance Tips

1. **Use Pagination**: Always include pagination to limit result sets
2. **Field Selection**: Use `select` to return only needed fields
3. **Proper Indexing**: Ensure database indexes for frequently searched fields
4. **Text Search**: Prefer exact filters over text search when possible
5. **Combine Filters**: Use filters before text search for better performance

## �📋 Project Management

### Projects

#### Create Project

```http
POST /project
```

**Authorization:** Required  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "name": "E-commerce Website",
  "description": "Complete e-commerce solution with cart and payment integration",
  "categoryId": "64a7b8c9d2e3f4a5b6c7d8e9",
  "subCategoryId": "64a7b8c9d2e3f4a5b6c7d8ea",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-06-15T00:00:00.000Z"
}
```

**Response (201):**
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

#### Get All Projects

```http
GET /project
```

**Authorization:** Required

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `sort` (string): Sort field and direction (e.g., `createdAt:desc`)
- `search` (string): Search in name and description
- `categoryId` (string): Filter by category
- `status` (string): Filter by status

**Example:**
```http
GET /project?page=1&limit=10&sort=createdAt:desc&search=e-commerce
```

**Response (200):**
```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": [
    {
      "id": "64a7b8c9d2e3f4a5b6c7d8eb",
      "name": "E-commerce Website",
      "description": "Complete e-commerce solution",
      "status": "in-progress",
      "category": {
        "id": "64a7b8c9d2e3f4a5b6c7d8e9",
        "name": "Web Development"
      },
      "createdAt": "2024-01-10T10:30:00.000Z",
      "updatedAt": "2024-01-15T14:20:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

#### Get Project by ID

```http
GET /project/{id}
```

**Authorization:** Required

**Path Parameters:**
- `id` (string): Unique project identifier

**Response (200):**
```json
{
  "success": true,
  "message": "Project retrieved successfully",
  "data": {
    "id": "64a7b8c9d2e3f4a5b6c7d8eb",
    "name": "E-commerce Website",
    "description": "Complete e-commerce solution with cart and payment integration",
    "status": "in-progress",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-06-15T00:00:00.000Z",
    "category": {
      "id": "64a7b8c9d2e3f4a5b6c7d8e9",
      "name": "Web Development",
      "color": "#007bff"
    },
    "subCategory": {
      "id": "64a7b8c9d2e3f4a5b6c7d8ea",
      "name": "E-commerce",
      "color": "#28a745"
    },
    "createdBy": "64a7b8c9d2e3f4a5b6c7d8ec",
    "createdAt": "2024-01-10T10:30:00.000Z",
    "updatedAt": "2024-01-15T14:20:00.000Z"
  }
}
```

#### Update Project

```http
PUT /project
```

**Authorization:** Required  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "id": "64a7b8c9d2e3f4a5b6c7d8eb",
  "name": "E-commerce Website v2",
  "status": "in-progress",
  "endDate": "2024-07-15T00:00:00.000Z"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "id": "64a7b8c9d2e3f4a5b6c7d8eb",
    "name": "E-commerce Website v2",
    "status": "in-progress",
    "endDate": "2024-07-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T16:30:00.000Z"
  }
}
```

#### Delete Project

```http
DELETE /project/{id}
```

**Authorization:** Required

**Path Parameters:**
- `id` (string): Unique project identifier

**Response (200):**
```json
{
  "success": true,
  "message": "Project deleted successfully",
  "data": {
    "id": "64a7b8c9d2e3f4a5b6c7d8eb",
    "name": "E-commerce Website",
    "status": "deleted",
    "deletedAt": "2024-01-15T17:00:00.000Z"
  }
}
```

### Project Categories

#### Create Project Category

```http
POST /project-category
```

**Authorization:** Required  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "name": "Web Development",
  "description": "Website and web application projects",
  "color": "#007bff",
  "icon": "web"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Project category created successfully",
  "data": {
    "id": "64a7b8c9d2e3f4a5b6c7d8e9",
    "name": "Web Development",
    "description": "Website and web application projects",
    "color": "#007bff",
    "icon": "web",
    "createdAt": "2024-01-10T09:00:00.000Z",
    "updatedAt": "2024-01-10T09:00:00.000Z"
  }
}
```

#### Get All Project Categories

```http
GET /project-category
```

**Authorization:** Required

**Response (200):**
```json
{
  "success": true,
  "message": "Project categories retrieved successfully",
  "data": [
    {
      "id": "64a7b8c9d2e3f4a5b6c7d8e9",
      "name": "Web Development",
      "description": "Website and web application projects",
      "color": "#007bff",
      "icon": "web",
      "projectCount": 15,
      "createdAt": "2024-01-10T09:00:00.000Z"
    },
    {
      "id": "64a7b8c9d2e3f4a5b6c7d8ea",
      "name": "Mobile Development",
      "description": "Mobile application projects",
      "color": "#28a745",
      "icon": "mobile",
      "projectCount": 8,
      "createdAt": "2024-01-10T09:15:00.000Z"
    }
  ]
}
```

### Project Subcategories

#### Create Project Subcategory

```http
POST /project-subcategory
```

**Authorization:** Required  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "name": "E-commerce",
  "description": "Online store and marketplace projects",
  "categoryId": "64a7b8c9d2e3f4a5b6c7d8e9",
  "color": "#ffc107",
  "icon": "shopping-cart"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Project subcategory created successfully",
  "data": {
    "id": "64a7b8c9d2e3f4a5b6c7d8eb",
    "name": "E-commerce",
    "description": "Online store and marketplace projects",
    "categoryId": "64a7b8c9d2e3f4a5b6c7d8e9",
    "color": "#ffc107",
    "icon": "shopping-cart",
    "createdAt": "2024-01-10T09:30:00.000Z",
    "updatedAt": "2024-01-10T09:30:00.000Z"
  }
}
```

#### Get Subcategories by Category

```http
GET /project-subcategory/category/{categoryId}
```

**Authorization:** Required

**Path Parameters:**
- `categoryId` (string): Category identifier

**Response (200):**
```json
{
  "success": true,
  "message": "Project subcategories retrieved successfully",
  "data": [
    {
      "id": "64a7b8c9d2e3f4a5b6c7d8eb",
      "name": "E-commerce",
      "description": "Online store and marketplace projects",
      "color": "#ffc107",
      "icon": "shopping-cart",
      "projectCount": 5
    },
    {
      "id": "64a7b8c9d2e3f4a5b6c7d8ec",
      "name": "Corporate Website",
      "description": "Business and corporate websites",
      "color": "#6c757d",
      "icon": "building",
      "projectCount": 10
    }
  ]
}
```

## ✅ Task Management

### Tasks

#### Create Task

```http
POST /task
```

**Authorization:** Required  
**Content-Type:** `application/json`

**Request Body:**
```json
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

**Response (201):**
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
    "actualHours": 0,
    "createdAt": "2024-01-10T10:35:00.000Z",
    "updatedAt": "2024-01-10T10:35:00.000Z"
  }
}
```

#### Get Tasks by Project

```http
GET /task/project/{projectId}
```

**Authorization:** Required

**Path Parameters:**
- `projectId` (string): Project identifier

**Query Parameters:**
- `status` (string): Filter by status
- `assignedTo` (string): Filter by assigned user
- `priority` (string): Filter by priority

**Response (200):**
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": "64a7b8c9d2e3f4a5b6c7d8ee",
      "title": "Implement user authentication",
      "priority": "high",
      "status": {
        "id": "64a7b8c9d2e3f4a5b6c7d8ef",
        "name": "In Progress",
        "color": "#007bff"
      },
      "assignedTo": {
        "id": "64a7b8c9d2e3f4a5b6c7d8ed",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "dueDate": "2024-01-25T00:00:00.000Z",
      "estimatedHours": 16,
      "actualHours": 8,
      "progress": 50
    }
  ]
}
```

#### Update Task

```http
PUT /task
```

**Authorization:** Required  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "id": "64a7b8c9d2e3f4a5b6c7d8ee",
  "statusId": "64a7b8c9d2e3f4a5b6c7d8f0",
  "actualHours": 12,
  "progress": 75
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "64a7b8c9d2e3f4a5b6c7d8ee",
    "statusId": "64a7b8c9d2e3f4a5b6c7d8f0",
    "actualHours": 12,
    "progress": 75,
    "updatedAt": "2024-01-15T16:45:00.000Z"
  }
}
```

## 🎯 Feature Management

### Features

#### Create Feature

```http
POST /feature
```

**Authorization:** Required  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "name": "Shopping Cart",
  "description": "Add items to cart and manage quantities",
  "projectId": "64a7b8c9d2e3f4a5b6c7d8eb",
  "priority": "high"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Feature created successfully",
  "data": {
    "id": "64a7b8c9d2e3f4a5b6c7d8f1",
    "name": "Shopping Cart",
    "description": "Add items to cart and manage quantities",
    "projectId": "64a7b8c9d2e3f4a5b6c7d8eb",
    "statusId": "64a7b8c9d2e3f4a5b6c7d8f2",
    "priority": "high",
    "createdAt": "2024-01-10T11:00:00.000Z",
    "updatedAt": "2024-01-10T11:00:00.000Z"
  }
}
```

#### Get Features by Project

```http
GET /feature/project/{projectId}
```

**Authorization:** Required

**Path Parameters:**
- `projectId` (string): Project identifier

**Response (200):**
```json
{
  "success": true,
  "message": "Features retrieved successfully",
  "data": [
    {
      "id": "64a7b8c9d2e3f4a5b6c7d8f1",
      "name": "Shopping Cart",
      "description": "Add items to cart and manage quantities",
      "priority": "high",
      "status": {
        "id": "64a7b8c9d2e3f4a5b6c7d8f2",
        "name": "Planning",
        "color": "#ffc107"
      },
      "requirementCount": 5,
      "taskCount": 8,
      "progress": 25
    }
  ]
}
```

## 📋 Requirements Management

### Requirements

#### Create Requirement

```http
POST /requirement
```

**Authorization:** Required  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "title": "User Registration Validation",
  "description": "Email must be unique and password must meet security criteria",
  "projectId": "64a7b8c9d2e3f4a5b6c7d8eb",
  "featureId": "64a7b8c9d2e3f4a5b6c7d8f1",
  "type": "functional",
  "priority": "high"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Requirement created successfully",
  "data": {
    "id": "64a7b8c9d2e3f4a5b6c7d8f3",
    "title": "User Registration Validation",
    "description": "Email must be unique and password must meet security criteria",
    "projectId": "64a7b8c9d2e3f4a5b6c7d8eb",
    "featureId": "64a7b8c9d2e3f4a5b6c7d8f1",
    "type": "functional",
    "priority": "high",
    "status": "draft",
    "createdAt": "2024-01-10T11:15:00.000Z",
    "updatedAt": "2024-01-10T11:15:00.000Z"
  }
}
```

#### Get Requirements by Feature

```http
GET /requirement/feature/{featureId}
```

**Authorization:** Required

**Path Parameters:**
- `featureId` (string): Feature identifier

**Response (200):**
```json
{
  "success": true,
  "message": "Requirements retrieved successfully",
  "data": [
    {
      "id": "64a7b8c9d2e3f4a5b6c7d8f3",
      "title": "User Registration Validation",
      "description": "Email must be unique and password must meet security criteria",
      "type": "functional",
      "priority": "high",
      "status": "approved",
      "createdAt": "2024-01-10T11:15:00.000Z"
    }
  ]
}
```

## 📊 Status Management

### Status

#### Create Status

```http
POST /status
```

**Authorization:** Required  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "name": "In Review",
  "description": "Item is under review",
  "color": "#ffc107",
  "order": 3,
  "isDefault": false,
  "isFinal": false,
  "applicableToProjects": true,
  "applicableToTasks": true,
  "applicableToFeatures": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Status created successfully",
  "data": {
    "id": "64a7b8c9d2e3f4a5b6c7d8f4",
    "name": "In Review",
    "description": "Item is under review",
    "color": "#ffc107",
    "order": 3,
    "isDefault": false,
    "isFinal": false,
    "applicableToProjects": true,
    "applicableToTasks": true,
    "applicableToFeatures": true,
    "createdAt": "2024-01-10T11:30:00.000Z",
    "updatedAt": "2024-01-10T11:30:00.000Z"
  }
}
```

#### Get Status by Applicability

```http
GET /status/projects
GET /status/tasks
GET /status/features
```

**Authorization:** Required

**Response (200):**
```json
{
  "success": true,
  "message": "Statuses retrieved successfully",
  "data": [
    {
      "id": "64a7b8c9d2e3f4a5b6c7d8f2",
      "name": "Planning",
      "description": "Project is in planning phase",
      "color": "#6c757d",
      "order": 1,
      "isDefault": true,
      "isFinal": false
    },
    {
      "id": "64a7b8c9d2e3f4a5b6c7d8ef",
      "name": "In Progress",
      "description": "Work is in progress",
      "color": "#007bff",
      "order": 2,
      "isDefault": false,
      "isFinal": false
    }
  ]
}
```

## 🚨 Error Responses

### Standard Error Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details",
    "timestamp": "2024-01-10T10:40:00.000Z",
    "path": "/project/invalid-id"
  }
}
```

### HTTP Status Codes

| Status Code | Description | Usage |
|-------------|-------------|-------|
| `200` | OK | Successful GET, PUT, DELETE |
| `201` | Created | Successful POST |
| `400` | Bad Request | Invalid request data |
| `401` | Unauthorized | Missing or invalid authentication |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Resource conflict (e.g., duplicate) |
| `422` | Unprocessable Entity | Validation errors |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server error |

### Common Error Codes

| Error Code | HTTP Status | Description |
|-----------|-------------|-------------|
| `RESOURCE_NOT_FOUND` | 404 | Requested resource doesn't exist |
| `VALIDATION_FAILED` | 400 | Input validation errors |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `DUPLICATE_RESOURCE` | 409 | Resource already exists |
| `INVALID_REFERENCE` | 422 | Referenced resource doesn't exist |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |

### Validation Error Example

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_FAILED",
    "details": [
      {
        "field": "name",
        "message": "Project name is required"
      },
      {
        "field": "endDate",
        "message": "End date must be after start date"
      }
    ],
    "timestamp": "2024-01-10T10:40:00.000Z",
    "path": "/project"
  }
}
```

## 📈 Rate Limiting

### Rate Limits

| Authentication Type | Requests per Minute | Burst Limit |
|-------------------|-------------------|-------------|
| **Unauthenticated** | 10 | 20 |
| **JWT Token** | 100 | 200 |
| **API Key** | 1000 | 2000 |

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "message": "Rate limit exceeded",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "details": "Too many requests. Please try again later.",
    "retryAfter": 60,
    "timestamp": "2024-01-10T10:40:00.000Z"
  }
}
```

## 🔍 Filtering and Searching

### Query Parameters

All list endpoints support these query parameters:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (1-based) | `?page=2` |
| `limit` | number | Items per page (max 100) | `?limit=25` |
| `sort` | string | Sort field and direction | `?sort=createdAt:desc` |
| `search` | string | Search in text fields | `?search=authentication` |

### Entity-Specific Filters

#### Projects
- `categoryId` - Filter by category
- `subCategoryId` - Filter by subcategory
- `status` - Filter by status
- `createdBy` - Filter by creator

#### Tasks
- `projectId` - Filter by project
- `assignedTo` - Filter by assigned user
- `status` - Filter by status
- `priority` - Filter by priority
- `dueDate` - Filter by due date range

#### Features
- `projectId` - Filter by project
- `status` - Filter by status
- `priority` - Filter by priority

### Search Examples

```http
# Search projects with text
GET /project?search=e-commerce&categoryId=64a7b8c9d2e3f4a5b6c7d8e9

# Get high priority tasks
GET /task?priority=high&status=in-progress

# Paginated results with sorting
GET /project?page=2&limit=20&sort=updatedAt:desc
```

### cURL Examples

```bash
# Create project
curl -X POST "https://api.sokoke.com/project" \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "E-commerce Website",
    "description": "Online store project"
  }'

# Get projects with filtering
curl -X GET "https://api.sokoke.com/project?page=1&limit=10&search=ecommerce" \
  -H "Authorization: Bearer <jwt-token>"

# Update project
curl -X PUT "https://api.sokoke.com/project" \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "64a7b8c9d2e3f4a5b6c7d8eb",
    "status": "completed"
  }'
```

## 🔗 Related Documentation

- [Authentication Guide](../src/auth/README-auth-api.md)
- [Planner Module Documentation](../src/planner/README.md)
- [Configuration Guide](../src/config/README.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)

---

For additional support or questions, please refer to the main [API Documentation](../README.md) or create an issue in the repository.
