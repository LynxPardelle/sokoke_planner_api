import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';
import { TProjectCategoryCreateDTO } from '../types/projectCategory.type';
import { colorDTO } from '@src/shared/DTOs/color.dto';
import { isTProjectSubCategory } from '../types/projectSubCategory.type';
import { isTUser } from '@src/user/types/user.type';
export class CreateProjectCategoryDTO
  extends colorDTO
  implements TProjectCategoryCreateDTO
{
  @IsOptional()
  @IsString()
  public name: string;
  @IsOptional()
  @IsString()
  public description: string;
  @IsOptional()
  @IsArray()
  public subCategories?: string[];
  @IsOptional()
  @IsArray()
  public owners?: string[];
  @IsOptional()
  @IsDate()
  public createdAt: Date;
  @IsOptional()
  @IsDate()
  public updatedAt: Date;
  constructor(projectCategory: TProjectCategoryCreateDTO | undefined) {
    super(projectCategory);
    this.name = projectCategory?.name || '';
    this.description = projectCategory?.description || '';
    this.subCategories = projectCategory?.subCategories
      ? (projectCategory.subCategories as any[]).map((subCategory) =>
          typeof subCategory === 'object' && isTProjectSubCategory(subCategory)
            ? subCategory._id
            : subCategory,
        )
      : [];
    this.owners = projectCategory?.owners
      ? (projectCategory?.owners as any[]).map((owner) =>
          typeof owner === 'object' && isTUser(owner) ? owner._id : owner,
        )
      : [];
    this.createdAt = projectCategory?.createdAt || new Date();
    this.updatedAt = new Date();
  }
}
