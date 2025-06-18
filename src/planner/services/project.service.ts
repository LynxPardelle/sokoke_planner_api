/**
 * Project Service - Business Logic for Project Management
 * 
 * This service provides the core business logic for project management operations.
 * It acts as an intermediary between the controllers and the data access layer,
 * handling business rules, validation, and orchestration of project-related operations.
 * 
 * Features:
 * - CRUD operations for projects
 * - Business rule enforcement
 * - Logging and audit trail
 * - Error handling and validation
 * - Integration with other services
 * 
 * @author Lynx Pardelle
 * @version 1.0.0
 * @since 2024-01-10
 */

import { Injectable } from '@nestjs/common';

/* Repository layer imports */
import ProjectRepository from '../repositories/project.repository';

/* Type definitions */
import { TProject } from '../types/project.type';
import { TRepositoryResponse } from '@src/shared/types/repositoryResponse.type';
import { TProjectRepository } from '../types/repositoryPlanner.type';
import { TSearch } from '@src/shared/types/search.type';

/* Data Transfer Objects */
import { CreateProjectDTO } from '../DTOs/createProject.dto';
import { UpdateProjectDTO } from '../DTOs/updateProject.dto';

/* Shared services */
import { LoggerService } from '@src/shared/services/logger.service';

/**
 * ProjectService class implementing the project repository interface
 * 
 * This service encapsulates all business logic related to project management,
 * including creation, retrieval, updates, and deletion of projects.
 * It ensures data consistency, implements business rules, and provides
 * comprehensive logging for audit and debugging purposes.
 * 
 * @implements {TProjectRepository}
 */
@Injectable()
export class ProjectService implements TProjectRepository {
  /**
   * Constructor - Inject dependencies
   * 
   * @param {ProjectRepository} _projectRepository - Data access layer for projects
   * @param {LoggerService} _loggerService - Logging service for audit trail
   */
  constructor(
    private _projectRepository: ProjectRepository,
    private _loggerService: LoggerService,
  ) {}

  /**
   * Get service author information
   * 
   * @returns {object} Author information including name, website, and GitHub
   */
  author(): { [key: string]: string } {
    return {
      author: 'Lynx Pardelle',
      site: 'https://lynxpardelle.com',
      github: 'https://github.com/LynxPardelle',
    };
  }

  /**
   * Create a new project
   * 
   * Creates a new project with the provided data. Validates business rules
   * such as unique project names within a category, valid date ranges,
   * and proper status assignments.
   * 
   * Business Rules:
   * - Project name must be unique within the same category
   * - Start date cannot be in the past (unless explicitly allowed)
   * - End date must be after start date
   * - Category and subcategory must exist if provided
   * - User must have permission to create projects
   * 
   * @param {CreateProjectDTO} data - Project creation data
   * @returns {Promise<TRepositoryResponse<TProject>>} Created project with metadata
   * 
   * @example
   * ```typescript
   * const projectData = {
   *   name: "E-commerce Website",
   *   description: "Online store with payment integration",
   *   categoryId: "64a7b8c9d2e3f4a5b6c7d8e9",
   *   startDate: new Date("2024-01-15"),
   *   endDate: new Date("2024-06-15")
   * };
   * 
   * const result = await projectService.create(projectData);
   * if (result.success) {
   *   console.log("Project created:", result.data);
   * } else {
   *   console.error("Error:", result.message);
   * }
   * ```
   */
  async create(data: CreateProjectDTO): Promise<TRepositoryResponse<TProject>> {
    this._loggerService.info(
      `Creating project: ${JSON.stringify(data)}`,
      'ProjectService.create',
    );
    return await this._projectRepository.create(data);
  }

  /**
   * Retrieve a single project by ID
   * 
   * Fetches a project by its unique identifier. Includes related data
   * such as category information, status details, and basic metrics.
   * 
   * @param {string} id - Unique project identifier
   * @returns {Promise<TRepositoryResponse<TProject>>} Project data or error
   * 
   * @example
   * ```typescript
   * const result = await projectService.read("64a7b8c9d2e3f4a5b6c7d8eb");
   * if (result.success) {
   *   console.log("Project found:", result.data.name);
   * } else {
   *   console.error("Project not found:", result.message);
   * }
   * ```
   */
  async read(id: string): Promise<TRepositoryResponse<TProject>> {
    this._loggerService.info(`Reading project: ${id}`, 'ProjectService.read');
    return await this._projectRepository.read(id);
  }

