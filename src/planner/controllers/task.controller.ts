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
import { TSearch } from '@src/shared/types/search.type';
/* DTOs */
import { CreateTaskDTO } from '@src/planner/DTOs/createTask.dto';
import { UpdateTaskDTO } from '@src/planner/DTOs/updateTask.dto';
/* Services */
import { TaskService } from '@src/planner/services/task.service';
import { LoggerService } from '@src/shared/services/logger.service';
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
  @Get('')
  async readAll() {
    const args: TSearch<TTask> = undefined;
    return await this._taskService.readAll(args);
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
