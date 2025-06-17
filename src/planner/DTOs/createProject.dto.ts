import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TProjectCreateDTO } from '../types/project.type';
import { colorDTO } from '@src/shared/DTOs/color.dto';
import { isTProjectCategory } from '../types/projectCategory.type';
import { isTProjectSubCategory } from '../types/projectSubCategory.type';
import { isTFeature } from '../types/feature.type';
import { isTRequeriment } from '../types/requeriment.type';
import { isTStatus } from '../types/status.type';
import { isTTask } from '../types/task.type';
import { isTUser } from '@src/user/types/user.type';
export class CreateProjectDTO extends colorDTO implements TProjectCreateDTO {
  @IsOptional()
  @IsArray()
  public owners: string[];
  @IsOptional()
  @IsString()
  public name: string;
  @IsOptional()
  @IsString()
  public description: string;
  @IsOptional()
  @IsString()
  public category: string;
  @IsOptional()
  @IsString()
  public subCategory: string;
  @IsOptional()
  @IsDate()
  public startDate: Date;
  @IsOptional()
  @IsDate()
  public endDate: Date;
  @IsOptional()
  @IsArray()
  public features: string[];
  @IsOptional()
  @IsArray()
  public requeriments: string[];
  @IsOptional()
  @IsNumber()
  public approximateTimeProjection: number;
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
  @IsNumber()
  public priority: number;
  @IsOptional()
  @IsNumber()
  public impact: number;
  @IsOptional()
  @IsString()
  public impactDescription: string;
  @IsOptional()
  @IsBoolean()
  public completed: boolean;
  @IsOptional()
  @IsDate()
  public createdAt: Date;
  @IsOptional()
  @IsDate()
  public updatedAt: Date;
  constructor(project: TProjectCreateDTO | undefined) {
    super(project);
    this.owners = project?.owners
      ? (project?.owners as any[]).map((owner) =>
          typeof owner === 'object' && isTUser(owner) ? owner._id : owner,
        )
      : [];
    this.name = project?.name;
    this.description = project?.description;
    this.category = project?.category
      ? typeof project?.category === 'object' &&
        isTProjectCategory(project?.category)
        ? project?.category._id
        : (project?.category as string)
      : undefined;
    this.subCategory = project?.subCategory
      ? typeof project?.subCategory === 'object' &&
        isTProjectSubCategory(project.subCategory)
        ? project?.subCategory._id
        : (project.subCategory as string)
      : undefined;
    this.startDate = project?.startDate;
    this.endDate = project?.endDate || undefined;
    this.features = project?.features
      ? (project?.features as any[]).map((feature) =>
          typeof feature === 'object' && isTFeature(feature)
            ? feature._id
            : feature,
        )
      : [];
    this.requeriments = project?.requeriments
      ? (project?.requeriments as any[]).map((requeriment) =>
          typeof requeriment === 'object' && isTRequeriment(requeriment)
            ? requeriment._id
            : requeriment,
        )
      : [];
    this.approximateTimeProjection = project?.approximateTimeProjection || 0;
    this.status = project?.status
      ? typeof project?.status === 'object' && isTStatus(project?.status)
        ? project?.status._id
        : (project?.status as string)
      : undefined;
    this.lastCheckStatus = project?.lastCheckStatus || new Date();
    this.tasks = project?.tasks
      ? (project?.tasks as any[]).map((task) =>
          typeof task === 'object' && isTTask(task) ? task._id : task,
        )
      : [];
    this.priority = project?.priority || 0;
    this.impact = project?.impact || 0;
    this.impactDescription = project?.impactDescription || '';
    this.completed = project?.completed || false;
    this.createdAt = project?.createdAt || new Date();
    this.updatedAt = new Date();
  }
}
