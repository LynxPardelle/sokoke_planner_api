import { Inject, Injectable } from '@nestjs/common';
/* Types */
import { TRequerimentDAO } from '../types/daoPlanner.type';
import { TRequerimentRepository } from '../types/repositoryPlanner.type';
import { TRepositoryResponse } from '@src/shared/types/repositoryResponse.type';
import { TRequeriment } from '../types/requeriment.type';
/* DTOs */
import { CreateRequerimentDTO } from '../DTOs/createRequeriment.dto';
import { UpdateRequerimentDTO } from '../DTOs/updateRequeriment.dto';
import { TSearch } from '@src/shared/types/search.type';
@Injectable()
export default class RequerimentRepository implements TRequerimentRepository {
  constructor(
    @Inject('RequerimentDAO')
    private _requerimentDAO: TRequerimentDAO,
  ) {}
  /* Create */
  async create(
    data: CreateRequerimentDTO,
    args?: { projectId: string },
  ): Promise<TRepositoryResponse<TRequeriment>> {
    try {
      const requeriment: TRequeriment = await this._requerimentDAO.create(data);
      return {
        message: 'Requeriment created',
        status: 'success',
        data: requeriment,
      };
    } catch (error) {
      return {
        message: 'Error creating requeriment',
        status: 'error',
        error: error,
      };
    }
  }
  /* Read */
  async read(id: string): Promise<TRepositoryResponse<TRequeriment>> {
    try {
      const requeriment: TRequeriment = await this._requerimentDAO.read(id);
      return {
        message: 'Requeriment found',
        status: 'success',
        data: requeriment as TRequeriment,
      };
    } catch (error) {
      return {
        message: 'Error reading requeriment',
        status: 'error',
        error: error,
      };
    }
  }
  async readAll(
    args?: TSearch<TRequeriment>,
  ): Promise<TRepositoryResponse<TRequeriment[]>> {
    try {
      const result = await this._requerimentDAO.readAll(args);
      const requeriments: TRequeriment[] = result.items;
      if (!requeriments || requeriments.length === 0) {
        throw new Error('No requeriments found');
      }
      return {
        message: 'Requeriments found',
        status: 'success',
        data: requeriments,
        metadata: result.metadata,
      };
    } catch (error) {
      return {
        message: 'Error reading requeriments',
        status: 'error',
        error: error,
      };
    }
  }
  /* Update */
  async update(
    data: UpdateRequerimentDTO,
  ): Promise<TRepositoryResponse<TRequeriment>> {
    try {
      const requeriment: TRequeriment = await this._requerimentDAO.update(data);
      return {
        message: 'Requeriment updated',
        status: 'success',
        data: requeriment,
      };
    } catch (error) {
      return {
        message: 'Error updating requeriment',
        status: 'error',
        error: error,
      };
    }
  }
  /* Delete */
  async delete(id: string): Promise<TRepositoryResponse<TRequeriment>> {
    try {
      const requeriment: TRequeriment = await this._requerimentDAO.delete(id);
      return {
        message: 'Requeriment deleted',
        status: 'success',
        data: requeriment,
      };
    } catch (error) {
      return {
        message: 'Error deleting requeriment',
        status: 'error',
        error: error,
      };
    }
  }
}
