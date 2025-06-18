import { TColor } from '@src/shared/types/color.type';
import { TUser } from '@src/user/types/user.type';
import { TStatus } from './status.type';
import { TProject } from './project.type';
import { TRequeriment } from './requeriment.type';
import { TFeature } from './feature.type';

export type TTask = {
  _id: string;
  assignedUsers: (TUser | string)[];
  name: string;
  description: string;
  status: TStatus | string;
  tasks: (TTask | string)[];
  startDate: Date;
  endDate: Date;
  approximateTimeProjection: number;
  lastCheckStatus: Date;
  priority: number;
  impact: number;
  impactDescription: string;
  prevProjects: (TProject | string)[];
  prevTasks: (TTask | string)[];
  prevRequeriments: (TRequeriment | string)[];
  prevFeatures: (TFeature | string)[];
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
} & TColor;

export type TTaskCreateDTO = Partial<Omit<TTask, '_id'>>;
export type TTaskUpdateDTO = TTaskCreateDTO & Required<{ _id: string }>;
export function isTTask(arg: any): arg is TTask {
  return (
    arg !== 'undefined' &&
    arg._id !== 'undefined' &&
    arg.name !== 'undefined' &&
    arg.description !== 'undefined' &&
    arg.status !== 'undefined' &&
    arg.dueDate !== 'undefined' &&
    arg.prevProjects !== 'undefined' &&
    arg.prevTasks !== 'undefined' &&
    arg.prevRequeriments !== 'undefined' &&
    arg.prevFeatures !== 'undefined' &&
    arg.completed !== 'undefined' &&
    arg.createdAt !== 'undefined' &&
    arg.updatedAt !== 'undefined'
  );
}
export function isTTaskArray(arg: any): arg is TTask[] {
  return Array.isArray(arg) && arg.every((v) => isTTask(v));
}
export function asTTask(arg: any): TTask {
  if (isTTask(arg)) {
    return arg;
  }
  throw new Error('Invalid TTask');
}
export function isTTaskCreateDTO(arg: any): arg is TTaskCreateDTO {
  return true;
}
export function isTTaskUpdateDTO(arg: any): arg is TTaskUpdateDTO {
  return arg && arg._id;
}

export type TTaskParentType = 'project' | 'task' | 'requeriment' | 'feature';
