import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';
import { TStatusCreateDTO } from '../types/status.type';
import { colorDTO } from '@src/shared/DTOs/color.dto';
import { isTUser } from '@src/user/types/user.type';
export class CreateStatusDTO extends colorDTO implements TStatusCreateDTO {
  @IsOptional()
  @IsString()
  public name: string;
  @IsOptional()
  @IsString()
  public description: string;
  @IsOptional()
  @IsArray()
  public owners?: string[];
  @IsOptional()
  @IsDate()
  public createdAt: Date;
  @IsOptional()
  @IsDate()
  public updatedAt: Date;
  constructor(status: TStatusCreateDTO | undefined) {
    super(status);
    this.name = status?.name || '';
    this.description = status?.description || '';
    this.owners = status?.owners
      ? (status?.owners as any[]).map((owner) =>
          typeof owner === 'object' && isTUser(owner) ? owner._id : owner,
        )
      : [];
    this.createdAt = status?.createdAt || new Date();
    this.updatedAt = new Date();
  }
}
