import { Inject, Injectable } from '@nestjs/common';
/* Types */
import { TStatusDAO } from '../types/daoPlanner.type';
import { TStatusRepository } from '../types/repositoryPlanner.type';
import { TRepositoryResponse } from '@src/shared/types/repositoryResponse.type';
import { TStatus } from '../types/status.type';
/* DTOs */
import { CreateStatusDTO } from '../DTOs/createStatus.dto';
import { UpdateStatusDTO } from '../DTOs/updateStatus.dto';
import { TSearch } from '@src/shared/types/search.type';
@Injectable()
export default class StatusRepository implements TStatusRepository {
  constructor(@Inject('StatusDAO') private _statusDAO: TStatusDAO) {}
  /* Create */
  async create(
    data: CreateStatusDTO,
    args?: { projectId: string },
  ): Promise<TRepositoryResponse<TStatus>> {
    try {
      const status: TStatus = await this._statusDAO.create(data);
      return {
        message: 'Status created',
        status: 'success',
        data: status,
      };
    } catch (error) {
      return {
        message: 'Error creating status',
        status: 'error',
        error: error,
      };
    }
  }
  /* Read */
  async read(id: string): Promise<TRepositoryResponse<TStatus>> {
    try {
      const status: TStatus = await this._statusDAO.read(id);
      return {
        message: 'Status found',
        status: 'success',
        data: status as TStatus,
      };
    } catch (error) {
      return {
        message: 'Error reading status',
        status: 'error',
        error: error,
      };
    }
  }
  async readAll(
    args?: TSearch<TStatus>,
  ): Promise<TRepositoryResponse<TStatus[]>> {
    try {
      const result = await this._statusDAO.readAll(args);
      const statuses: TStatus[] = result.items;
      if (!statuses || statuses.length === 0) {
        throw new Error('No statuses found');
      }
      return {
        message: 'Status found',
        status: 'success',
        data: statuses,
        metadata: result.metadata,
      };
    } catch (error) {
      return {
        message: 'Error reading status',
        status: 'error',
        error: error,
      };
    }
  }
  /* Update */
  async update(data: UpdateStatusDTO): Promise<TRepositoryResponse<TStatus>> {
    try {
      const status: TStatus = await this._statusDAO.update(data);
      return {
        message: 'Status updated',
        status: 'success',
        data: status,
      };
    } catch (error) {
      return {
        message: 'Error updating status',
        status: 'error',
        error: error,
      };
    }
  }
  /* Delete */
  async delete(id: string): Promise<TRepositoryResponse<TStatus>> {
    try {
      const status: TStatus = await this._statusDAO.delete(id);
      return {
        message: 'Status deleted',
        status: 'success',
        data: status,
      };
    } catch (error) {
      return {
        message: 'Error deleting status',
        status: 'error',
        error: error,
      };
    }
  }
}
