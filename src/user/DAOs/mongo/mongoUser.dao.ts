import { Injectable } from '@nestjs/common';
/* Types */
import { TUserDAO } from '@src/user/types/daoUser.type';
import { asTUser, TUser } from '@src/user/types/user.type';
import { TSearch } from '@src/shared/types/search.type';
/* DTOs */
import { CreateUserDTO } from '@src/user/DTOs/createUser.dto';
import { UpdateUserDTO } from '@src/user/DTOs/updateUser.dto';
/* Schemas */
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserModel } from '@src/user/schemas/user.schema';
/* Services */
import { LoggerService } from '@src/shared/services/logger.service';
@Injectable()
export class MongoDBUserDAO implements TUserDAO {
  constructor(
    @InjectModel('User') private _userModel: UserModel,
    private _loggerService: LoggerService,
  ) {}
  async create(user: CreateUserDTO): Promise<TUser> {
    this._loggerService.info(
      `user: ${JSON.stringify(user)}`,
      'MongoUserDAO.create',
    );
    let newUser: UserDocument = new this._userModel(user);
    newUser = await newUser.save();
    this._loggerService.info(
      `newUser: ${JSON.stringify(newUser)}`,
      'MongoUserDAO.create',
    );
    if (!newUser || !newUser._id) {
      throw new Error('Error creating user');
    }
    return asTUser(newUser);
  }
  async read(id: string): Promise<TUser> {
    const user: UserDocument | null = await this._userModel.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return asTUser(user);
  }
  async readAll(args?: TSearch<TUser>): Promise<TUser[]> {
    const user: UserDocument[] = await this._userModel.find(
      args?.filters ? { ...args.filters } : {},
      null,
      args?.pagination ? { skip: (args.pagination.page - 1) * args.pagination.limit, limit: args.pagination.limit } : {}
    );
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.length) {
      throw new Error("User doesn't contain anything");
    }
    return user.map(asTUser);
  }
  async update(user: UpdateUserDTO): Promise<TUser> {
    const updatedUser: UserDocument | null =
      await this._userModel.findByIdAndUpdate(user._id, user, { new: true });
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return asTUser(updatedUser);
  }
  async delete(id: string): Promise<TUser> {
    const deletedUser: UserDocument | null =
      await this._userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new Error('User not found');
    }
    return asTUser(deletedUser);
  }
}
