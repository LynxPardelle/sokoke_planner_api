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
import { TTask, TTaskParentType } from '@src/planner/types/task.type';
import { TSearch, TSearchQueryParams } from '@src/shared/types/search.type';
/* DTOs */
import { CreateTaskDTO } from '@src/planner/DTOs/createTask.dto';
import { UpdateTaskDTO } from '@src/planner/DTOs/updateTask.dto';
/* Services */
import { TaskService } from '@src/planner/services/task.service';
import { LoggerService } from '@src/shared/services/logger.service';
/* Utils */
import { transformQueryToSearch } from '@src/shared/utils/search.util';
@Controller('task')
export class TaskController {
  constructor(
    private _taskService: TaskService,
    private _loggerService: LoggerService,
  ) {}
  @Get('author')
  author(): { [key: string]: string } {
    this._loggerService.info('TaskController.author');
    return this._taskService.author();
  }
  @Post('')
  @Validate(CreateTaskDTO)
  async create(
    @Body() data: CreateTaskDTO,
    @Query('parentId') parentId: string,
    @Query('parentType') parentType: TTaskParentType,
  ) {
    this._loggerService.info('TaskController.create', 'TaskController');
    if (!parentType) throw new Error('Parent type is required');
    const args: {
      parentId: string;
      parentType: TTaskParentType;
    } = {
      parentId: '',
      parentType: 'project',
    };
    if (parentId) args['parentId'] = parentId;
    if (parentType) args['parentType'] = parentType;
    return await this._taskService.create(data, args);
  }
  @Get(':id')
  async read(@Param('id') id: string) {
    if (!id) throw new Error('Id is required');
    return await this._taskService.read(id);
  }  
  /**
   * Get all tasks with advanced search and filtering options
   * 
   * Supports comprehensive querying with pagination, sorting, text search,
   * filtering, and advanced options like date ranges and field selection.
   * 
   * @route GET /task
   * @param {TSearchQueryParams} query - Search and filter parameters
   * @returns {Promise<TRepositoryResponse<TTask[]>>} Array of tasks with metadata
   * 
   * Available query parameters:
   * - page: Page number (default: 1)
   * - limit: Items per page (default: 10, max: 100)
   * - sort: Sort fields (e.g., "priority:desc,dueDate:asc")
   * - search: Text search query
   * - searchFields: Fields to search in (e.g., "title,description")
   * - parentId: Filter by parent (project/feature) ID
   * - parentType: Filter by parent type (project, feature)
   * - status: Filter by task status
   * - priority: Filter by priority level
   * - assignedTo: Filter by assigned user ID
   * - isCompleted: Filter by completion status (true/false)
   * - dateFrom/dateTo: Date range filter
   * - dateField: Field for date range (default: createdAt)
   */
  @Get('')
  async readAll(@Query() query: TSearchQueryParams) {
    this._loggerService.info('TaskController.readAll', 'TaskController');
    
    const allowedFilterFields = [
      'parentId', 'parentType', 'status', 'priority', 'assignedTo', 
      'isCompleted', 'tags', 'categoryId', 'projectId', 'featureId'
    ];
    
    const searchArgs: TSearch<TTask> = transformQueryToSearch<TTask>(
      query, 
      allowedFilterFields
    );
    
    return await this._taskService.readAll(searchArgs);
  }
  @Put('')
  @Validate(UpdateTaskDTO)
  async update(@Body() data: UpdateTaskDTO) {
    return await this._taskService.update(data);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!id) throw new Error('Id is required');
    return await this._taskService.delete(id);
  }
}
