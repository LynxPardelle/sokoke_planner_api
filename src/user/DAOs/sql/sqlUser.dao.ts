import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
/* Types */
import { TUserDAO } from '@src/user/types/daoUser.type';
import { TUser } from '@src/user/types/user.type';
import { TSearch, TSearchResult } from '@src/shared/types/search.type';
/* DTOs */
import { CreateUserDTO } from '@src/user/DTOs/createUser.dto';
import { UpdateUserDTO } from '@src/user/DTOs/updateUser.dto';
/* Entities */
import { UserEntity } from '@src/user/entities/user.entity';

@Injectable()
export class SQLUserDAO implements TUserDAO {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(data: CreateUserDTO): Promise<TUser> {
    const userData: Partial<UserEntity> = {
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      username: data.username,
      password: data.password,
      verifyToken: data.verifyToken,
      verified: data.verified,
      resetToken: data.resetToken,
      resetTokenExpiry: data.resetTokenExpiry,
    };

    const userEntity = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(userEntity);
    
    if (!savedUser || !savedUser._id) {
      throw new Error('Error creating user');
    }
    
    return this.mapToTUser(savedUser);
  }

  async read(id: string): Promise<TUser> {
    const user = await this.userRepository.findOne({
      where: { _id: id }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return this.mapToTUser(user);
  }

  async readAll(args?: TSearch<TUser>): Promise<TSearchResult<TUser>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // Apply filters
    if (args?.filters) {
      if (args.filters.name) {
        queryBuilder.andWhere('user.name LIKE :name', { name: `%${args.filters.name}%` });
      }
      if (args.filters.email) {
        queryBuilder.andWhere('user.email LIKE :email', { email: `%${args.filters.email}%` });
      }
      if (args.filters.username) {
        queryBuilder.andWhere('user.username LIKE :username', { username: `%${args.filters.username}%` });
      }
      if (args.filters.verified !== undefined) {
        queryBuilder.andWhere('user.verified = :verified', { verified: args.filters.verified });
      }
    }

    // Apply text search
    if (args?.search?.query) {
      const searchFields = args.search.fields || ['name', 'email', 'username'];
      const searchConditions = searchFields.map(field => 
        `user.${String(field)} LIKE :searchQuery`
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
          queryBuilder.orderBy(`user.${String(sortConfig.field)}`, sortOrder);
        } else {
          queryBuilder.addOrderBy(`user.${String(sortConfig.field)}`, sortOrder);
        }
      });
    } else {
      queryBuilder.orderBy('user.createdAt', 'DESC');
    }

    const startTime = Date.now();
    const [users, total] = await queryBuilder.getManyAndCount();
    const searchTime = Date.now() - startTime;
    
    return {
      items: users.map(user => this.mapToTUser(user)),
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

  async update(user: UpdateUserDTO): Promise<TUser> {
    const existingUser = await this.userRepository.findOne({
      where: { _id: user._id }
    });
    
    if (!existingUser) {
      throw new Error('User not found');
    }

    const updateData: Partial<UserEntity> = {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      password: user.password,
      verifyToken: user.verifyToken,
      verified: user.verified,
      resetToken: user.resetToken,
      resetTokenExpiry: user.resetTokenExpiry,
    };

    await this.userRepository.update(user._id, updateData);
    
    const updatedUser = await this.userRepository.findOne({
      where: { _id: user._id }
    });
    
    if (!updatedUser) {
      throw new Error('User not found after update');
    }
    
    return this.mapToTUser(updatedUser);
  }

  async delete(id: string): Promise<TUser> {
    const user = await this.userRepository.findOne({
      where: { _id: id }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    await this.userRepository.remove(user);
    
    return this.mapToTUser(user);
  }

  private mapToTUser(entity: UserEntity): TUser {
    return {
      _id: entity._id,
      name: entity.name,
      lastName: entity.lastName,
      email: entity.email,
      username: entity.username,
      password: entity.password,
      verifyToken: entity.verifyToken,
      verified: entity.verified,
      resetToken: entity.resetToken,
      resetTokenExpiry: entity.resetTokenExpiry,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
