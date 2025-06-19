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
import { TProjectSubCategory } from '@src/planner/types/projectSubCategory.type';
import { TSearch } from '@src/shared/types/search.type';
/* DTOs */
import { CreateProjectSubCategoryDTO } from '@src/planner/DTOs/createProjectSubCategory.dto';
import { UpdateProjectSubCategoryDTO } from '@src/planner/DTOs/updateProjectSubCategory.dto';
/* Services */
import { ProjectSubCategoryService } from '@src/planner/services/projectSubCategory.service';
import { LoggerService } from '@src/shared/services/logger.service';
/* Utils */
import { transformQueryToSearch, SearchQueryParams } from '@src/shared/utils/search.util';
@Controller('project-sub-category')
export class ProjectSubCategoryController {
  constructor(
    private _projectSubCategoryService: ProjectSubCategoryService,
    private _loggerService: LoggerService,
  ) { }
  @Get('author')
  author(): { [key: string]: string } {
    this._loggerService.info('ProjectSubCategoryController.author');
    return this._projectSubCategoryService.author();
  }
  @Post('')
  async create(
    @Body() data: CreateProjectSubCategoryDTO,
    @Query('projectCategoryId') projectCategoryId: string,
  ) {
    this._loggerService.info(
      'ProjectSubCategoryController.create',
      'ProjectSubCategoryController',
    );
    const args = {
      projectCategoryId: '',
    };
    if (projectCategoryId) args['projectCategoryId'] = projectCategoryId;
    return await this._projectSubCategoryService.create(data, args);
  }
  @Get(':id')
  async read(@Param('id') id: string) {
    if (!id) throw new Error('Id is required');
    return await this._projectSubCategoryService.read(id);
  }  
  /**
   * Get all project subcategories with advanced search and filtering options
   * 
   * @route GET /project-sub-category
   * @param {SearchQueryParams} query - Search and filter parameters
   * @returns {Promise<TRepositoryResponse<TProjectSubCategory[]>>} Array of subcategories with metadata
   * 
   * Available query parameters:
   * - page: Page number (default: 1)
   * - limit: Items per page (default: 10, max: 100)
   * - sort: Sort fields (e.g., "name:asc,order:asc")
   * - search: Text search query
   * - searchFields: Fields to search in (e.g., "name,description")
   * - projectCategoryId: Filter by parent category ID
   * - isActive: Filter by active status (true/false)
   */
  @Get('')
  async readAll(@Query() query: SearchQueryParams) {
    this._loggerService.info('ProjectSubCategoryController.readAll', 'ProjectSubCategoryController');

    const allowedFilterFields = [
      'projectCategoryId', 'isActive', 'order', 'color', 'icon'
    ];

    const searchArgs: TSearch<TProjectSubCategory> = transformQueryToSearch<TProjectSubCategory>(
      query,
      allowedFilterFields
    );

    return await this._projectSubCategoryService.readAll(searchArgs);
  }
  @Put('')
  async update(@Body() data: UpdateProjectSubCategoryDTO) {
    return await this._projectSubCategoryService.update(data);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!id) throw new Error('Id is required');
    return await this._projectSubCategoryService.delete(id);
  }
}
