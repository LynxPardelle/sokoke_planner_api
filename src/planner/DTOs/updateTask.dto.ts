import {  IsString } from 'class-validator';
import { TTaskUpdateDTO } from '../types/task.type';
import { CreateTaskDTO } from './createTask.dto';
export class UpdateTaskDTO extends CreateTaskDTO implements TTaskUpdateDTO {
  @IsString()
  public _id: string;
  constructor(task: TTaskUpdateDTO) {
    super(task);
    this._id = task._id;
    this.updatedAt = new Date();
  }
}
