import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
/* Types */
import { TRequerimentDAO } from '@src/planner/types/daoPlanner.type';
import {
  TRequeriment,
  asTRequeriment,
} from '@src/planner/types/requeriment.type';
import { TSearch, TSearchResult } from '@src/shared/types/search.type';
/* DTOs */
import { CreateRequerimentDTO } from '@src/planner/DTOs/createRequeriment.dto';
import { UpdateRequerimentDTO } from '@src/planner/DTOs/updateRequeriment.dto';
/* Schemas */
import {
  RequerimentModel,
  RequerimentDocument,
} from '@src/planner/schemas/requeriment.schema';
/* Services */
import { SearchService } from '@src/shared/services/search.service';
@Injectable()
export class MongoDBRequerimentDAO implements TRequerimentDAO {
  constructor(
    @InjectModel('Requeriment') private _requerimentModel: RequerimentModel,
  ) {}
  async create(data: CreateRequerimentDTO): Promise<TRequeriment> {
    let newRequeriment: RequerimentDocument = new this._requerimentModel(data);
    newRequeriment = await newRequeriment.save();
    if (!newRequeriment || !newRequeriment._id) {
      throw new Error('Error creating requeriment');
    }
    return asTRequeriment(newRequeriment);
  }
  async read(id: string): Promise<TRequeriment> {
    const requeriment: RequerimentDocument | null =
      await this._requerimentModel.findById(id);
    if (!requeriment) throw new Error('Requeriment not found');
    return asTRequeriment(requeriment);
  }  async readAll(args?: TSearch<TRequeriment>): Promise<TSearchResult<TRequeriment>> {
    return await SearchService.executeSearch(
      this._requerimentModel,
      args,
      asTRequeriment
    );
  }
  async update(requeriment: UpdateRequerimentDTO): Promise<TRequeriment> {
    const requerimentUpdated: RequerimentDocument | null =
      await this._requerimentModel.findByIdAndUpdate(
        requeriment._id,
        requeriment,
        {
          new: true,
        },
      );
    if (!requerimentUpdated) throw new Error('Requeriment not found');
    return asTRequeriment(requerimentUpdated);
  }
  async delete(id: string): Promise<TRequeriment> {
    const requerimentDeleted: RequerimentDocument | null =
      await this._requerimentModel.findByIdAndDelete(id);
    if (!requerimentDeleted) throw new Error('Requeriment not found');
    return asTRequeriment(requerimentDeleted);
  }
}
