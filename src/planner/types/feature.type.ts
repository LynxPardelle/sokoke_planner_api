import { TStatus } from './status.type';
import { TTask } from './task.type';

export type TFeature = {
  _id: string;
  name: string;
  description: string;
  status: TStatus | string;
  lastCheckStatus: Date;
  tasks: (TTask | string)[];
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TFeatureCreateDTO = Partial<Omit<TFeature, '_id'>>;
export type TFeatureUpdateDTO = TFeatureCreateDTO & Required<{ _id: string }>;
export function isTFeature(arg: any): arg is TFeature {
  return (
    arg !== 'undefined' &&
    arg._id !== 'undefined' &&
    arg.name !== 'undefined' &&
    arg.description !== 'undefined' &&
    arg.status !== 'undefined' &&
    arg.lastCheckStatus !== 'undefined' &&
    arg.tasks !== 'undefined' &&
    arg.completed !== 'undefined' &&
    arg.createdAt !== 'undefined' &&
    arg.updatedAt !== 'undefined'
  );
}
export function isTFeatureArray(arg: any): arg is TFeature[] {
  return Array.isArray(arg) && arg.every((v) => isTFeature(v));
}
export function asTFeature(arg: any): TFeature {
  if (isTFeature(arg)) {
    return arg;
  }
  throw new Error('Invalid TFeature');
}
export function isTFeatureCreateDTO(arg: any): arg is TFeatureCreateDTO {
  return true;
}
