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
} from '@nestjs/common';
/* Types */
import { TFeature } from '@src/planner/types/feature.type';
import { TSearch } from '@src/shared/types/search.type';
/* DTOs */
import { CreateFeatureDTO } from '@src/planner/DTOs/createFeature.dto';
import { UpdateFeatureDTO } from '@src/planner/DTOs/updateFeature.dto';
/* Services */
import { FeatureService } from '@src/planner/services/feature.service';
import { LoggerService } from '@src/shared/services/logger.service';
/* Utils */
import { transformQueryToSearch, SearchQueryParams } from '@src/shared/utils/search.util';
@Controller('feature')
export class FeatureController {
  constructor(
    private _featureService: FeatureService,
    private _loggerService: LoggerService,
  ) {}
  @Get('author')
  author(): { [key: string]: string } {
    this._loggerService.info('FeatureController.author');
    return this._featureService.author();
  }
  @Post('')
  @Validate(CreateFeatureDTO)
  async create(
    @Body() data: CreateFeatureDTO,
    @Query('projectId') projectId: string,
  ) {
    this._loggerService.info('FeatureController.create', 'FeatureController');
    const args = {
      projectId: '',
    };
    if (projectId) args['projectId'] = projectId;
    return await this._featureService.create(data, args);
  }
  @Get(':id')
  async read(@Param('id') id: string) {
    if (!id) throw new Error('Id is required');
    return await this._featureService.read(id);
  }  
  /**
   * Get all features with advanced search and filtering options
   * 
   * Supports comprehensive querying with pagination, sorting, text search,
   * filtering, and advanced options like date ranges and field selection.
   * 
   * @route GET /feature
   * @param {SearchQueryParams} query - Search and filter parameters
   * @returns {Promise<TRepositoryResponse<TFeature[]>>} Array of features with metadata
   * 
   * @example
   * ```http
   * Basic usage:
   * GET /feature
   * 
   * With pagination:
   * GET /feature?page=1&limit=10
   * 
   * With sorting:
   * GET /feature?sort=name:asc,createdAt:desc
   * 
   * With text search:
   * GET /feature?search=authentication&searchFields=name,description
   * 
   * With filters:
   * GET /feature?projectId=64a7b8c9d2e3f4a5b6c7d8e9&status=active
   * 
   * With date range:
   * GET /feature?dateFrom=2024-01-01&dateTo=2024-12-31&dateField=createdAt
   * 
   * Complex query:
   * GET /feature?search=api&page=1&limit=20&sort=priority:desc&status=active&projectId=64a7b8c9d2e3f4a5b6c7d8e9&dateFrom=2024-01-01&select=id,name,status,priority
   * 
   * Available query parameters:
   * - page: Page number (default: 1)
   * - limit: Items per page (default: 10, max: 100)
   * - sort: Sort fields (format: field:order, e.g., "name:asc,createdAt:desc")
   * - search: Text search query
   * - searchFields: Comma-separated fields to search in (e.g., "name,description")
   * - caseSensitive: Case-sensitive search (true/false)
   * - useRegex: Use regex search (true/false)
   * - dateFrom/dateTo: Date range filter (ISO date strings)
   * - dateField: Field to apply date range to (default: createdAt)
   * - select: Comma-separated fields to return
   * - populate: Comma-separated fields to populate
   * - includeDeleted: Include soft-deleted items (true/false)
   * - Any other parameter will be treated as a direct filter (e.g., status=active, projectId=123)
   * ```
   */
  @Get('')
  async readAll(@Query() query: SearchQueryParams) {
    this._loggerService.info('FeatureController.readAll', 'FeatureController');
    
    // Define allowed filter fields for security
    const allowedFilterFields = [
      'projectId', 'status', 'priority', 'categoryId', 'isActive', 
      'createdBy', 'assignedTo', 'tags', 'type'
    ];
    
    const searchArgs: TSearch<TFeature> = transformQueryToSearch<TFeature>(
      query, 
      allowedFilterFields
    );
    
    return await this._featureService.readAll(searchArgs);
  }
  @Put('')
  @Validate(UpdateFeatureDTO)
  async update(@Body() data: UpdateFeatureDTO) {
    return await this._featureService.update(data);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!id) throw new Error('Id is required');
    return await this._featureService.delete(id);
  }
}
