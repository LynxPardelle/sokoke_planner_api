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
@Controller('project-sub-category')
export class ProjectSubCategoryController {
  constructor(
    private _projectSubCategoryService: ProjectSubCategoryService,
    private _loggerService: LoggerService,
  ) {}
  @Get('author')
  author(): { [key: string]: string } {
    this._loggerService.info('ProjectSubCategoryController.author');
    return this._projectSubCategoryService.author();
  }  @Post('')
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
  @Get('')
  async readAll() {
    const args: TSearch<TProjectSubCategory> = undefined;
    return await this._projectSubCategoryService.readAll(args);
  }  @Put('')
  async update(@Body() data: UpdateProjectSubCategoryDTO) {
    return await this._projectSubCategoryService.update(data);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!id) throw new Error('Id is required');
    return await this._projectSubCategoryService.delete(id);
  }
}
