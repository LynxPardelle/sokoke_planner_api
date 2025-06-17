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
  @Get('')
  async readAll() {
    const args: TSearch<TRequeriment> = undefined;
    return await this._requerimentService.readAll(args);
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
