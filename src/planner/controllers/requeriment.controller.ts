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
import { TRequeriment } from '@src/planner/types/requeriment.type';
import { TSearch } from '@src/shared/types/search.type';
/* DTOs */
import { CreateRequerimentDTO } from '@src/planner/DTOs/createRequeriment.dto';
import { UpdateRequerimentDTO } from '@src/planner/DTOs/updateRequeriment.dto';
/* Services */
import { RequerimentService } from '@src/planner/services/requeriment.service';
import { LoggerService } from '@src/shared/services/logger.service';
/* Utils */
import { transformQueryToSearch, SearchQueryParams } from '@src/shared/utils/search.util';
@Controller('requeriment')
export class RequerimentController {
  constructor(
    private _requerimentService: RequerimentService,
    private _loggerService: LoggerService,
  ) {}
  @Get('author')
  author(): { [key: string]: string } {
    this._loggerService.info('RequerimentController.author');
    return this._requerimentService.author();
  }
  @Post('')
  @Validate(CreateRequerimentDTO)
  async create(
    @Body() data: CreateRequerimentDTO,
    @Query('projectId') projectId: string,
  ) {
    this._loggerService.info(
      'RequerimentController.create',
      'RequerimentController',
    );
    const args = {
      projectId: '',
    };
    if (projectId) args['projectId'] = projectId;
    return await this._requerimentService.create(data, args);
  }
  @Get(':id')
  async read(@Param('id') id: string) {
    if (!id) throw new Error('Id is required');
    return await this._requerimentService.read(id);
  }  
  /**
   * Get all requirements with advanced search and filtering options
   * 
   * @route GET /requeriment
   * @param {SearchQueryParams} query - Search and filter parameters
   * @returns {Promise<TRepositoryResponse<TRequeriment[]>>} Array of requirements with metadata
   * 
   * Available query parameters:
   * - page: Page number (default: 1)
   * - limit: Items per page (default: 10, max: 100)
   * - sort: Sort fields (e.g., "priority:desc,title:asc")
   * - search: Text search query
   * - searchFields: Fields to search in (e.g., "title,description")
   * - projectId: Filter by project ID
   * - status: Filter by requirement status
   * - priority: Filter by priority level
   * - type: Filter by requirement type
   * - isActive: Filter by active status (true/false)
   */
  @Get('')
  async readAll(@Query() query: SearchQueryParams) {
    this._loggerService.info('RequerimentController.readAll', 'RequerimentController');
    
    const allowedFilterFields = [
      'projectId', 'status', 'priority', 'type', 'isActive', 'assignedTo', 'categoryId'
    ];
    
    const searchArgs: TSearch<TRequeriment> = transformQueryToSearch<TRequeriment>(
      query, 
      allowedFilterFields
    );
    
    return await this._requerimentService.readAll(searchArgs);
  }
  @Put('')
  @Validate(UpdateRequerimentDTO)
  async update(@Body() data: UpdateRequerimentDTO) {
    return await this._requerimentService.update(data);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!id) throw new Error('Id is required');
    return await this._requerimentService.delete(id);
  }
}
