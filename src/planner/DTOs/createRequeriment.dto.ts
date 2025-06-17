import {
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
} from 'class-validator';
import { isTStatus } from '../types/status.type';
import { TRequerimentCreateDTO } from '../types/requeriment.type';
import { isTTask } from '../types/task.type';
export class CreateRequerimentDTO {
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
  @IsDate()
  public lastCheckStatus: Date;
  @IsOptional()
  @IsArray()
  public tasks: string[];
  @IsOptional()
  @IsBoolean()
  public completed: boolean;
  @IsOptional()
  @IsDate()
  public createdAt: Date;
  @IsOptional()
  @IsDate()
  public updatedAt: Date;
  constructor(requeriment: TRequerimentCreateDTO | undefined) {
    this.name = requeriment?.name;
    this.description = requeriment?.description;
    this.status = requeriment?.status
      ? typeof requeriment?.status === 'object' &&
        isTStatus(requeriment?.status)
        ? requeriment?.status._id
        : (requeriment?.status as string)
      : undefined;
    this.lastCheckStatus = requeriment?.lastCheckStatus || new Date();
    this.tasks = requeriment?.tasks
      ? (requeriment?.tasks as any[]).map((task) =>
          typeof task === 'object' && isTTask(task) ? task._id : task,
        )
      : [];
    this.completed = requeriment?.completed || false;
    this.createdAt = requeriment.createdAt || new Date();
    this.updatedAt = new Date();
  }
}
