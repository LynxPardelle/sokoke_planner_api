import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
/* Types */
import { TProjectSubCategoryDAO } from '@src/planner/types/daoPlanner.type';
import { TProjectSubCategory } from '@src/planner/types/projectSubCategory.type';
import { TSearch, TSearchResult } from '@src/shared/types/search.type';
/* DTOs */
import { CreateProjectSubCategoryDTO } from '@src/planner/DTOs/createProjectSubCategory.dto';
import { UpdateProjectSubCategoryDTO } from '@src/planner/DTOs/updateProjectSubCategory.dto';
/* Entities */
import { ProjectSubCategoryEntity } from '@src/planner/entities/projectSubCategory.entity';

@Injectable()
export class SQLProjectSubCategoryDAO implements TProjectSubCategoryDAO {
  constructor(
    @InjectRepository(ProjectSubCategoryEntity)
    private readonly subCategoryRepository: Repository<ProjectSubCategoryEntity>,
  ) {}

  async create(data: CreateProjectSubCategoryDTO): Promise<TProjectSubCategory> {
    const subCategoryData: Partial<ProjectSubCategoryEntity> = {
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

    const subCategoryEntity = this.subCategoryRepository.create(subCategoryData);
    const savedSubCategory = await this.subCategoryRepository.save(subCategoryEntity);
    
    if (!savedSubCategory || !savedSubCategory._id) {
      throw new Error('Error creating project subcategory');
    }
    
    return this.mapToTProjectSubCategory(savedSubCategory);
  }

  async read(id: string): Promise<TProjectSubCategory> {
    const subCategory = await this.subCategoryRepository.findOne({
      where: { _id: id },
      relations: ['category']
    });
    
    if (!subCategory) {
      throw new Error('Project subcategory not found');
    }
    
    return this.mapToTProjectSubCategory(subCategory);
  }

  async readAll(args?: TSearch<TProjectSubCategory>): Promise<TSearchResult<TProjectSubCategory>> {
    const queryBuilder = this.subCategoryRepository.createQueryBuilder('subCategory')
      .leftJoinAndSelect('subCategory.category', 'category');

    // Apply filters
    if (args?.filters) {
      if (args.filters.name) {
        queryBuilder.andWhere('subCategory.name LIKE :name', { name: `%${args.filters.name}%` });
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
          queryBuilder.orderBy(`subCategory.${String(sortConfig.field)}`, sortOrder);
        } else {
          queryBuilder.addOrderBy(`subCategory.${String(sortConfig.field)}`, sortOrder);
        }
      });
    } else {
      queryBuilder.orderBy('subCategory.createdAt', 'DESC');
    }

    const startTime = Date.now();
    const [subCategories, total] = await queryBuilder.getManyAndCount();
    const searchTime = Date.now() - startTime;
    
    return {
      items: subCategories.map(subCategory => this.mapToTProjectSubCategory(subCategory)),
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

  async update(subCategory: UpdateProjectSubCategoryDTO): Promise<TProjectSubCategory> {
    const existingSubCategory = await this.subCategoryRepository.findOne({
      where: { _id: subCategory._id }
    });
    
    if (!existingSubCategory) {
      throw new Error('Project subcategory not found');
    }

    const updateData: Partial<ProjectSubCategoryEntity> = {
      name: subCategory.name,
      description: subCategory.description,
      bgColor: subCategory.bgColor,
      textColor: subCategory.textColor,
      linkColor: subCategory.linkColor,
      secondaryBgColor: subCategory.secondaryBgColor,
      secondaryTextColor: subCategory.secondaryTextColor,
      secondaryLinkColor: subCategory.secondaryLinkColor,
      accentColor: subCategory.accentColor,
    };

    await this.subCategoryRepository.update(subCategory._id, updateData);
    
    const updatedSubCategory = await this.subCategoryRepository.findOne({
      where: { _id: subCategory._id },
      relations: ['category']
    });
    
    if (!updatedSubCategory) {
      throw new Error('Project subcategory not found after update');
    }
    
    return this.mapToTProjectSubCategory(updatedSubCategory);
  }

  async delete(id: string): Promise<TProjectSubCategory> {
    const subCategory = await this.subCategoryRepository.findOne({
      where: { _id: id },
      relations: ['category']
    });
    
    if (!subCategory) {
      throw new Error('Project subcategory not found');
    }
    
    await this.subCategoryRepository.remove(subCategory);
    
    return this.mapToTProjectSubCategory(subCategory);
  }

  private mapToTProjectSubCategory(entity: ProjectSubCategoryEntity): TProjectSubCategory {
    return {
      _id: entity._id,
      name: entity.name,
      description: entity.description,
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
