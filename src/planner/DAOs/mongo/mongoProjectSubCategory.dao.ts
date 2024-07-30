import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
/* Types */
import { TProjectSubCategoryDAO } from '@src/planner/types/daoPlanner.type';
import {
  TProjectSubCategory,
  asTProjectSubCategory,
} from '@src/planner/types/projectSubCategory.type';
import { TSearch } from '@src/shared/types/search.type';
/* DTOs */
import { CreateProjectSubCategoryDTO } from '@src/planner/DTOs/createProjectSubCategory.dto';
import { UpdateProjectSubCategoryDTO } from '@src/planner/DTOs/updateProjectSubCategory.dto';
/* Schemas */
import {
  ProjectSubCategoryModel,
  ProjectSubCategoryDocument,
} from '@src/planner/schemas/projectSubCategory.schema';
@Injectable()
export class MongoDBProjectSubCategoryDAO implements TProjectSubCategoryDAO {
  constructor(
    @InjectModel('ProjectSubCategory')
    private _projectSubCategoryModel: ProjectSubCategoryModel,
  ) {}
  async create(
    data: CreateProjectSubCategoryDTO,
  ): Promise<TProjectSubCategory> {
    let newProjectSubCategory: ProjectSubCategoryDocument =
      new this._projectSubCategoryModel(data);
    newProjectSubCategory = await newProjectSubCategory.save();
    if (!newProjectSubCategory || !newProjectSubCategory._id) {
      throw new Error('Error creating project sub category');
    }
    return asTProjectSubCategory(newProjectSubCategory);
  }
  async read(id: string): Promise<TProjectSubCategory> {
    const projectSubCategory: ProjectSubCategoryDocument | null =
      await this._projectSubCategoryModel.findById(id);
    if (!projectSubCategory) throw new Error('Project sub category not found');
    return asTProjectSubCategory(projectSubCategory);
  }
  async readAll(
    args?: TSearch<TProjectSubCategory>,
  ): Promise<TProjectSubCategory[]> {
    const projectSubCategories: ProjectSubCategoryDocument[] =
      await this._projectSubCategoryModel.find();
    if (!projectSubCategories)
      throw new Error('Project sub categories not found');
    if (!projectSubCategories.length)
      throw new Error("Project sub categories doesn't contain anything");
    return projectSubCategories.map(asTProjectSubCategory);
  }
  async update(
    projectSubCategory: UpdateProjectSubCategoryDTO,
  ): Promise<TProjectSubCategory> {
    const projectSubCategoryUpdated: ProjectSubCategoryDocument | null =
      await this._projectSubCategoryModel.findByIdAndUpdate(
        projectSubCategory._id,
        projectSubCategory,
        {
          new: true,
        },
      );
    if (!projectSubCategoryUpdated)
      throw new Error('Project sub category not found');
    return asTProjectSubCategory(projectSubCategoryUpdated);
  }
  async delete(id: string): Promise<TProjectSubCategory> {
    const projectSubCategoryDeleted: ProjectSubCategoryDocument | null =
      await this._projectSubCategoryModel.findByIdAndDelete(id);
    if (!projectSubCategoryDeleted)
      throw new Error('Project sub category not found');
    return asTProjectSubCategory(projectSubCategoryDeleted);
  }
}
