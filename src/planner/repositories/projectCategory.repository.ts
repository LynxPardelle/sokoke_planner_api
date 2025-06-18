import { Inject, Injectable } from '@nestjs/common';
/* Types */
import { TProjectCategoryDAO } from '../types/daoPlanner.type';
import { TProjectCategoryRepository } from '../types/repositoryPlanner.type';
import { TRepositoryResponse } from '@src/shared/types/repositoryResponse.type';
import { TProjectCategory } from '../types/projectCategory.type';
/* DTOs */
import { CreateProjectCategoryDTO } from '../DTOs/createProjectCategory.dto';
import { UpdateProjectCategoryDTO } from '../DTOs/updateProjectCategory.dto';
import { TSearch } from '@src/shared/types/search.type';
@Injectable()
export default class ProjectCategoryRepository
  implements TProjectCategoryRepository
{
  constructor(
    @Inject('ProjectCategoryDAO')
    private _projectCategoryDAO: TProjectCategoryDAO,
  ) {}
  /* Create */
  async create(
    data: CreateProjectCategoryDTO,
    args?: { projectId: string },
  ): Promise<TRepositoryResponse<TProjectCategory>> {
    try {
      const projectCategory: TProjectCategory =
        await this._projectCategoryDAO.create(data);
      return {
        message: 'Project category created',
        status: 'success',
        data: projectCategory,
      };
    } catch (error) {
      return {
        message: 'Error creating project category',
        status: 'error',
        error: error,
      };
    }
  }
  /* Read */
  async read(id: string): Promise<TRepositoryResponse<TProjectCategory>> {
    try {
      const projectCategory: TProjectCategory =
        await this._projectCategoryDAO.read(id);
      return {
        message: 'Project category found',
        status: 'success',
        data: projectCategory as TProjectCategory,
      };
    } catch (error) {
      return {
        message: 'Error reading project category',
        status: 'error',
        error: error,
      };
    }
  }
  async readAll(
    args?: TSearch<TProjectCategory>,
  ): Promise<TRepositoryResponse<TProjectCategory[]>> {
    try {
      const result = await this._projectCategoryDAO.readAll(args);
      const categories = result.items;
      if (!categories || categories.length === 0) {
        throw new Error('No project categories found');
      }
      return {
        message: 'Project categories found',
        status: 'success',
        data: categories,
        metadata: result.metadata,
      };
    } catch (error) {
      return {
        message: 'Error reading project categories',
        status: 'error',
        error: error,
      };
    }
  }
  /* Update */
  async update(
    data: UpdateProjectCategoryDTO,
  ): Promise<TRepositoryResponse<TProjectCategory>> {
    try {
      const projectCategory: TProjectCategory =
        await this._projectCategoryDAO.update(data);
      return {
        message: 'Project category updated',
        status: 'success',
        data: projectCategory,
      };
    } catch (error) {
      return {
        message: 'Error updating project category',
        status: 'error',
        error: error,
      };
    }
  }
  /* Delete */
  async delete(id: string): Promise<TRepositoryResponse<TProjectCategory>> {
    try {
      const projectCategory: TProjectCategory =
        await this._projectCategoryDAO.delete(id);
      return {
        message: 'Project category deleted',
        status: 'success',
        data: projectCategory,
      };
    } catch (error) {
      return {
        message: 'Error deleting project category',
        status: 'error',
        error: error,
      };
    }
  }
}
