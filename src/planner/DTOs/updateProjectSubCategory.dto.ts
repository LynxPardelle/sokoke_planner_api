import { IsString } from 'class-validator';
import { TProjectSubCategoryUpdateDTO } from '../types/projectSubCategory.type';
import { CreateProjectSubCategoryDTO } from './createProjectSubCategory.dto';
export class UpdateProjectSubCategoryDTO
  extends CreateProjectSubCategoryDTO
  implements TProjectSubCategoryUpdateDTO
{
  @IsString()
  public _id: string;
  constructor(projectSubCategory: TProjectSubCategoryUpdateDTO) {
    super(projectSubCategory);
    this._id = projectSubCategory._id;
    this.updatedAt = new Date();
  }
}
