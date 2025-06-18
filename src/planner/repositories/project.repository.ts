import { Inject, Injectable } from '@nestjs/common';
/* Types */
import { TProjectDAO } from '../types/daoPlanner.type';
import { TProjectRepository } from '../types/repositoryPlanner.type';
import { TRepositoryResponse } from '@src/shared/types/repositoryResponse.type';
import { TProject } from '../types/project.type';
/* DTOs */
import { CreateProjectDTO } from '../DTOs/createProject.dto';
import { UpdateProjectDTO } from '../DTOs/updateProject.dto';
import { TSearch } from '@src/shared/types/search.type';
@Injectable()
export default class ProjectRepository implements TProjectRepository {
  constructor(@Inject('ProjectDAO') private _projectDAO: TProjectDAO) {}
  /* Create */
  async create(
    data: CreateProjectDTO,
    args?: { projectId: string },
  ): Promise<TRepositoryResponse<TProject>> {
    try {
      const project: TProject = await this._projectDAO.create(data);
      return {
        message: 'Project created',
        status: 'success',
        data: project,
      };
    } catch (error) {
      return {
        message: 'Error creating project',
        status: 'error',
        error: error,
      };
    }
  }
  /* Read */
  async read(id: string): Promise<TRepositoryResponse<TProject>> {
    try {
      const project: TProject = await this._projectDAO.read(id);
      return {
        message: 'Project found',
        status: 'success',
        data: project as TProject,
      };
    } catch (error) {
      return {
        message: 'Error reading project',
        status: 'error',
        error: error,
      };
    }
  }  async readAll(
    args?: TSearch<TProject>,
  ): Promise<TRepositoryResponse<TProject[]>> {
    try {
      const result = await this._projectDAO.readAll(args);
      const projects: TProject[] = result.items;
      if (!projects || projects.length === 0) {
        throw new Error('No projects found');
      }
      return {
        message: 'Projects found',
        status: 'success',
        data: projects,
        metadata: result.metadata,
      };
    } catch (error) {
      return {
        message: 'Error reading projects',
        status: 'error',
        error: error,
      };
    }
  }
  /* Update */
  async update(data: UpdateProjectDTO): Promise<TRepositoryResponse<TProject>> {
    try {
      const project: TProject = await this._projectDAO.update(data);
      return {
        message: 'Project updated',
        status: 'success',
        data: project,
      };
    } catch (error) {
      return {
        message: 'Error updating project',
        status: 'error',
        error: error,
      };
    }
  }
  /* Delete */
  async delete(id: string): Promise<TRepositoryResponse<TProject>> {
    try {
      const project: TProject = await this._projectDAO.delete(id);
      return {
        message: 'Project deleted',
        status: 'success',
        data: project,
      };
    } catch (error) {
      return {
        message: 'Error deleting project',
        status: 'error',
        error: error,
      };
    }
  }
}
