import { Inject, Injectable } from '@nestjs/common';
/* Types */
import { TTaskDAO } from '../types/daoPlanner.type';
import { TTaskRepository } from '../types/repositoryPlanner.type';
import { TRepositoryResponse } from '@src/shared/types/repositoryResponse.type';
import { TTask } from '../types/task.type';
/* DTOs */
import { CreateTaskDTO } from '../DTOs/createTask.dto';
import { UpdateTaskDTO } from '../DTOs/updateTask.dto';
import { TSearch } from '@src/shared/types/search.type';
@Injectable()
export default class TaskRepository implements TTaskRepository {
  constructor(@Inject('TaskDAO') private _taskDAO: TTaskDAO) {}
  /* Create */
  async create(
    data: CreateTaskDTO,
    args?: { projectId: string },
  ): Promise<TRepositoryResponse<TTask>> {
    try {
      const task: TTask = await this._taskDAO.create(data);
      return {
        message: 'Task created',
        status: 'success',
        data: task,
      };
    } catch (error) {
      return {
        message: 'Error creating task',
        status: 'error',
        error: error,
      };
    }
  }
  /* Read */
  async read(id: string): Promise<TRepositoryResponse<TTask>> {
    try {
      const task: TTask = await this._taskDAO.read(id);
      return {
        message: 'Task found',
        status: 'success',
        data: task as TTask,
      };
    } catch (error) {
      return {
        message: 'Error reading task',
        status: 'error',
        error: error,
      };
    }
  }
  async readAll(args?: TSearch<TTask>): Promise<TRepositoryResponse<TTask[]>> {
    try {
      const result = await this._taskDAO.readAll(args);
      const tasks: TTask[] = result.items;
      if (!tasks || tasks.length === 0) {
        throw new Error('No tasks found');
      }
      return {
        message: 'Tasks found',
        status: 'success',
        data: tasks,
        metadata: result.metadata,
      };
    } catch (error) {
      return {
        message: 'Error reading tasks',
        status: 'error',
        error: error,
      };
    }
  }
  /* Update */
  async update(data: UpdateTaskDTO): Promise<TRepositoryResponse<TTask>> {
    try {
      const task: TTask = await this._taskDAO.update(data);
      return {
        message: 'Task updated',
        status: 'success',
        data: task,
      };
    } catch (error) {
      return {
        message: 'Error updating task',
        status: 'error',
        error: error,
      };
    }
  }
  /* Delete */
  async delete(id: string): Promise<TRepositoryResponse<TTask>> {
    try {
      const task: TTask = await this._taskDAO.delete(id);
      return {
        message: 'Task deleted',
        status: 'success',
        data: task,
      };
    } catch (error) {
      return {
        message: 'Error deleting task',
        status: 'error',
        error: error,
      };
    }
  }
}
