/**
 * Project Controller - HTTP API Endpoints for Project Management
 * 
 * This controller handles all HTTP requests related to project operations.
 * It provides RESTful endpoints for creating, reading, updating, and deleting
 * projects, with proper validation, error handling, and response formatting.
 * 
 * Base Route: /project
 * 
 * Features:
 * - CRUD operations for projects
 * - Request validation using DTOs
 * - Standardized response format
 * - Error handling and logging
 * - Query parameter support for filtering
 * 
 * Authentication: All endpoints require valid JWT or API key
 * 
 * @author Lynx Pardelle
 * @version 1.0.0
 * @since 2024-01-10
 */

import { Validate } from 'class-validator';
import {
  Controller,
  Get,
  Delete,
  Param,
  Post,
  Put,
  Query,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';

/* Type definitions */
import { TProject } from '@src/planner/types/project.type';
import { TSearch } from '@src/shared/types/search.type';

/* Data Transfer Objects for validation */
import { CreateProjectDTO } from '@src/planner/DTOs/createProject.dto';
import { UpdateProjectDTO } from '@src/planner/DTOs/updateProject.dto';

/* Service layer */
import { ProjectService } from '@src/planner/services/project.service';
import { LoggerService } from '@src/shared/services/logger.service';

/**
 * ProjectController class handling HTTP requests for project management
 * 
 * This controller provides a RESTful API interface for project operations.
 * All endpoints return standardized responses with consistent error handling.
 * Authentication and authorization are enforced at the module level.
 * 
 * @route /project
 */
@Controller('project')
export class ProjectController {
  /**
   * Constructor - Inject required services
   * 
   * @param {ProjectService} _projectService - Business logic service for projects
   * @param {LoggerService} _loggerService - Logging service for request tracking
   */
  constructor(
    private _projectService: ProjectService,
    private _loggerService: LoggerService,
  ) {}

  /**
   * Get author information endpoint
   * 
   * Returns information about the service author and contact details.
   * This is primarily used for service identification and debugging.
   * 
   * @route GET /project/author
   * @returns {object} Author information
   * 
   * @example
   * ```http
   * GET /project/author
   * 
   * Response:
   * {
   *   "author": "Lynx Pardelle",
   *   "site": "https://lynxpardelle.com",
   *   "github": "https://github.com/LynxPardelle"
   * }
   * ```
   */
  @Get('author')
  author(): { [key: string]: string } {
    this._loggerService.info('ProjectController.author');
    return this._projectService.author();
  }

  /**
   * Create a new project
   * 
   * Creates a new project with the provided data. Validates the request body
   * against the CreateProjectDTO schema and enforces business rules.
   * 
   * @route POST /project
   * @param {CreateProjectDTO} data - Project creation data
   * @returns {Promise<TRepositoryResponse<TProject>>} Created project with metadata
   * 
   * @example
   * ```http
   * POST /project
   * Content-Type: application/json
   * Authorization: Bearer <jwt-token>
   * 
   * {
   *   "name": "E-commerce Website",
   *   "description": "Online store with payment integration",
   *   "categoryId": "64a7b8c9d2e3f4a5b6c7d8e9",
   *   "startDate": "2024-01-15T00:00:00.000Z",
   *   "endDate": "2024-06-15T00:00:00.000Z"
   * }
   * 
   * Response (201):
   * {
   *   "success": true,
   *   "message": "Project created successfully",
   *   "data": {
   *     "id": "64a7b8c9d2e3f4a5b6c7d8eb",
   *     "name": "E-commerce Website",
   *     "description": "Online store with payment integration",
   *     "categoryId": "64a7b8c9d2e3f4a5b6c7d8e9",
   *     "status": "planning",
   *     "startDate": "2024-01-15T00:00:00.000Z",
   *     "endDate": "2024-06-15T00:00:00.000Z",
   *     "createdAt": "2024-01-10T10:30:00.000Z",
   *     "updatedAt": "2024-01-10T10:30:00.000Z"
   *   }
   * }
   * ```
   */
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @Validate(CreateProjectDTO)
  async create(@Body() data: CreateProjectDTO) {
    this._loggerService.info('ProjectController.create', 'ProjectController');
    return await this._projectService.create(data);
  }

  /**
   * Get a single project by ID
   * 
   * Retrieves a project by its unique identifier. Returns detailed project
   * information including related category and status data.
   * 
   * @route GET /project/:id
   * @param {string} id - Unique project identifier
   * @returns {Promise<TRepositoryResponse<TProject>>} Project data or error
   * 
   * @example
   * ```http
   * GET /project/64a7b8c9d2e3f4a5b6c7d8eb
   * Authorization: Bearer <jwt-token>
   * 
   * Response (200):
   * {
   *   "success": true,
   *   "message": "Project retrieved successfully",
   *   "data": {
   *     "id": "64a7b8c9d2e3f4a5b6c7d8eb",
   *     "name": "E-commerce Website",
   *     "description": "Online store with payment integration",
   *     "status": "in-progress",
   *     "category": {
   *       "id": "64a7b8c9d2e3f4a5b6c7d8e9",
   *       "name": "Web Development"
   *     },
   *     "createdAt": "2024-01-10T10:30:00.000Z",
   *     "updatedAt": "2024-01-15T14:20:00.000Z"
   *   }
   * }
   * 
   * Response (404):
   * {
   *   "success": false,
   *   "message": "Project not found",
   *   "error": {
   *     "code": "RESOURCE_NOT_FOUND",
   *     "details": "Project with ID 64a7b8c9d2e3f4a5b6c7d8eb does not exist"
   *   }
   * }
   * ```
   */
  @Get(':id')
  async read(@Param('id') id: string) {
    if (!id) throw new Error('Id is required');
    return await this._projectService.read(id);
  }

  /**
   * Get all projects with optional filtering
   * 
   * Retrieves a list of projects with support for filtering, pagination,
   * and sorting. Query parameters can be used to refine the results.
   * 
   * @route GET /project
   * @param {object} query - Optional query parameters for filtering
   * @returns {Promise<TRepositoryResponse<TProject[]>>} Array of projects
   * 
   * @example
   * ```http
   * GET /project?page=1&limit=10&sort=createdAt:desc&search=e-commerce
   * Authorization: Bearer <jwt-token>
   * 
   * Response (200):
   * {
   *   "success": true,
   *   "message": "Projects retrieved successfully",
   *   "data": [
   *     {
   *       "id": "64a7b8c9d2e3f4a5b6c7d8eb",
   *       "name": "E-commerce Website",
   *       "status": "in-progress",
   *       "createdAt": "2024-01-10T10:30:00.000Z"
   *     },
   *     {
   *       "id": "64a7b8c9d2e3f4a5b6c7d8ec",
   *       "name": "E-commerce Mobile App",
   *       "status": "planning",
   *       "createdAt": "2024-01-09T15:45:00.000Z"
   *     }
   *   ],
   *   "pagination": {
   *     "page": 1,
   *     "limit": 10,
   *     "total": 25,
   *     "pages": 3
   *   }
   * }
   * ```
   */
  @Get('')
  async readAll(@Query() query?: any) {
    const args: TSearch<TProject> = query || undefined;
    return await this._projectService.readAll(args);
  }

  /**
   * Update an existing project
   * 
   * Updates a project with new data. Only provided fields are updated,
   * supporting partial updates. Validates the request body against
   * the UpdateProjectDTO schema.
   * 
   * @route PUT /project
   * @param {UpdateProjectDTO} data - Project update data with ID
   * @returns {Promise<TRepositoryResponse<TProject>>} Updated project data
   * 
   * @example
   * ```http
   * PUT /project
   * Content-Type: application/json
   * Authorization: Bearer <jwt-token>
   * 
   * {
   *   "id": "64a7b8c9d2e3f4a5b6c7d8eb",
   *   "name": "E-commerce Website v2",
   *   "status": "in-progress",
   *   "endDate": "2024-07-15T00:00:00.000Z"
   * }
   * 
   * Response (200):
   * {
   *   "success": true,
   *   "message": "Project updated successfully",
   *   "data": {
   *     "id": "64a7b8c9d2e3f4a5b6c7d8eb",
   *     "name": "E-commerce Website v2",
   *     "status": "in-progress",
   *     "endDate": "2024-07-15T00:00:00.000Z",
   *     "updatedAt": "2024-01-15T16:30:00.000Z"
   *   }
   * }
   * ```
   */
  @Put('')
  @Validate(UpdateProjectDTO)
  async update(@Body() data: UpdateProjectDTO) {
    return await this._projectService.update(data);
  }

  /**
   * Delete a project
   * 
   * Soft deletes a project by ID. The project is marked as deleted but
   * remains in the database for audit purposes. Related entities may
   * be archived or cleaned up based on configuration.
   * 
   * @route DELETE /project/:id
   * @param {string} id - Unique project identifier to delete
   * @returns {Promise<TRepositoryResponse<TProject>>} Deleted project data
   * 
   * @example
   * ```http
   * DELETE /project/64a7b8c9d2e3f4a5b6c7d8eb
   * Authorization: Bearer <jwt-token>
   * 
   * Response (200):
   * {
   *   "success": true,
   *   "message": "Project deleted successfully",
   *   "data": {
   *     "id": "64a7b8c9d2e3f4a5b6c7d8eb",
   *     "name": "E-commerce Website",
   *     "status": "deleted",
   *     "deletedAt": "2024-01-15T17:00:00.000Z"
   *   }
   * }
   * 
   * Response (409):
   * {
   *   "success": false,
   *   "message": "Cannot delete project with active tasks",
   *   "error": {
   *     "code": "DELETION_CONFLICT",
   *     "details": "Project has 5 active tasks that must be completed or moved first"
   *   }
   * }
   * ```
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!id) throw new Error('Id is required');
    return await this._projectService.delete(id);
  }
}
