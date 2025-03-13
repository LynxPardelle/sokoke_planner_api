import { IsString } from '@nestjs/class-validator';
import { TProjectCategoryUpdateDTO } from '../types/projectCategory.type';
import { CreateProjectCategoryDTO } from './createProjectCategory.dto';
export class UpdateProjectCategoryDTO
  extends CreateProjectCategoryDTO
  implements TProjectCategoryUpdateDTO
{
  @IsString()
  public _id: string;
  constructor(projectCategory: TProjectCategoryUpdateDTO) {
    super(projectCategory);
    this._id = projectCategory._id;
    this.updatedAt = new Date();
  }
}
