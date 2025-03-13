import { IsString } from '@nestjs/class-validator';
import { TRequerimentUpdateDTO } from '../types/requeriment.type';
import { CreateRequerimentDTO } from './createRequeriment.dto';
export class UpdateRequerimentDTO
  extends CreateRequerimentDTO
  implements TRequerimentUpdateDTO
{
  @IsString()
  public _id: string;
  constructor(requeriment: TRequerimentUpdateDTO) {
    super(requeriment);
    this._id = requeriment._id;
    this.updatedAt = new Date();
  }
}
