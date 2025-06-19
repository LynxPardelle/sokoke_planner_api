import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
/* Types */
import { TProjectCategoryDAO } from '@src/planner/types/daoPlanner.type';
import { TProjectCategory } from '@src/planner/types/projectCategory.type';
import { TSearch, TSearchResult } from '@src/shared/types/search.type';
/* DTOs */
import { CreateProjectCategoryDTO } from '@src/planner/DTOs/createProjectCategory.dto';
import { UpdateProjectCategoryDTO } from '@src/planner/DTOs/updateProjectCategory.dto';
/* Entities */
import { ProjectCategoryEntity } from '@src/planner/entities/projectCategory.entity';

@Injectable()
export class SQLProjectCategoryDAO implements TProjectCategoryDAO {
  constructor(
    @InjectRepository(ProjectCategoryEntity)
    private readonly categoryRepository: Repository<ProjectCategoryEntity>,
  ) {}

  async create(data: CreateProjectCategoryDTO): Promise<TProjectCategory> {
    const categoryData: Partial<ProjectCategoryEntity> = {
      name: data.name,
      description: data.description,
      bgColor: data.bgColor,
      textColor: data.textColor,
      linkColor: data.linkColor,
      secondaryBgColor: data.secondaryBgColor,
      secondaryTextColor: data.secondaryTextColor,
      secondaryLinkColor: data.secondaryLinkColor,
      accentColor: data.accentColor,
    };

    const categoryEntity = this.categoryRepository.create(categoryData);
    const savedCategory = await this.categoryRepository.save(categoryEntity);
    
    if (!savedCategory || !savedCategory._id) {
      throw new Error('Error creating project category');
    }
    
    return this.mapToTProjectCategory(savedCategory);
  }

  async read(id: string): Promise<TProjectCategory> {
    const category = await this.categoryRepository.findOne({
      where: { _id: id },
      relations: ['subCategories', 'owners']
    });
    
    if (!category) {
      throw new Error('Project category not found');
    }
    
    return this.mapToTProjectCategory(category);
  }

  async readAll(args?: TSearch<TProjectCategory>): Promise<TSearchResult<TProjectCategory>> {
    const queryBuilder = this.categoryRepository.createQueryBuilder('category')
      .leftJoinAndSelect('category.subCategories', 'subCategories')
      .leftJoinAndSelect('category.owners', 'owners');

    // Apply filters
    if (args?.filters) {
      if (args.filters.name) {
        queryBuilder.andWhere('category.name LIKE :name', { name: `%${args.filters.name}%` });
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
          queryBuilder.orderBy(`category.${String(sortConfig.field)}`, sortOrder);
        } else {
          queryBuilder.addOrderBy(`category.${String(sortConfig.field)}`, sortOrder);
        }
      });
    } else {
      queryBuilder.orderBy('category.createdAt', 'DESC');
    }

    const startTime = Date.now();
    const [categories, total] = await queryBuilder.getManyAndCount();
    const searchTime = Date.now() - startTime;
    
    return {
      items: categories.map(category => this.mapToTProjectCategory(category)),
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

  async update(category: UpdateProjectCategoryDTO): Promise<TProjectCategory> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { _id: category._id }
    });
    
    if (!existingCategory) {
      throw new Error('Project category not found');
    }

    const updateData: Partial<ProjectCategoryEntity> = {
      name: category.name,
      description: category.description,
      bgColor: category.bgColor,
      textColor: category.textColor,
      linkColor: category.linkColor,
      secondaryBgColor: category.secondaryBgColor,
      secondaryTextColor: category.secondaryTextColor,
      secondaryLinkColor: category.secondaryLinkColor,
      accentColor: category.accentColor,
    };

    await this.categoryRepository.update(category._id, updateData);
    
    const updatedCategory = await this.categoryRepository.findOne({
      where: { _id: category._id },
      relations: ['subCategories', 'owners']
    });
    
    if (!updatedCategory) {
      throw new Error('Project category not found after update');
    }
    
    return this.mapToTProjectCategory(updatedCategory);
  }

  async delete(id: string): Promise<TProjectCategory> {
    const category = await this.categoryRepository.findOne({
      where: { _id: id },
      relations: ['subCategories', 'owners']
    });
    
    if (!category) {
      throw new Error('Project category not found');
    }
    
    await this.categoryRepository.remove(category);
    
    return this.mapToTProjectCategory(category);
  }

  private mapToTProjectCategory(entity: ProjectCategoryEntity): TProjectCategory {
    return {
      _id: entity._id,
      name: entity.name,
      description: entity.description,
      subCategories: entity.subCategories ? entity.subCategories.map(sub => sub._id) : [],
      owners: entity.owners ? entity.owners.map(owner => owner._id) : [],
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
