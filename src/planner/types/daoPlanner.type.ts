/* Types */
import { TDAO } from '@src/shared/types/dao.type';
import { TSearch } from '@src/shared/types/search.type';
import { TFeature } from './feature.type';
import { TProject } from './project.type';
import { TProjectCategory } from './projectCategory.type';
import { TProjectSubCategory } from './projectSubCategory.type';
import { TRequeriment } from './requeriment.type';
import { TStatus } from './status.type';
import { TTask } from './task.type';
/* DTOs */
import { CreateFeatureDTO } from '../DTOs/createFeature.dto';
import { CreateProjectDTO } from '../DTOs/createProject.dto';
import { CreateProjectCategoryDTO } from '../DTOs/createProjectCategory.dto';
import { CreateProjectSubCategoryDTO } from '../DTOs/createProjectSubCategory.dto';
import { CreateRequerimentDTO } from '../DTOs/createRequeriment.dto';
import { CreateStatusDTO } from '../DTOs/createStatus.dto';
import { CreateTaskDTO } from '../DTOs/createTask.dto';
import { UpdateFeatureDTO } from '../DTOs/updateFeature.dto';
import { UpdateProjectDTO } from '../DTOs/updateProject.dto';
import { UpdateProjectCategoryDTO } from '../DTOs/updateProjectCategory.dto';
import { UpdateProjectSubCategoryDTO } from '../DTOs/updateProjectSubCategory.dto';
import { UpdateRequerimentDTO } from '../DTOs/updateRequeriment.dto';
import { UpdateStatusDTO } from '../DTOs/updateStatus.dto';
import { UpdateTaskDTO } from '../DTOs/updateTask.dto';
export declare type TFeatureDAO = TDAO<
  CreateFeatureDTO,
  TSearch<TFeature>,
  UpdateFeatureDTO,
  TFeature
>;
export type TProjectDAO = TDAO<
  CreateProjectDTO,
  TSearch<TProject>,
  UpdateProjectDTO,
  TProject
>;
export type TProjectCategoryDAO = TDAO<
  CreateProjectCategoryDTO,
  TSearch<TProjectCategory>,
  UpdateProjectCategoryDTO,
  TProjectCategory
>;
export type TProjectSubCategoryDAO = TDAO<
  CreateProjectSubCategoryDTO,
  TSearch<TProjectSubCategory>,
  UpdateProjectSubCategoryDTO,
  TProjectSubCategory
>;
export type TRequerimentDAO = TDAO<
  CreateRequerimentDTO,
  TSearch<TRequeriment>,
  UpdateRequerimentDTO,
  TRequeriment
>;
export type TStatusDAO = TDAO<
  CreateStatusDTO,
  TSearch<TStatus>,
  UpdateStatusDTO,
  TStatus
>;
export type TTaskDAO = TDAO<
  CreateTaskDTO,
  TSearch<TTask>,
  UpdateTaskDTO,
  TTask
>;