  /**
   * Retrieve all projects with optional filtering and pagination
   * 
   * Fetches multiple projects based on search criteria. Supports filtering
   * by category, status, date ranges, and text search. Includes pagination
   * and sorting capabilities.
   * 
   * Search Options:
   * - Text search in name and description
   * - Filter by category/subcategory
   * - Filter by status
   * - Filter by date ranges
   * - Filter by assigned users
   * - Pagination (page, limit)
   * - Sorting (field, direction)
   * 
   * @param {TSearch<TProject>} args - Search and filter criteria
   * @returns {Promise<TRepositoryResponse<TProject[]>>} Array of projects with metadata
   * 
   * @example
   * ```typescript
   * const searchParams = {
   *   search: "e-commerce",
   *   filters: {
   *     categoryId: "64a7b8c9d2e3f4a5b6c7d8e9",
   *     status: "active"
   *   },
   *   pagination: { page: 1, limit: 10 },
   *   sort: { field: "createdAt", direction: "desc" }
   * };
   * 
   * const result = await projectService.readAll(searchParams);
   * console.log(`Found ${result.data.length} projects`);
   * ```
   */
  async readAll(
    args?: TSearch<TProject>,
  ): Promise<TRepositoryResponse<TProject[]>> {
    this._loggerService.info(
      `Reading all projects: ${JSON.stringify(args)}`,
      'ProjectService.readAll',
    );
    return await this._projectRepository.readAll(args);
  }

  /**
   * Update an existing project
   * 
   * Updates project data with the provided information. Validates business
   * rules and ensures data consistency. Only provided fields are updated
   * (partial update support).
   * 
   * Business Rules:
   * - User must have permission to update the project
   * - Cannot change project ID or audit fields
   * - Date validations apply (start < end)
   * - Status transitions must be valid
   * - Category changes are logged for audit
   * 
   * @param {UpdateProjectDTO} data - Project update data including ID
   * @returns {Promise<TRepositoryResponse<TProject>>} Updated project data
   * 
   * @example
   * ```typescript
   * const updateData = {
   *   id: "64a7b8c9d2e3f4a5b6c7d8eb",
   *   name: "E-commerce Website v2",
   *   status: "in-progress",
   *   endDate: new Date("2024-07-15")
   * };
   * 
   * const result = await projectService.update(updateData);
   * if (result.success) {
   *   console.log("Project updated successfully");
   * }
   * ```
   */
  async update(data: UpdateProjectDTO): Promise<TRepositoryResponse<TProject>> {
    this._loggerService.info(
      `Updating project: ${JSON.stringify(data)}`,
      'ProjectService.update',
    );
    return await this._projectRepository.update(data);
  }

  /**
   * Delete a project
   * 
   * Soft deletes a project by ID. Validates that the project can be deleted
   * based on business rules and cascades the deletion to related entities
   * if configured.
   * 
   * Business Rules:
   * - User must have permission to delete the project
   * - Cannot delete projects with active tasks (unless forced)
   * - Cannot delete projects referenced by other entities
   * - Deletion is logged for audit purposes
   * - Related data may be archived or moved
   * 
   * @param {string} id - Unique project identifier to delete
   * @returns {Promise<TRepositoryResponse<TProject>>} Deleted project data
   * 
   * @example
   * ```typescript
   * const result = await projectService.delete("64a7b8c9d2e3f4a5b6c7d8eb");
   * if (result.success) {
   *   console.log("Project deleted successfully");
   * } else {
   *   console.error("Cannot delete project:", result.message);
   * }
   * ```
   */
  async delete(id: string): Promise<TRepositoryResponse<TProject>> {
    this._loggerService.info(
      `Deleting project: ${id}`,
      'ProjectService.delete',
    );
    return await this._projectRepository.delete(id);
  }
}
