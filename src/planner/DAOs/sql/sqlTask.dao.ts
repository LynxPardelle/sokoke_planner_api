import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
/* Types */
import { TTaskDAO } from '@src/planner/types/daoPlanner.type';
import { TTask } from '@src/planner/types/task.type';
import { TSearch, TSearchResult } from '@src/shared/types/search.type';
/* DTOs */
import { CreateTaskDTO } from '@src/planner/DTOs/createTask.dto';
import { UpdateTaskDTO } from '@src/planner/DTOs/updateTask.dto';
/* Entities */
import { TaskEntity } from '@src/planner/entities/task.entity';

@Injectable()
export class SQLTaskDAO implements TTaskDAO {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}
  async create(data: CreateTaskDTO): Promise<TTask> {
    const taskData: Partial<TaskEntity> = {
      name: data.name,
      description: data.description,
      statusId: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
      approximateTimeProjection: data.approximateTimeProjection,
      lastCheckStatus: data.lastCheckStatus,
      priority: data.priority,
      impact: data.impact,
      impactDescription: data.impactDescription,
      completed: data.completed,
      bgColor: data.bgColor,
      textColor: data.textColor,
      linkColor: data.linkColor,
      secondaryBgColor: data.secondaryBgColor,
      secondaryTextColor: data.secondaryTextColor,
      secondaryLinkColor: data.secondaryLinkColor,
      accentColor: data.accentColor,
    };

    const taskEntity = this.taskRepository.create(taskData);
    const savedTask = await this.taskRepository.save(taskEntity);
    
    if (!savedTask || !savedTask._id) {
      throw new Error('Error creating task');
    }
    
    return this.mapToTTask(savedTask);
  }

  async read(id: string): Promise<TTask> {
    const task = await this.taskRepository.findOne({
      where: { _id: id },
      relations: ['assignedUsers', 'status', 'tasks', 'feature', 'prevProjects', 'prevTasks', 'prevRequeriments', 'prevFeatures']
    });
    
    if (!task) {
      throw new Error('Task not found');
    }
    
    return this.mapToTTask(task);
  }

  async readAll(args?: TSearch<TTask>): Promise<TSearchResult<TTask>> {
    const queryBuilder = this.taskRepository.createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedUsers', 'assignedUsers')
      .leftJoinAndSelect('task.status', 'status')
      .leftJoinAndSelect('task.tasks', 'tasks')
      .leftJoinAndSelect('task.feature', 'feature');

    // Apply filters
    if (args?.filters) {
      if (args.filters.name) {
        queryBuilder.andWhere('task.name LIKE :name', { name: `%${args.filters.name}%` });
      }
      if (args.filters.completed !== undefined) {
        queryBuilder.andWhere('task.completed = :completed', { completed: args.filters.completed });
      }
    }

    // Apply pagination
    const page = args?.pagination?.page || 1;
    const limit = Math.min(args?.pagination?.limit || 10, 100);
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    // Apply sorting
    if (args?.sort && args.sort.length > 0) {
      args.sort.forEach((sortConfig, index) => {
        const sortOrder = sortConfig.order === 'desc' ? 'DESC' : 'ASC';
        if (index === 0) {
          queryBuilder.orderBy(`task.${String(sortConfig.field)}`, sortOrder);
        } else {
          queryBuilder.addOrderBy(`task.${String(sortConfig.field)}`, sortOrder);
        }
      });
    } else {
      queryBuilder.orderBy('task.createdAt', 'DESC');
    }

    const startTime = Date.now();
    const [tasks, total] = await queryBuilder.getManyAndCount();
    const searchTime = Date.now() - startTime;
    
    return {
      items: tasks.map(task => this.mapToTTask(task)),
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit),
        searchTime
      }
    };
  }
  async update(task: UpdateTaskDTO): Promise<TTask> {
    const existingTask = await this.taskRepository.findOne({
      where: { _id: task._id }
    });
    
    if (!existingTask) {
      throw new Error('Task not found');
    }

    const updateData: Partial<TaskEntity> = {
      name: task.name,
      description: task.description,
      statusId: task.status,
      startDate: task.startDate,
      endDate: task.endDate,
      approximateTimeProjection: task.approximateTimeProjection,
      lastCheckStatus: task.lastCheckStatus,
      priority: task.priority,
      impact: task.impact,
      impactDescription: task.impactDescription,
      completed: task.completed,
      bgColor: task.bgColor,
      textColor: task.textColor,
      linkColor: task.linkColor,
      secondaryBgColor: task.secondaryBgColor,
      secondaryTextColor: task.secondaryTextColor,
      secondaryLinkColor: task.secondaryLinkColor,
      accentColor: task.accentColor,
    };

    await this.taskRepository.update(task._id, updateData);
    
    const updatedTask = await this.taskRepository.findOne({
      where: { _id: task._id },
      relations: ['assignedUsers', 'status', 'tasks', 'feature']
    });
    
    if (!updatedTask) {
      throw new Error('Task not found after update');
    }
    
    return this.mapToTTask(updatedTask);
  }

  async delete(id: string): Promise<TTask> {
    const task = await this.taskRepository.findOne({
      where: { _id: id },
      relations: ['assignedUsers', 'status', 'tasks', 'feature']
    });
    
    if (!task) {
      throw new Error('Task not found');
    }
    
    await this.taskRepository.remove(task);
    
    return this.mapToTTask(task);
  }

  private mapToTTask(entity: TaskEntity): TTask {
    return {
      _id: entity._id,
      assignedUsers: entity.assignedUsers ? entity.assignedUsers.map(user => user._id) : [],
      name: entity.name,
      description: entity.description,
      status: entity.status ? entity.status._id : entity.statusId || '',
      tasks: entity.tasks ? entity.tasks.map(task => task._id) : [],
      startDate: entity.startDate,
      endDate: entity.endDate,
      approximateTimeProjection: entity.approximateTimeProjection,
      lastCheckStatus: entity.lastCheckStatus,
      priority: entity.priority,
      impact: entity.impact,
      impactDescription: entity.impactDescription,
      prevProjects: entity.prevProjects ? entity.prevProjects.map(project => project._id) : [],
      prevTasks: entity.prevTasks ? entity.prevTasks.map(task => task._id) : [],
      prevRequeriments: entity.prevRequeriments ? entity.prevRequeriments.map(req => req._id) : [],
      prevFeatures: entity.prevFeatures ? entity.prevFeatures.map(feature => feature._id) : [],
      completed: entity.completed,
      bgColor: entity.bgColor,
      textColor: entity.textColor,
      linkColor: entity.linkColor,
      secondaryBgColor: entity.secondaryBgColor,
      secondaryTextColor: entity.secondaryTextColor,
      secondaryLinkColor: entity.secondaryLinkColor,
      accentColor: entity.accentColor,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
