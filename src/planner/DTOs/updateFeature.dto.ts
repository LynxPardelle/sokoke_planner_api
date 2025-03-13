import { IsString } from '@nestjs/class-validator';
import { TFeatureUpdateDTO } from '../types/feature.type';
import { CreateFeatureDTO } from './createFeature.dto';
export class UpdateFeatureDTO
  extends CreateFeatureDTO
  implements TFeatureUpdateDTO
{
  @IsString()
  public _id: string;
  constructor(feature: TFeatureUpdateDTO) {
    super(feature);
    this._id = feature._id;
    this.updatedAt = new Date();
  }
}
