import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
/* Types */
import { TProjectCategoryDAO } from '@src/planner/types/daoPlanner.type';
import {
  TProjectCategory,
  asTProjectCategory,
} from '@src/planner/types/projectCategory.type';
import { TSearch, TSearchResult } from '@src/shared/types/search.type';
/* DTOs */
import { CreateProjectCategoryDTO } from '@src/planner/DTOs/createProjectCategory.dto';
import { UpdateProjectCategoryDTO } from '@src/planner/DTOs/updateProjectCategory.dto';
/* Schemas */
import {
  ProjectCategoryModel,
  ProjectCategoryDocument,
} from '@src/planner/schemas/projectCategory.schema';
/* Services */
import { SearchService } from '@src/shared/services/search.service';
@Injectable()
export class MongoDBProjectCategoryDAO implements TProjectCategoryDAO {
  constructor(
    @InjectModel('ProjectCategory')
    private _projectCategoryModel: ProjectCategoryModel,
  ) {}
  async create(data: CreateProjectCategoryDTO): Promise<TProjectCategory> {
    let newProjectCategory: ProjectCategoryDocument =
      new this._projectCategoryModel(data);
    newProjectCategory = await newProjectCategory.save();
    if (!newProjectCategory || !newProjectCategory._id) {
      throw new Error('Error creating project category');
    }
    return asTProjectCategory(newProjectCategory);
  }
  async read(id: string): Promise<TProjectCategory> {
    const projectCategory: ProjectCategoryDocument | null =
      await this._projectCategoryModel.findById(id);
    if (!projectCategory) throw new Error('Project category not found');
    return asTProjectCategory(projectCategory);
  }  async readAll(args?: TSearch<TProjectCategory>): Promise<TSearchResult<TProjectCategory>> {
    return await SearchService.executeSearch(
      this._projectCategoryModel,
      args,
      asTProjectCategory
    );
  }
  async update(
    projectCategory: UpdateProjectCategoryDTO,
  ): Promise<TProjectCategory> {
    const projectCategoryUpdated: ProjectCategoryDocument | null =
      await this._projectCategoryModel.findByIdAndUpdate(
        projectCategory._id,
        projectCategory,
        {
          new: true,
        },
      );
    if (!projectCategoryUpdated) throw new Error('Project category not found');
    return asTProjectCategory(projectCategoryUpdated);
  }
  async delete(id: string): Promise<TProjectCategory> {
    const projectCategoryDeleted: ProjectCategoryDocument | null =
      await this._projectCategoryModel.findByIdAndDelete(id);
    if (!projectCategoryDeleted) throw new Error('Project category not found');
    return asTProjectCategory(projectCategoryDeleted);
  }
}
