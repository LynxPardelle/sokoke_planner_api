import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
/* Types */
import { TProjectDAO } from '@src/planner/types/daoPlanner.type';
import { TProject } from '@src/planner/types/project.type';
import { TSearch, TSearchResult } from '@src/shared/types/search.type';
/* DTOs */
import { CreateProjectDTO } from '@src/planner/DTOs/createProject.dto';
import { UpdateProjectDTO } from '@src/planner/DTOs/updateProject.dto';
/* Entities */
import { ProjectEntity } from '@src/planner/entities/project.entity';

@Injectable()
export class SQLProjectDAO implements TProjectDAO {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
  ) {}

  async create(data: CreateProjectDTO): Promise<TProject> {
    const projectData: Partial<ProjectEntity> = {
      name: data.name,
      description: data.description,
      categoryId: data.category,
      subCategoryId: data.subCategory,
      startDate: data.startDate,
      endDate: data.endDate,
      approximateTimeProjection: data.approximateTimeProjection,
      statusId: data.status,
      lastCheckStatus: data.lastCheckStatus,
      priority: data.priority,
      impact: data.impact,
      impactDescription: data.impactDescription,
      completed: data.completed,
      bgColor: data.bgColor,
      textColor: data.textColor,
      linkColor: data.linkColor,
      secondaryBgColor: data.secondaryBgColor,
      secondaryTextColor: data.secondaryTextColor,
      secondaryLinkColor: data.secondaryLinkColor,
      accentColor: data.accentColor,
    };

    const projectEntity = this.projectRepository.create(projectData);
    const savedProject = await this.projectRepository.save(projectEntity);
    
    if (!savedProject || !savedProject._id) {
      throw new Error('Error creating project');
    }
    
    return this.mapToTProject(savedProject);
  }

  async read(id: string): Promise<TProject> {
    const project = await this.projectRepository.findOne({
      where: { _id: id },
      relations: ['owners', 'category', 'subCategory', 'features', 'requeriments', 'status', 'tasks']
    });
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    return this.mapToTProject(project);
  }

  async readAll(args?: TSearch<TProject>): Promise<TSearchResult<TProject>> {
    const queryBuilder = this.projectRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.owners', 'owners')
      .leftJoinAndSelect('project.category', 'category')
      .leftJoinAndSelect('project.subCategory', 'subCategory')
      .leftJoinAndSelect('project.status', 'status');

    // Apply filters
    if (args?.filters) {
      if (args.filters.name) {
        queryBuilder.andWhere('project.name LIKE :name', { name: `%${args.filters.name}%` });
      }
      if (args.filters.completed !== undefined) {
        queryBuilder.andWhere('project.completed = :completed', { completed: args.filters.completed });
      }
    }

    // Apply pagination
    const page = args?.pagination?.page || 1;
    const limit = Math.min(args?.pagination?.limit || 10, 100);
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    // Apply sorting
    if (args?.sort && args.sort.length > 0) {
      args.sort.forEach((sortConfig, index) => {
        const sortOrder = sortConfig.order === 'desc' ? 'DESC' : 'ASC';
        if (index === 0) {
          queryBuilder.orderBy(`project.${String(sortConfig.field)}`, sortOrder);
        } else {
          queryBuilder.addOrderBy(`project.${String(sortConfig.field)}`, sortOrder);
        }
      });
    } else {
      queryBuilder.orderBy('project.createdAt', 'DESC');
    }

    const startTime = Date.now();
    const [projects, total] = await queryBuilder.getManyAndCount();
    const searchTime = Date.now() - startTime;
    
    return {
      items: projects.map(project => this.mapToTProject(project)),
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit),
        searchTime
      }
    };
  }

  async update(project: UpdateProjectDTO): Promise<TProject> {
    const existingProject = await this.projectRepository.findOne({
      where: { _id: project._id }
    });
    
    if (!existingProject) {
      throw new Error('Project not found');
    }

    const updateData: Partial<ProjectEntity> = {
      name: project.name,
      description: project.description,
      categoryId: project.category,
      subCategoryId: project.subCategory,
      startDate: project.startDate,
      endDate: project.endDate,
      approximateTimeProjection: project.approximateTimeProjection,
      statusId: project.status,
      lastCheckStatus: project.lastCheckStatus,
      priority: project.priority,
      impact: project.impact,
      impactDescription: project.impactDescription,
      completed: project.completed,
      bgColor: project.bgColor,
      textColor: project.textColor,
      linkColor: project.linkColor,
      secondaryBgColor: project.secondaryBgColor,
      secondaryTextColor: project.secondaryTextColor,
      secondaryLinkColor: project.secondaryLinkColor,
      accentColor: project.accentColor,
    };

    await this.projectRepository.update(project._id, updateData);
    
    const updatedProject = await this.projectRepository.findOne({
      where: { _id: project._id },
      relations: ['owners', 'category', 'subCategory', 'features', 'requeriments', 'status', 'tasks']
    });
    
    if (!updatedProject) {
      throw new Error('Project not found after update');
    }
    
    return this.mapToTProject(updatedProject);
  }

  async delete(id: string): Promise<TProject> {
    const project = await this.projectRepository.findOne({
      where: { _id: id },
      relations: ['owners', 'category', 'subCategory', 'features', 'requeriments', 'status', 'tasks']
    });
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    await this.projectRepository.remove(project);
    
    return this.mapToTProject(project);
  }

  private mapToTProject(entity: ProjectEntity): TProject {
    return {
      _id: entity._id,
      owners: entity.owners ? entity.owners.map(owner => owner._id) : [],
      name: entity.name,
      description: entity.description,
      category: entity.category ? entity.category._id : entity.categoryId || '',
      subCategory: entity.subCategory ? entity.subCategory._id : entity.subCategoryId || '',
      startDate: entity.startDate,
      endDate: entity.endDate,
      features: entity.features ? entity.features.map(feature => feature._id) : [],
      requeriments: entity.requeriments ? entity.requeriments.map(req => req._id) : [],
      approximateTimeProjection: entity.approximateTimeProjection,
      status: entity.status ? entity.status._id : entity.statusId || '',
      lastCheckStatus: entity.lastCheckStatus,
      tasks: entity.tasks ? entity.tasks.map(task => task._id) : [],
      priority: entity.priority,
      impact: entity.impact,
      impactDescription: entity.impactDescription,
      completed: entity.completed,
      bgColor: entity.bgColor,
      textColor: entity.textColor,
      linkColor: entity.linkColor,
      secondaryBgColor: entity.secondaryBgColor,
      secondaryTextColor: entity.secondaryTextColor,
      secondaryLinkColor: entity.secondaryLinkColor,
      accentColor: entity.accentColor,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
