import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
/* Types */
import { TProjectDAO } from '@src/planner/types/daoPlanner.type';
import { TProject, asTProject } from '@src/planner/types/project.type';
import { TSearch } from '@src/shared/types/search.type';
/* DTOs */
import { CreateProjectDTO } from '@src/planner/DTOs/createProject.dto';
import { UpdateProjectDTO } from '@src/planner/DTOs/updateProject.dto';
/* Schemas */
import {
  ProjectModel,
  ProjectDocument,
} from '@src/planner/schemas/project.schema';
@Injectable()
export class MongoDBProjectDAO implements TProjectDAO {
  constructor(@InjectModel('Project') private _projectModel: ProjectModel) {}
  async create(data: CreateProjectDTO): Promise<TProject> {
    let newProject: ProjectDocument = new this._projectModel(data);
    newProject = await newProject.save();
    if (!newProject || !newProject._id) {
      throw new Error('Error creating project');
    }
    return asTProject(newProject);
  }
  async read(id: string): Promise<TProject> {
    const project: ProjectDocument | null =
      await this._projectModel.findById(id);
    if (!project) throw new Error('Project not found');
    return asTProject(project);
  }
  async readAll(args?: TSearch<TProject>): Promise<TProject[]> {
    const projects: ProjectDocument[] = await this._projectModel.find();
    if (!projects) throw new Error('Projects not found');
    if (!projects.length) throw new Error("Projects doesn't contain anything");
    return projects.map(asTProject);
  }
  async update(project: UpdateProjectDTO): Promise<TProject> {
    const projectUpdated: ProjectDocument | null =
      await this._projectModel.findByIdAndUpdate(project._id, project, {
        new: true,
      });
    if (!projectUpdated) throw new Error('Project not found');
    return asTProject(projectUpdated);
  }
  async delete(id: string): Promise<TProject> {
    const projectDeleted: ProjectDocument | null =
      await this._projectModel.findByIdAndDelete(id);
    if (!projectDeleted) throw new Error('Project not found');
    return asTProject(projectDeleted);
  }
}
