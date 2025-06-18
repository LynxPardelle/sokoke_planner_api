import { Inject, Injectable } from '@nestjs/common';
/* Types */
import { TRepositoryResponse } from '@src/shared/types/repositoryResponse.type';
import { TUserRepository } from '../types/repositoryUser.type';
import { TUser } from '../types/user.type';
import { TSearch, TSearchResult } from '@src/shared/types/search.type';
/* DAOs */
import { TUserDAO } from '../types/daoUser.type';
/* DTOs */
import { CreateUserDTO } from '../DTOs/createUser.dto';
import { UpdateUserDTO } from '../DTOs/updateUser.dto';
/* Services */
import { LoggerService } from '@src/shared/services/logger.service';
@Injectable()
export default class UserRepository implements TUserRepository {
  constructor(
    @Inject('UserDAO') private _userDAO: TUserDAO,
    private _loggerService: LoggerService,
  ) { }
  /* Create */
  async create(data: CreateUserDTO): Promise<TRepositoryResponse<TUser>> {
    try {
      this._loggerService.info(
        `data: ${JSON.stringify(data)}`,
        'UserRepository.create',
      );
      let newUser: TUser = await this._userDAO.create(data);
      this._loggerService.info(
        `newUser: ${JSON.stringify(newUser)}`,
        'UserRepository.create',
      );
      if (!newUser || !newUser._id) {
        throw new Error('Error creating user');
      }
      return {
        message: 'User created',
        status: 'success',
        data: newUser,
      };
    } catch (error: unknown) {
      const err = error as Error;
      this._loggerService.error(
        `error: ${err.message}`,
        'UserRepository.create',
      );
      return {
        message: err.message,
        status: 'error',
        error,
      };
    }
  }
  /* Read */
  async read(id: string): Promise<TRepositoryResponse<TUser>> {
    try {
      this._loggerService.info(`id: ${id}`, 'UserRepository.read');
      let user: TUser = await this._userDAO.read(id);
      this._loggerService.info(
        `user: ${JSON.stringify(user)}`,
        'UserRepository.read',
      );
      return {
        message: 'User found',
        status: 'success',
        data: user,
      };
    } catch (error: unknown) {
      const err = error as Error;
      this._loggerService.error(
        `error: ${err.message}`,
        'UserRepository.read',
      );
      return {
        message: err.message,
        status: 'error',
        error,
      };
    }
  }
  /* Read All */
  async readAll(args?: TSearch<TUser>): Promise<TRepositoryResponse<TUser[]>> {
    try {
      this._loggerService.info(
        `args: ${JSON.stringify(args)}`,
        'UserRepository.readAll',
      );
      const result: TSearchResult<TUser> = await this._userDAO.readAll(args);
      this._loggerService.info(
        `users: ${JSON.stringify(result.items)}`,
        'UserRepository.readAll',
      );
      const users: TUser[] = result.items;
      if (!users || users.length === 0) {
        throw new Error('No users found');
      }
      return {
        message: 'Users found',
        status: 'success',
        data: users,
        metadata: result.metadata,
      };
    } catch (error: unknown) {
      const err = error as Error;
      this._loggerService.error(
        `error: ${err.message}`,
        'UserRepository.readAll',
      );
      return {
        message: err.message,
        status: 'error',
        error,
      };
    }
  }
  /* Update */
  async update(data: UpdateUserDTO): Promise<TRepositoryResponse<TUser>> {
    try {
      this._loggerService.info(
        `data: ${JSON.stringify(data)}`,
        'UserRepository.update',
      );
      let updatedUser: TUser = await this._userDAO.update(data);
      this._loggerService.info(
        `updatedUser: ${JSON.stringify(updatedUser)}`,
        'UserRepository.update',
      );
      return {
        message: 'User updated',
        status: 'success',
        data: updatedUser,
      };
    } catch (error: unknown) {
      const err = error as Error;
      this._loggerService.error(
        `error: ${err.message}`,
        'UserRepository.update',
      );
      return {
        message: err.message,
        status: 'error',
        error,
      };
    }
  }
  /* Delete */
  async delete(id: string): Promise<TRepositoryResponse<TUser>> {
    try {
      this._loggerService.info(`id: ${id}`, 'UserRepository.delete');
      let deletedUser: TUser = await this._userDAO.delete(id);
      this._loggerService.info(
        `deletedUser: ${JSON.stringify(deletedUser)}`,
        'UserRepository.delete',
      );
      return {
        message: 'User deleted',
        status: 'success',
        data: deletedUser,
      };
    } catch (error: unknown) {
      const err = error as Error;
      this._loggerService.error(
        `error: ${err.message}`,
        'UserRepository.delete',
      );
      return {
        message: err.message,
        status: 'error',
        error: err,
      };
    }
  }
}
