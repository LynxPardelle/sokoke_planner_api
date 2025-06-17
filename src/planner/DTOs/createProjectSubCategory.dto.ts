import { IsDate, IsOptional, IsString } from 'class-validator';
import { TProjectSubCategoryCreateDTO } from '../types/projectSubCategory.type';
import { colorDTO } from '@src/shared/DTOs/color.dto';
export class CreateProjectSubCategoryDTO
  extends colorDTO
  implements TProjectSubCategoryCreateDTO
{
  @IsOptional()
  @IsString()
  public name: string;
  @IsOptional()
  @IsString()
  public description: string;
  @IsOptional()
  @IsDate()
  public createdAt: Date;
  @IsOptional()
  @IsDate()
  public updatedAt: Date;
  constructor(projectSubCategory: TProjectSubCategoryCreateDTO | undefined) {
    super(projectSubCategory);
    this.name = projectSubCategory?.name || '';
    this.description = projectSubCategory?.description || '';
    this.createdAt = projectSubCategory?.createdAt || new Date();
    this.updatedAt = new Date();
  }
}
