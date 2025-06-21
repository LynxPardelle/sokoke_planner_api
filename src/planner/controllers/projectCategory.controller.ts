import {
  Controller,
  Get,
  Delete,
  Param,
  Post,
  Put,
  Query,
  Body,
} from '@nestjs/common';
/* Types */
import { TProjectCategory } from '@src/planner/types/projectCategory.type';
import { TSearch, TSearchQueryParams } from '@src/shared/types/search.type';
/* DTOs */
import { CreateProjectCategoryDTO } from '@src/planner/DTOs/createProjectCategory.dto';
import { UpdateProjectCategoryDTO } from '@src/planner/DTOs/updateProjectCategory.dto';
/* Services */
import { ProjectCategoryService } from '@src/planner/services/projectCategory.service';
import { LoggerService } from '@src/shared/services/logger.service';
/* Utils */
import { transformQueryToSearch } from '@src/shared/utils/search.util';
@Controller('project-category')
export class ProjectCategoryController {
  constructor(
    private _projectCategoryService: ProjectCategoryService,
    private _loggerService: LoggerService,
  ) {}
  @Get('author')
  author(): { [key: string]: string } {
    this._loggerService.info('ProjectCategoryController.author');
    return this._projectCategoryService.author();
  }  @Post('')
  async create(@Body() data: CreateProjectCategoryDTO) {
    this._loggerService.info(
      'ProjectCategoryController.create',
      'ProjectCategoryController',
    );
    return await this._projectCategoryService.create(data);
  }
  @Get(':id')
  async read(@Param('id') id: string) {
    if (!id) throw new Error('Id is required');
    return await this._projectCategoryService.read(id);
  }  
  /**
   * Get all project categories with advanced search and filtering options
   * 
   * @route GET /project-category
   * @param {TSearchQueryParams} query - Search and filter parameters
   * @returns {Promise<TRepositoryResponse<TProjectCategory[]>>} Array of categories with metadata
   * 
   * Available query parameters:
   * - page: Page number (default: 1)
   * - limit: Items per page (default: 10, max: 100)
   * - sort: Sort fields (e.g., "name:asc,order:asc")
   * - search: Text search query
   * - searchFields: Fields to search in (e.g., "name,description")
   * - isActive: Filter by active status (true/false)
   * - parentId: Filter by parent category ID
   */
  @Get('')
  async readAll(@Query() query: TSearchQueryParams) {
    this._loggerService.info('ProjectCategoryController.readAll', 'ProjectCategoryController');
    
    const allowedFilterFields = [
      'isActive', 'parentId', 'order', 'color', 'icon'
    ];
    
    const searchArgs: TSearch<TProjectCategory> = transformQueryToSearch<TProjectCategory>(
      query, 
      allowedFilterFields
    );
    
    return await this._projectCategoryService.readAll(searchArgs);
  }
  @Put('')
  async update(@Body() data: UpdateProjectCategoryDTO) {
    return await this._projectCategoryService.update(data);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!id) throw new Error('Id is required');
    return await this._projectCategoryService.delete(id);
  }
}
