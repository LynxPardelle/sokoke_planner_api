import { IsString } from '@nestjs/class-validator';
import { TStatusUpdateDTO } from '../types/status.type';
import { CreateStatusDTO } from './createStatus.dto';
export class UpdateStatusDTO
  extends CreateStatusDTO
  implements TStatusUpdateDTO
{
  @IsString()
  public _id: string;
  constructor(status: TStatusUpdateDTO) {
    super(status);
    this._id = status._id;
    this.updatedAt = new Date();
  }
}
