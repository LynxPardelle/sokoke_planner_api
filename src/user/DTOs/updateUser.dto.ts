import { IsOptional, IsString, IsDate } from 'class-validator';
import { TUserUpdateDTO } from '../types/user.type';
import { CreateUserDTO } from './createUser.dto';
export class UpdateUserDTO extends CreateUserDTO implements TUserUpdateDTO {
  @IsString()
  public _id: string;
  @IsDate()
  @IsOptional()
  public createdAt: Date;
  @IsDate()
  @IsOptional()
  public updatedAt: Date;
  constructor(user: TUserUpdateDTO) {
    super(user);
    this._id = user._id;
  }
}
