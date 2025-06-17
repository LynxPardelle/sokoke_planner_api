import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { TUserCreateDTO } from '../types/user.type';
export class CreateUserDTO implements TUserCreateDTO {
  @IsOptional()
  @IsString()
  public name: string;
  @IsOptional()
  @IsString()
  public lastName: string;
  @IsOptional()
  @IsString()
  public email: string;
  @IsOptional()
  @IsString()
  public username: string;
  @IsOptional()
  @IsString()
  public password: string;
  @IsOptional()
  @IsString()
  public verifyToken: string;
  @IsOptional()
  @IsBoolean()
  public verified: boolean;
  constructor(user: TUserCreateDTO | undefined) {
    this.name = user?.name;
    this.lastName = user?.lastName;
    this.email = user?.email;
    this.username = user?.username;
    this.password = user?.password;
    this.verifyToken = user?.verifyToken;
    this.verified = user?.verified;
  }
}
