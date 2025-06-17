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
import { TProject } from '@src/planner/types/project.type';
import { TSearch } from '@src/shared/types/search.type';
/* DTOs */
import { CreateProjectDTO } from '@src/planner/DTOs/createProject.dto';
import { UpdateProjectDTO } from '@src/planner/DTOs/updateProject.dto';
/* Services */
import { ProjectService } from '@src/planner/services/project.service';
import { LoggerService } from '@src/shared/services/logger.service';
@Controller('project')
export class ProjectController {
  constructor(
    private _projectService: ProjectService,
    private _loggerService: LoggerService,
  ) {}
  @Get('author')
  author(): { [key: string]: string } {
    this._loggerService.info('ProjectController.author');
    return this._projectService.author();
  }
  @Post('')
  @Validate(CreateProjectDTO)
  async create(@Body() data: CreateProjectDTO) {
    this._loggerService.info('ProjectController.create', 'ProjectController');
    return await this._projectService.create(data);
  }
  @Get(':id')
  async read(@Param('id') id: string) {
    if (!id) throw new Error('Id is required');
    return await this._projectService.read(id);
  }
  @Get('')
  async readAll() {
    const args: TSearch<TProject> = undefined;
    return await this._projectService.readAll(args);
  }
  @Put('')
  @Validate(UpdateProjectDTO)
  async update(@Body() data: UpdateProjectDTO) {
    return await this._projectService.update(data);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!id) throw new Error('Id is required');
    return await this._projectService.delete(id);
  }
}
