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
import { TStatus, TStatusParentType } from '@src/planner/types/status.type';
import { TSearch, TSearchQueryParams } from '@src/shared/types/search.type';
/* DTOs */
import { CreateStatusDTO } from '@src/planner/DTOs/createStatus.dto';
import { UpdateStatusDTO } from '@src/planner/DTOs/updateStatus.dto';
/* Services */
import { StatusService } from '@src/planner/services/status.service';
import { LoggerService } from '@src/shared/services/logger.service';
/* Utils */
import { transformQueryToSearch } from '@src/shared/utils/search.util';
@Controller('status')
export class StatusController {
  constructor(
    private _statusService: StatusService,
    private _loggerService: LoggerService,
  ) {}
  @Get('author')
  author(): { [key: string]: string } {
    this._loggerService.info('StatusController.author');
    return this._statusService.author();
  }
  @Post('')
  @Validate(CreateStatusDTO)
  async create(
    @Body() data: CreateStatusDTO,
    @Query('parentId') parentId: string,
    @Query('parentType') parentType: TStatusParentType,
  ) {
    this._loggerService.info('StatusController.create', 'StatusController');
    if (!parentType) throw new Error('Parent type is required');
    const args: {
      parentId: string;
      parentType: TStatusParentType;
    } = {
      parentId: '',
      parentType: 'project',
    };
    if (parentId) args['parentId'] = parentId;
    if (parentType) args['parentType'] = parentType;
    return await this._statusService.create(data, args);
  }
  @Get(':id')
  async read(@Param('id') id: string) {
    if (!id) throw new Error('Id is required');
    return await this._statusService.read(id);
  }  
  /**
   * Get all statuses with advanced search and filtering options
   * 
   * @route GET /status
   * @param {TSearchQueryParams} query - Search and filter parameters
   * @returns {Promise<TRepositoryResponse<TStatus[]>>} Array of statuses with metadata
   * 
   * Available query parameters:
   * - page: Page number (default: 1)
   * - limit: Items per page (default: 10, max: 100)
   * - sort: Sort fields (e.g., "name:asc,order:asc")
   * - search: Text search query
   * - searchFields: Fields to search in (e.g., "name,description")
   * - parentId: Filter by parent ID
   * - parentType: Filter by parent type (project, feature, task)
   * - isActive: Filter by active status (true/false)
   * - isDefault: Filter by default status (true/false)
   */
  @Get('')
  async readAll(@Query() query: TSearchQueryParams) {
    this._loggerService.info('StatusController.readAll', 'StatusController');
    
    const allowedFilterFields = [
      'parentId', 'parentType', 'isActive', 'isDefault', 'order', 'color'
    ];
    
    const searchArgs: TSearch<TStatus> = transformQueryToSearch<TStatus>(
      query, 
      allowedFilterFields
    );
    
    return await this._statusService.readAll(searchArgs);
  }
  @Put('')
  @Validate(UpdateStatusDTO)
  async update(@Body() data: UpdateStatusDTO) {
    return await this._statusService.update(data);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!id) throw new Error('Id is required');
    return await this._statusService.delete(id);
  }
}
