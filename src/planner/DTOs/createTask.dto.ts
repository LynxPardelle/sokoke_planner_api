import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { isTTask, TTask, TTaskCreateDTO } from '../types/task.type';
import { colorDTO } from '@src/shared/DTOs/color.dto';
import { isTProject, TProject } from '../types/project.type';
import { isTStatus } from '../types/status.type';
import { isTRequeriment, TRequeriment } from '../types/requeriment.type';
import { isTFeature, TFeature } from '../types/feature.type';
export class CreateTaskDTO extends colorDTO implements TTaskCreateDTO {
  @IsOptional()
  @IsString()
  public name: string;
  @IsOptional()
  @IsString()
  public description: string;
  @IsOptional()
  @IsString()
  public status: string;
  @IsOptional()
  @IsArray()
  public tasks?: string[];
  @IsOptional()
  @IsDate()
  public startDate: Date;
  @IsOptional()
  @IsDate()
  public endDate: Date;
  @IsOptional()
  @IsNumber()
  public approximateTimeProjection: number;
  @IsOptional()
  @IsDate()
  public lastCheckStatus: Date;
  @IsOptional()
  @IsNumber()
  public priority: number;
  @IsOptional()
  @IsNumber()
  public impact: number;
  @IsOptional()
  @IsString()
  public impactDescription: string;
  @IsOptional()
  @IsArray()
  public prevProjects?: string[];
  @IsOptional()
  @IsArray()
  public prevTasks?: string[];
  @IsOptional()
  @IsArray()
  public prevRequeriments?: string[];
  @IsOptional()
  @IsArray()
  public prevFeatures?: string[];
  @IsOptional()
  @IsBoolean()
  public completed: boolean;
  @IsOptional()
  @IsDate()
  public createdAt: Date;
  @IsOptional()
  @IsDate()
  public updatedAt: Date;
  constructor(task: TTaskCreateDTO | undefined) {
    super(task);
    this.name = task?.name || '';
    this.description = task?.description || '';
    this.status = task?.status
      ? typeof task?.status === 'object' && isTStatus(task?.status)
        ? task?.status._id
        : (task?.status as string)
      : undefined;
    this.tasks = task?.tasks
      ? (task?.tasks as TTask[]).map((task) =>
          isTTask(task) ? task._id : task,
        )
      : [];
    this.startDate = task?.startDate || new Date();
    this.endDate = task?.endDate || new Date();
    this.approximateTimeProjection = task?.approximateTimeProjection || 0;
    this.lastCheckStatus = task?.lastCheckStatus || new Date();
    this.priority = task?.priority || 0;
    this.impact = task?.impact || 0;
    this.impactDescription = task?.impactDescription || '';
    this.prevProjects = task?.prevProjects
      ? (task?.prevProjects as TProject[]).map((project) =>
          isTProject(project) ? project._id : project,
        )
      : [];
    this.prevTasks = task?.prevTasks
      ? (task?.prevTasks as TTask[]).map((task) =>
          isTTask(task) ? task._id : task,
        )
      : [];
    this.prevRequeriments = task?.prevRequeriments
      ? (task?.prevRequeriments as TRequeriment[]).map((task) =>
          isTRequeriment(task) ? task._id : task,
        )
      : [];
    this.prevFeatures = task?.prevFeatures
      ? (task?.prevFeatures as TFeature[]).map((task) =>
          isTFeature(task) ? task._id : task,
        )
      : [];
    this.completed = task?.completed || false;
    this.createdAt = task?.createdAt || new Date();
    this.updatedAt = new Date();
  }
}
