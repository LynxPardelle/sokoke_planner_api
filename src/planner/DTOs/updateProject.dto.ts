import { IsString } from 'class-validator';
import { TProjectUpdateDTO } from '../types/project.type';
import { CreateProjectDTO } from './createProject.dto';
export class UpdateProjectDTO
  extends CreateProjectDTO
  implements TProjectUpdateDTO
{
  @IsString()
  public _id: string;
  constructor(project: TProjectUpdateDTO) {
    super(project);
    this._id = project._id;
    this.updatedAt = new Date();
  }
}
