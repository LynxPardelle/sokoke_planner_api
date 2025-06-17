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
import { TSearch } from '@src/shared/types/search.type';
/* DTOs */
import { CreateProjectCategoryDTO } from '@src/planner/DTOs/createProjectCategory.dto';
import { UpdateProjectCategoryDTO } from '@src/planner/DTOs/updateProjectCategory.dto';
/* Services */
import { ProjectCategoryService } from '@src/planner/services/projectCategory.service';
import { LoggerService } from '@src/shared/services/logger.service';
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
  @Get('')
  async readAll() {
    const args: TSearch<TProjectCategory> = undefined;
    return await this._projectCategoryService.readAll(args);
  }  @Put('')
  async update(@Body() data: UpdateProjectCategoryDTO) {
    return await this._projectCategoryService.update(data);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!id) throw new Error('Id is required');
    return await this._projectCategoryService.delete(id);
  }
}
