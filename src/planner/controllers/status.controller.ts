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
import { TSearch } from '@src/shared/types/search.type';
/* DTOs */
import { CreateStatusDTO } from '@src/planner/DTOs/createStatus.dto';
import { UpdateStatusDTO } from '@src/planner/DTOs/updateStatus.dto';
/* Services */
import { StatusService } from '@src/planner/services/status.service';
import { LoggerService } from '@src/shared/services/logger.service';
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
  @Get('')
  async readAll() {
    const args: TSearch<TStatus> = undefined;
    return await this._statusService.readAll(args);
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
