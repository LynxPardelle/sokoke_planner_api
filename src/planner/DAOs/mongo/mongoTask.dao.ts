import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
/* Types */
import { TTaskDAO } from '@src/planner/types/daoPlanner.type';
import { TTask, asTTask } from '@src/planner/types/task.type';
import { TSearch, TSearchResult } from '@src/shared/types/search.type';
/* DTOs */
import { CreateTaskDTO } from '@src/planner/DTOs/createTask.dto';
import { UpdateTaskDTO } from '@src/planner/DTOs/updateTask.dto';
/* Schemas */
import { TaskModel, TaskDocument } from '@src/planner/schemas/task.schema';
/* Services */
import { SearchService } from '@src/shared/services/search.service';
@Injectable()
export class MongoDBTaskDAO implements TTaskDAO {
  constructor(@InjectModel('Task') private _taskModel: TaskModel) {}
  async create(data: CreateTaskDTO): Promise<TTask> {
    let newTask: TaskDocument = new this._taskModel(data);
    newTask = await newTask.save();
    if (!newTask || !newTask._id) {
      throw new Error('Error creating task');
    }
    return asTTask(newTask);
  }
  async read(id: string): Promise<TTask> {
    const task: TaskDocument | null = await this._taskModel.findById(id);
    if (!task) throw new Error('Task not found');
    return asTTask(task);
  }  /**
   * Read all tasks with advanced search functionality
   * @param args - Search parameters including filters, pagination, sorting, and text search
   * @returns Promise resolving to search results with metadata
   */
  async readAll(args?: TSearch<TTask>): Promise<TSearchResult<TTask>> {
    return await SearchService.executeSearch(
      this._taskModel,
      args,
      asTTask
    );
  }
  async update(task: UpdateTaskDTO): Promise<TTask> {
    const taskUpdated: TaskDocument | null =
      await this._taskModel.findByIdAndUpdate(task._id, task, {
        new: true,
      });
    if (!taskUpdated) throw new Error('Task not found');
    return asTTask(taskUpdated);
  }
  async delete(id: string): Promise<TTask> {
    const taskDeleted: TaskDocument | null =
      await this._taskModel.findByIdAndDelete(id);
    if (!taskDeleted) throw new Error('Task not found');
    return asTTask(taskDeleted);
  }
}
