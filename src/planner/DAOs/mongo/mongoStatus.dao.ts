import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
/* Types */
import { TStatusDAO } from '@src/planner/types/daoPlanner.type';
import { TStatus, asTStatus } from '@src/planner/types/status.type';
import { TSearch } from '@src/shared/types/search.type';
/* DTOs */
import { CreateStatusDTO } from '@src/planner/DTOs/createStatus.dto';
import { UpdateStatusDTO } from '@src/planner/DTOs/updateStatus.dto';
/* Schemas */
import {
  StatusModel,
  StatusDocument,
} from '@src/planner/schemas/status.schema';
@Injectable()
export class MongoDBStatusDAO implements TStatusDAO {
  constructor(@InjectModel('Status') private _statusModel: StatusModel) {}
  async create(data: CreateStatusDTO): Promise<TStatus> {
    let newStatus: StatusDocument = new this._statusModel(data);
    newStatus = await newStatus.save();
    if (!newStatus || !newStatus._id) {
      throw new Error('Error creating status');
    }
    return asTStatus(newStatus);
  }
  async read(id: string): Promise<TStatus> {
    const status: StatusDocument | null = await this._statusModel.findById(id);
    if (!status) throw new Error('Status not found');
    return asTStatus(status);
  }
  async readAll(args?: TSearch<TStatus>): Promise<TStatus[]> {
    const statuses: StatusDocument[] = await this._statusModel.find();
    if (!statuses) throw new Error('Statuses not found');
    if (!statuses.length) throw new Error("Statuses doesn't contain anything");
    return statuses.map(asTStatus);
  }
  async update(status: UpdateStatusDTO): Promise<TStatus> {
    const statusUpdated: StatusDocument | null =
      await this._statusModel.findByIdAndUpdate(status._id, status, {
        new: true,
      });
    if (!statusUpdated) throw new Error('Status not found');
    return asTStatus(statusUpdated);
  }
  async delete(id: string): Promise<TStatus> {
    const statusDeleted: StatusDocument | null =
      await this._statusModel.findByIdAndDelete(id);
    if (!statusDeleted) throw new Error('Status not found');
    return asTStatus(statusDeleted);
  }
}