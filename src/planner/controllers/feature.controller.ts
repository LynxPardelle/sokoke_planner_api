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
  @Get('')
  async readAll() {
    const args: TSearch<TFeature> = undefined;
    return await this._featureService.readAll(args);
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
