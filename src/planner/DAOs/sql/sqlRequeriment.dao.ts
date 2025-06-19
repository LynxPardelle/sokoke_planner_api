import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
/* Types */
import { TRequerimentDAO } from '@src/planner/types/daoPlanner.type';
import { TRequeriment } from '@src/planner/types/requeriment.type';
import { TSearch, TSearchResult } from '@src/shared/types/search.type';
/* DTOs */
import { CreateRequerimentDTO } from '@src/planner/DTOs/createRequeriment.dto';
import { UpdateRequerimentDTO } from '@src/planner/DTOs/updateRequeriment.dto';
/* Entities */
import { RequerimentEntity } from '@src/planner/entities/requeriment.entity';

@Injectable()
export class SQLRequerimentDAO implements TRequerimentDAO {
  constructor(
    @InjectRepository(RequerimentEntity)
    private readonly requerimentRepository: Repository<RequerimentEntity>,
  ) {}

  async create(data: CreateRequerimentDTO): Promise<TRequeriment> {
    const requerimentData: Partial<RequerimentEntity> = {
      name: data.name,
      description: data.description,
      statusId: data.status,
      lastCheckStatus: data.lastCheckStatus,
      completed: data.completed,
    };

    const requerimentEntity = this.requerimentRepository.create(requerimentData);
    const savedRequeriment = await this.requerimentRepository.save(requerimentEntity);
    
    if (!savedRequeriment || !savedRequeriment._id) {
      throw new Error('Error creating requeriment');
    }
    
    return this.mapToTRequeriment(savedRequeriment);
  }

  async read(id: string): Promise<TRequeriment> {
    const requeriment = await this.requerimentRepository.findOne({
      where: { _id: id },
      relations: ['status', 'tasks']
    });
    
    if (!requeriment) {
      throw new Error('Requeriment not found');
    }
    
    return this.mapToTRequeriment(requeriment);
  }

  async readAll(args?: TSearch<TRequeriment>): Promise<TSearchResult<TRequeriment>> {
    const queryBuilder = this.requerimentRepository.createQueryBuilder('requeriment')
      .leftJoinAndSelect('requeriment.status', 'status')
      .leftJoinAndSelect('requeriment.tasks', 'tasks');

    // Apply filters
    if (args?.filters) {
      if (args.filters.name) {
        queryBuilder.andWhere('requeriment.name LIKE :name', { name: `%${args.filters.name}%` });
      }
      if (args.filters.completed !== undefined) {
        queryBuilder.andWhere('requeriment.completed = :completed', { completed: args.filters.completed });
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
          queryBuilder.orderBy(`requeriment.${String(sortConfig.field)}`, sortOrder);
        } else {
          queryBuilder.addOrderBy(`requeriment.${String(sortConfig.field)}`, sortOrder);
        }
      });
    } else {
      queryBuilder.orderBy('requeriment.createdAt', 'DESC');
    }

    const startTime = Date.now();
    const [requeriments, total] = await queryBuilder.getManyAndCount();
    const searchTime = Date.now() - startTime;
    
    return {
      items: requeriments.map(req => this.mapToTRequeriment(req)),
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

  async update(requeriment: UpdateRequerimentDTO): Promise<TRequeriment> {
    const existingRequeriment = await this.requerimentRepository.findOne({
      where: { _id: requeriment._id }
    });
    
    if (!existingRequeriment) {
      throw new Error('Requeriment not found');
    }

    const updateData: Partial<RequerimentEntity> = {
      name: requeriment.name,
      description: requeriment.description,
      statusId: requeriment.status,
      lastCheckStatus: requeriment.lastCheckStatus,
      completed: requeriment.completed,
    };

    await this.requerimentRepository.update(requeriment._id, updateData);
    
    const updatedRequeriment = await this.requerimentRepository.findOne({
      where: { _id: requeriment._id },
      relations: ['status', 'tasks']
    });
    
    if (!updatedRequeriment) {
      throw new Error('Requeriment not found after update');
    }
    
    return this.mapToTRequeriment(updatedRequeriment);
  }

  async delete(id: string): Promise<TRequeriment> {
    const requeriment = await this.requerimentRepository.findOne({
      where: { _id: id },
      relations: ['status', 'tasks']
    });
    
    if (!requeriment) {
      throw new Error('Requeriment not found');
    }
    
    await this.requerimentRepository.remove(requeriment);
    
    return this.mapToTRequeriment(requeriment);
  }

  private mapToTRequeriment(entity: RequerimentEntity): TRequeriment {
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
