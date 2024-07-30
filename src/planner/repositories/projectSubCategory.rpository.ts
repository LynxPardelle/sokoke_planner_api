import { Inject, Injectable } from '@nestjs/common';
/* Types */
import { TProjectSubCategoryDAO } from '../types/daoPlanner.type';
import { TProjectSubCategoryRepository } from '../types/repositoryProject.type';
import { TRepositoryResponse } from '@src/shared/types/repositoryResponse.type';
import { TProjectSubCategory } from '../types/projectSubCategory.type';
/* DTOs */
import { CreateProjectSubCategoryDTO } from '../DTOs/createProjectSubCategory.dto';
import { UpdateProjectSubCategoryDTO } from '../DTOs/updateProjectSubCategory.dto';
import { TSearch } from '@src/shared/types/search.type';
@Injectable()
export default class ProjectSubCategoryRepository
  implements TProjectSubCategoryRepository
{
  constructor(
    @Inject('ProjectSubCategoryDAO')
    private _projectSubCategoryDAO: TProjectSubCategoryDAO,
  ) {}
  /* Create */
  async create(
    data: CreateProjectSubCategoryDTO,
    args?: { projectId: string },
  ): Promise<TRepositoryResponse<TProjectSubCategory>> {
    try {
      const projectSubCategory: TProjectSubCategory =
        await this._projectSubCategoryDAO.create(data);
      return {
        message: 'Project sub category created',
        status: 'success',
        data: projectSubCategory,
      };
    } catch (error) {
      return {
        message: 'Error creating project sub category',
        status: 'error',
        error: error,
      };
    }
  }
  /* Read */
  async read(id: string): Promise<TRepositoryResponse<TProjectSubCategory>> {
    try {
      const projectSubCategory: TProjectSubCategory =
        await this._projectSubCategoryDAO.read(id);
      return {
        message: 'Project sub category found',
        status: 'success',
        data: projectSubCategory as TProjectSubCategory,
      };
    } catch (error) {
      return {
        message: 'Error reading project sub category',
        status: 'error',
        error: error,
      };
    }
  }
  async readAll(
    args?: TSearch<TProjectSubCategory>,
  ): Promise<TRepositoryResponse<TProjectSubCategory[]>> {
    try {
      const projectSubCategories: TProjectSubCategory[] =
        await this._projectSubCategoryDAO.readAll(args);
      return {
        message: 'Project sub categories found',
        status: 'success',
        data: projectSubCategories as TProjectSubCategory[],
      };
    } catch (error) {
      return {
        message: 'Error reading project sub categories',
        status: 'error',
        error: error,
      };
    }
  }
  /* Update */
  async update(
    data: UpdateProjectSubCategoryDTO,
  ): Promise<TRepositoryResponse<TProjectSubCategory>> {
    try {
      const projectSubCategory: TProjectSubCategory =
        await this._projectSubCategoryDAO.update(data);
      return {
        message: 'Project sub category updated',
        status: 'success',
        data: projectSubCategory,
      };
    } catch (error) {
      return {
        message: 'Error updating project sub category',
        status: 'error',
        error: error,
      };
    }
  }
  /* Delete */
  async delete(id: string): Promise<TRepositoryResponse<TProjectSubCategory>> {
    try {
      const projectSubCategory: TProjectSubCategory =
        await this._projectSubCategoryDAO.delete(id);
      return {
        message: 'Project sub category deleted',
        status: 'success',
        data: projectSubCategory,
      };
    } catch (error) {
      return {
        message: 'Error deleting project sub category',
        status: 'error',
        error: error,
      };
    }
  }
}
