import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
/* Types */
import { TFeatureDAO } from '@src/planner/types/daoPlanner.type';
import { TFeature } from '@src/planner/types/feature.type';
import { TSearch, TSearchResult } from '@src/shared/types/search.type';
/* DTOs */
import { CreateFeatureDTO } from '@src/planner/DTOs/createFeature.dto';
import { UpdateFeatureDTO } from '@src/planner/DTOs/updateFeature.dto';
/* Entities */
import { FeatureEntity } from '@src/planner/entities/feature.entity';

@Injectable()
export class SQLFeatureDAO implements TFeatureDAO {
  constructor(
    @InjectRepository(FeatureEntity)
    private readonly featureRepository: Repository<FeatureEntity>,
  ) {}
  async create(data: CreateFeatureDTO): Promise<TFeature> {
    const featureData: Partial<FeatureEntity> = {
      name: data.name,
      description: data.description,
      statusId: data.status,
      lastCheckStatus: data.lastCheckStatus,
      completed: data.completed,
    };

    const featureEntity = this.featureRepository.create(featureData);
    const savedFeature = await this.featureRepository.save(featureEntity);
    
    if (!savedFeature || !savedFeature._id) {
      throw new Error('Error creating feature');
    }
    
    return this.mapToTFeature(savedFeature);
  }

  async read(id: string): Promise<TFeature> {
    const feature = await this.featureRepository.findOne({
      where: { _id: id },
      relations: ['status', 'tasks']
    });
    
    if (!feature) {
      throw new Error('Feature not found');
    }
    
    return this.mapToTFeature(feature);
  }
  async readAll(args?: TSearch<TFeature>): Promise<TSearchResult<TFeature>> {
    const queryBuilder = this.featureRepository.createQueryBuilder('feature')
      .leftJoinAndSelect('feature.status', 'status')
      .leftJoinAndSelect('feature.tasks', 'tasks');

    // Apply filters if provided
    if (args?.filters) {
      if (args.filters.name) {
        queryBuilder.andWhere('feature.name LIKE :name', { name: `%${args.filters.name}%` });
      }
      if (args.filters.description) {
        queryBuilder.andWhere('feature.description LIKE :description', { description: `%${args.filters.description}%` });
      }
      if (args.filters.completed !== undefined) {
        queryBuilder.andWhere('feature.completed = :completed', { completed: args.filters.completed });
      }
    }

    // Apply text search if provided
    if (args?.search?.query) {
      const searchFields = args.search.fields || ['name', 'description'];
      const searchConditions = searchFields.map(field => 
        `feature.${String(field)} LIKE :searchQuery`
      ).join(' OR ');
      queryBuilder.andWhere(`(${searchConditions})`, { 
        searchQuery: `%${args.search.query}%` 
      });
    }

    // Apply date range filters
    if (args?.advanced?.dateRange) {
      args.advanced.dateRange.forEach((range, index) => {
        if (range.start) {
          queryBuilder.andWhere(`feature.${String(range.field)} >= :startDate${index}`, { 
            [`startDate${index}`]: range.start 
          });
        }
        if (range.end) {
          queryBuilder.andWhere(`feature.${String(range.field)} <= :endDate${index}`, { 
            [`endDate${index}`]: range.end 
          });
        }
      });
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
          queryBuilder.orderBy(`feature.${String(sortConfig.field)}`, sortOrder);
        } else {
          queryBuilder.addOrderBy(`feature.${String(sortConfig.field)}`, sortOrder);
        }
      });
    } else {
      queryBuilder.orderBy('feature.createdAt', 'DESC');
    }

    const startTime = Date.now();
    const [features, total] = await queryBuilder.getManyAndCount();
    const searchTime = Date.now() - startTime;
    
    return {
      items: features.map(feature => this.mapToTFeature(feature)),
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
  async update(feature: UpdateFeatureDTO): Promise<TFeature> {
    const existingFeature = await this.featureRepository.findOne({
      where: { _id: feature._id }
    });
    
    if (!existingFeature) {
      throw new Error('Feature not found');
    }

    const updateData: Partial<FeatureEntity> = {
      name: feature.name,
      description: feature.description,
      statusId: feature.status,
      lastCheckStatus: feature.lastCheckStatus,
      completed: feature.completed,
    };

    await this.featureRepository.update(feature._id, updateData);
    
    const updatedFeature = await this.featureRepository.findOne({
      where: { _id: feature._id },
      relations: ['status', 'tasks']
    });
    
    if (!updatedFeature) {
      throw new Error('Feature not found after update');
    }
    
    return this.mapToTFeature(updatedFeature);
  }

  async delete(id: string): Promise<TFeature> {
    const feature = await this.featureRepository.findOne({
      where: { _id: id },
      relations: ['status', 'tasks']
    });
    
    if (!feature) {
      throw new Error('Feature not found');
    }
    
    await this.featureRepository.remove(feature);
    
    return this.mapToTFeature(feature);
  }

  private mapToTFeature(entity: FeatureEntity): TFeature {
    return {
      _id: entity._id,
      name: entity.name,
      description: entity.description,
      status: entity.status ? entity.status._id : entity.statusId || '',
      lastCheckStatus: entity.lastCheckStatus,
      tasks: entity.tasks ? entity.tasks.map(task => task._id) : [],
      completed: entity.completed,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
