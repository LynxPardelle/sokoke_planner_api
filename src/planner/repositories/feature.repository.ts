import { Inject, Injectable } from '@nestjs/common';
/* Types */
import { TFeatureDAO } from '../types/daoPlanner.type';
import { TFeatureRepository } from '../types/repositoryPlanner.type';
import { TRepositoryResponse } from '@src/shared/types/repositoryResponse.type';
import { TFeature } from '../types/feature.type';
/* DTOs */
import { CreateFeatureDTO } from '../DTOs/createFeature.dto';
import { UpdateFeatureDTO } from '../DTOs/updateFeature.dto';
import { TSearch } from '@src/shared/types/search.type';
@Injectable()
export default class FeatureRepository implements TFeatureRepository {
  constructor(@Inject('FeatureDAO') private _featureDAO: TFeatureDAO) {}
  /* Create */
  async create(
    data: CreateFeatureDTO,
    args?: { projectId: string },
  ): Promise<TRepositoryResponse<TFeature>> {
    try {
      const feature: TFeature = await this._featureDAO.create(data);
      return {
        message: 'Feature created',
        status: 'success',
        data: feature,
      };
    } catch (error) {
      return {
        message: 'Error creating feature',
        status: 'error',
        error: error,
      };
    }
  }
  /* Read */
  async read(id: string): Promise<TRepositoryResponse<TFeature>> {
    try {
      const feature: TFeature = await this._featureDAO.read(id);
      return {
        message: 'Feature found',
        status: 'success',
        data: feature as TFeature,
      };
    } catch (error) {
      return {
        message: 'Error reading feature',
        status: 'error',
        error: error,
      };
    }
  }
  async readAll(
    args?: TSearch<TFeature>,
  ): Promise<TRepositoryResponse<TFeature[]>> {
    try {
      const result = await this._featureDAO.readAll(args);
      const features: TFeature[] = result.items;
      if (!features || features.length === 0) {
        throw new Error('No features found');
      }
      return {
        message: 'Features found',
        status: 'success',
        data: features,
        metadata: result.metadata,
      };
    } catch (error) {
      return {
        message: 'Error reading features',
        status: 'error',
        error: error,
      };
    }
  }
  /* Update */
  async update(data: UpdateFeatureDTO): Promise<TRepositoryResponse<TFeature>> {
    try {
      const feature: TFeature = await this._featureDAO.update(data);
      return {
        message: 'Feature updated',
        status: 'success',
        data: feature as TFeature,
      };
    } catch (error) {
      return {
        message: 'Error updating feature',
        status: 'error',
        error: error,
      };
    }
  }
  /* Delete */
  async delete(id: string): Promise<TRepositoryResponse<TFeature>> {
    try {
      const feature: TFeature = await this._featureDAO.delete(id);
      return {
        message: 'Feature deleted',
        status: 'success',
        data: feature as TFeature,
      };
    } catch (error) {
      return {
        message: 'Error deleting feature',
        status: 'error',
        error: error,
      };
    }
  }
}
