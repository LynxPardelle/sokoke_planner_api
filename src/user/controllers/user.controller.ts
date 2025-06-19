import {
  Controller,
  Get,
  Delete,
  Param,
  Post,
  Put,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
/* Types */
import { TUser } from '@src/user/types/user.type';
import { TSearch } from '@src/shared/types/search.type';
/* DTOs */
import { CreateUserDTO } from '@src/user/DTOs/createUser.dto';
import { UpdateUserDTO } from '@src/user/DTOs/updateUser.dto';
/* Services */
import { UserService } from '@src/user/services/user.service';
import { LoggerService } from '@src/shared/services/logger.service';
/* Utils */
import { transformQueryToSearch, SearchQueryParams } from '@src/shared/utils/search.util';

@Controller('user')
export class UserController {
  constructor(
    private _userService: UserService,
    private _loggerService: LoggerService,
  ) { }

  @Get('author')
  author(): { [key: string]: string } {
    this._loggerService.info('UserController.author');
    return this._userService.author();
  }
  @Post('')
  async create(@Body() data: CreateUserDTO) {
    this._loggerService.info('UserController.create', 'UserController');
    this._loggerService.info(
      `data: ${JSON.stringify(data)}`,
      'UserController.create',
    );
    return await this._userService.create(data);
  }
  @Get(':id')
  async read(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Id is required');
    }
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return await this._userService.read(id);
  }
  /**
   * Get all users with advanced search and filtering options
   * 
   * @route GET /user
   * @param {SearchQueryParams} query - Search and filter parameters
   * @returns {Promise<TRepositoryResponse<TUser[]>>} Array of users with metadata
   * 
   * Available query parameters:
   * - page: Page number (default: 1)
   * - limit: Items per page (default: 10, max: 100)
   * - sort: Sort fields (e.g., "name:asc,createdAt:desc")
   * - search: Text search query
   * - searchFields: Fields to search in (e.g., "name,email,username")
   * - isActive: Filter by active status (true/false)
   * - role: Filter by user role
   * - isVerified: Filter by verification status (true/false)
   */
  @Get('')
  async readAll(@Query() query: SearchQueryParams) {
    this._loggerService.info('UserController.readAll', 'UserController');

    const allowedFilterFields = [
      'isActive', 'role', 'isVerified', 'department', 'status'
    ];

    const searchArgs: TSearch<TUser> = transformQueryToSearch<TUser>(
      query,
      allowedFilterFields
    );

    return await this._userService.readAll(searchArgs);
  }
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateUserDTO) {
    if (!id) {
      throw new BadRequestException('Id is required');
    }
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    // Set the ID from the URL parameter to the DTO
    data._id = id;
    return await this._userService.update(data);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Id is required');
    }
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return await this._userService.delete(id);
  }
}
