import {
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
} from 'class-validator';
import { TFeatureCreateDTO } from '../types/feature.type';
import { isTStatus } from '../types/status.type';
import { isTTask } from '../types/task.type';
export class CreateFeatureDTO implements TFeatureCreateDTO {
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
  constructor(feature: TFeatureCreateDTO | undefined) {
    this.name = feature?.name || '';
    this.description = feature?.description || '';
    this.status = feature?.status
      ? typeof feature?.status === 'object' && isTStatus(feature?.status)
        ? feature?.status._id
        : (feature?.status as string)
      : undefined;
    this.lastCheckStatus = feature?.lastCheckStatus || new Date();
    this.tasks = feature?.tasks
      ? (feature?.tasks as any[]).map((task) =>
          typeof task === 'object' && isTTask(task) ? task._id : task,
        )
      : [];
    this.completed = feature?.completed || false;
    this.createdAt = feature?.createdAt || new Date();
    this.updatedAt = new Date();
  }
}
