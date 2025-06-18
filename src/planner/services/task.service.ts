import { Injectable } from '@nestjs/common';
/* Repositories */
import TaskRepository from '../repositories/task.repository';
/* Types */
import { TTask, TTaskParentType } from '../types/task.type';
import { TRepositoryResponse } from '@src/shared/types/repositoryResponse.type';
import { TTaskRepository } from '../types/repositoryPlanner.type';
import { TSearch } from '@src/shared/types/search.type';
import { TProject } from '../types/project.type';
import { TUser } from '@src/user/types/user.type';
/* DTOs */
import { CreateTaskDTO } from '../DTOs/createTask.dto';
import { UpdateTaskDTO } from '../DTOs/updateTask.dto';
import { UpdateProjectDTO } from '../DTOs/updateProject.dto';
/* Services */
import { LoggerService } from '@src/shared/services/logger.service';
import { EmailService } from '@src/shared/services/email.service';
import { UserService } from '@src/user/services/user.service';
import { ProjectService } from './project.service';
import { RequerimentService } from './requeriment.service';
import { FeatureService } from './feature.service';
import { TRequeriment } from '../types/requeriment.type';
import { TFeature } from '../types/feature.type';
@Injectable()
export class TaskService implements TTaskRepository {
  constructor(
    private _loggerService: LoggerService,
    private _emailService: EmailService,
    private _userService: UserService,
    private _taskRepository: TaskRepository,
    private _projectService: ProjectService,
    private _requerimentService: RequerimentService,
    private _featureService: FeatureService,
  ) {}
  author(): { [key: string]: string } {
    return {
      author: 'Lynx Pardelle',
      site: 'https://lynxpardelle.com',
      github: 'https://github.com/LynxPardelle',
    };
  }
  /* Create */
  async create(
    data: CreateTaskDTO,
    args: {
      parentId: string;
      parentType: TTaskParentType;
    },
  ): Promise<TRepositoryResponse<TTask>> {
    this._loggerService.info(
      `Creating task: ${JSON.stringify(data)}`,
      'TaskService.create',
    );
    if (!args.parentType) throw new Error('Parent type is required');
    let parentService:
      | ProjectService
      | TaskService
      | RequerimentService
      | FeatureService;
    switch (args.parentType) {
      case 'project':
        parentService = await this._projectService;
        break;
      case 'task':
        parentService = await this;
        break;
      case 'requeriment':
        parentService = await this._requerimentService;
        break;
      case 'feature':
        parentService = await this._featureService;
        break;
      default:
        throw new Error('Parent type not found');
    }
    const parent:
      | TRepositoryResponse<TProject>
      | TRepositoryResponse<TTask>
      | TRepositoryResponse<TRequeriment>
      | TRepositoryResponse<TFeature> = await parentService.read(args.parentId);
    if (parent.status !== 'success') throw new Error('Parent not found');
    this._loggerService.info(
      `Parent found: ${JSON.stringify(parent.data)}`,
      'TaskService.create',
    );
    const newTask = await this._taskRepository.create(data);
    this._loggerService.info(
      `Task created: ${JSON.stringify(newTask)}`,
      'TaskService.create',
    );
    if (newTask.status === 'error') throw new Error('Error creating task');
    parent.data.tasks.push(newTask.data._id);    
    const updatedParent = await parentService.update(
      parent.data as UpdateProjectDTO & UpdateTaskDTO,
    );
    this._loggerService.info(
      `Parent updated: ${JSON.stringify(updatedParent)}`,
      'TaskService.create',
    );

    // Send email notifications to assigned users
    if (data.assignedUsers && data.assignedUsers.length > 0) {
      try {
        for (const userId of data.assignedUsers) {
          const userResponse = await this._userService.read(userId as string);          if (userResponse.status === 'success') {
            const user = userResponse.data as TUser;
            await this._emailService.sendTaskAssignmentNotification(
              user.email,
              user.name || 'User',
              newTask.data.name,
              newTask.data.description,
              'Project', // We could make this dynamic based on parent type
              'System', // assignedBy - could be passed from controller
              newTask.data.endDate.toLocaleDateString(),
              'Normal', // priority - could be mapped from priority number
              `${process.env.FRONTEND_URL || 'http://localhost:3000'}/tasks/${newTask.data._id}`,
            );
            this._loggerService.info(
              `Task assignment email sent to ${user.email}`,
              'TaskService.create',
            );
          }
        }      
      } catch (emailError) {
        this._loggerService.error(
          `Failed to send task assignment emails: ${(emailError as Error).message}`,
          'TaskService.create',
        );
        // Don't fail the task creation if email fails
      }
    }

    return newTask;
  }
  /* Read */
  async read(id: string): Promise<TRepositoryResponse<TTask>> {
    this._loggerService.info(`Reading task: ${id}`, 'TaskService.read');
    return this._taskRepository.read(id);
  }
  async readAll(args?: TSearch<TTask>): Promise<TRepositoryResponse<TTask[]>> {
    this._loggerService.info(
      `Reading all tasks: ${JSON.stringify(args)}`,
      'TaskService.readAll',
    );
    return this._taskRepository.readAll(args);
  }  
  /* Update */
  async update(data: UpdateTaskDTO): Promise<TRepositoryResponse<TTask>> {
    // Get the current task to compare assigned users
    const currentTaskResponse = await this._taskRepository.read(data._id);
    if (currentTaskResponse.status !== 'success') {
      return this._taskRepository.update(data);
    }

    const currentTask = currentTaskResponse.data;
    const updatedTask = await this._taskRepository.update(data);

    // If task update was successful and assignedUsers changed, send emails
    if (updatedTask.status === 'success' && data.assignedUsers) {
      try {
        const currentAssignedUsers = currentTask.assignedUsers?.map(u => typeof u === 'string' ? u : u._id) || [];
        const newAssignedUsers = data.assignedUsers;
        
        // Find newly assigned users (those not in the previous list)
        const newlyAssignedUsers = newAssignedUsers.filter(userId => 
          !currentAssignedUsers.includes(userId)
        );

        // Send emails to newly assigned users
        for (const userId of newlyAssignedUsers) {
          const userResponse = await this._userService.read(userId);          if (userResponse.status === 'success') {
            const user = userResponse.data as TUser;
            await this._emailService.sendTaskAssignmentNotification(
              user.email,
              user.name || 'User',
              updatedTask.data.name,
              updatedTask.data.description,
              'Project', // We could make this dynamic based on parent type
              'System', // assignedBy - could be passed from controller
              updatedTask.data.endDate.toLocaleDateString(),
              'Normal', // priority - could be mapped from priority number
              `${process.env.FRONTEND_URL || 'http://localhost:3000'}/tasks/${updatedTask.data._id}`,
            );
            this._loggerService.info(
              `Task assignment email sent to ${user.email}`,
              'TaskService.update',
            );
          }
        }
      } catch (emailError) {
        this._loggerService.error(
          `Failed to send task assignment emails: ${(emailError as Error).message}`,
          'TaskService.update',
        );
        // Don't fail the task update if email fails
      }
    }

    return updatedTask;
  }
  /* Delete */
  async delete(id: string): Promise<TRepositoryResponse<TTask>> {
    this._loggerService.info(`Deleting task: ${id}`, 'TaskService.delete');
    return this._taskRepository.delete(id);
  }
}
