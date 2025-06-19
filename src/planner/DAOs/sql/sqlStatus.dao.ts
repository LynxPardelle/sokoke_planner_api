import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
/* Types */
import { TStatusDAO } from '@src/planner/types/daoPlanner.type';
import { TStatus } from '@src/planner/types/status.type';
import { TSearch, TSearchResult } from '@src/shared/types/search.type';
/* DTOs */
import { CreateStatusDTO } from '@src/planner/DTOs/createStatus.dto';
import { UpdateStatusDTO } from '@src/planner/DTOs/updateStatus.dto';
/* Entities */
import { StatusEntity } from '@src/planner/entities/status.entity';

@Injectable()
export class SQLStatusDAO implements TStatusDAO {
  constructor(
    @InjectRepository(StatusEntity)
    private readonly statusRepository: Repository<StatusEntity>,
  ) {}
  async create(data: CreateStatusDTO): Promise<TStatus> {
    const statusData: Partial<StatusEntity> = {
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

    const statusEntity = this.statusRepository.create(statusData);
    const savedStatus = await this.statusRepository.save(statusEntity);
    
    if (!savedStatus || !savedStatus._id) {
      throw new Error('Error creating status');
    }
    
    return this.mapToTStatus(savedStatus);
  }

  async read(id: string): Promise<TStatus> {
    const status = await this.statusRepository.findOne({
      where: { _id: id },
      relations: ['owners']
    });
    
    if (!status) {
      throw new Error('Status not found');
    }
    
    return this.mapToTStatus(status);
  }

  async readAll(args?: TSearch<TStatus>): Promise<TSearchResult<TStatus>> {
    const queryBuilder = this.statusRepository.createQueryBuilder('status')
      .leftJoinAndSelect('status.owners', 'owners');

    // Apply filters if provided
    if (args?.filters) {
      if (args.filters.name) {
        queryBuilder.andWhere('status.name LIKE :name', { name: `%${args.filters.name}%` });
      }
      if (args.filters.description) {
        queryBuilder.andWhere('status.description LIKE :description', { description: `%${args.filters.description}%` });
      }
    }

    // Apply text search if provided
    if (args?.search?.query) {
      const searchFields = args.search.fields || ['name', 'description'];
      const searchConditions = searchFields.map(field => 
        `status.${String(field)} LIKE :searchQuery`
      ).join(' OR ');
      queryBuilder.andWhere(`(${searchConditions})`, { 
        searchQuery: `%${args.search.query}%` 
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
          queryBuilder.orderBy(`status.${String(sortConfig.field)}`, sortOrder);
        } else {
          queryBuilder.addOrderBy(`status.${String(sortConfig.field)}`, sortOrder);
        }
      });
    } else {
      queryBuilder.orderBy('status.createdAt', 'DESC');
    }

    const startTime = Date.now();
    const [statuses, total] = await queryBuilder.getManyAndCount();
    const searchTime = Date.now() - startTime;
    
    return {
      items: statuses.map(status => this.mapToTStatus(status)),
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
  async update(status: UpdateStatusDTO): Promise<TStatus> {
    const existingStatus = await this.statusRepository.findOne({
      where: { _id: status._id }
    });
    
    if (!existingStatus) {
      throw new Error('Status not found');
    }

    const updateData: Partial<StatusEntity> = {
      name: status.name,
      description: status.description,
      bgColor: status.bgColor,
      textColor: status.textColor,
      linkColor: status.linkColor,
      secondaryBgColor: status.secondaryBgColor,
      secondaryTextColor: status.secondaryTextColor,
      secondaryLinkColor: status.secondaryLinkColor,
      accentColor: status.accentColor,
    };

    await this.statusRepository.update(status._id, updateData);
    
    const updatedStatus = await this.statusRepository.findOne({
      where: { _id: status._id },
      relations: ['owners']
    });
    
    if (!updatedStatus) {
      throw new Error('Status not found after update');
    }
    
    return this.mapToTStatus(updatedStatus);
  }

  async delete(id: string): Promise<TStatus> {
    const status = await this.statusRepository.findOne({
      where: { _id: id },
      relations: ['owners']
    });
    
    if (!status) {
      throw new Error('Status not found');
    }
    
    await this.statusRepository.remove(status);
    
    return this.mapToTStatus(status);
  }

  private mapToTStatus(entity: StatusEntity): TStatus {
    return {
      _id: entity._id,
      name: entity.name,
      description: entity.description,
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
