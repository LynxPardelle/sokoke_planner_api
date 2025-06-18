import { IsBoolean, IsOptional, IsString, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';
import { TUserCreateDTO } from '../types/user.type';
import { IsStrongPassword, IsValidUsername, IsValidName, IsValidEmailWithInternationalChars } from '@src/shared/decorators/password-validation.decorator';

export class CreateUserDTO implements TUserCreateDTO {
  @IsOptional()
  @IsValidName()
  public name: string;
  
  @IsOptional()
  @IsValidName()
  public lastName: string;
  
  @IsValidEmailWithInternationalChars()
  @Transform(({ value }) => value?.toLowerCase())
  public email: string;
  
  @IsOptional()
  @IsString()
  @IsValidUsername()
  @Transform(({ value }) => value?.toLowerCase())
  public username: string;

  @IsOptional()
  @IsString()
  @IsStrongPassword()
  public password: string;

  @IsOptional()
  @IsString()
  public verifyToken: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  public verified: boolean;
  
  @IsOptional()
  @IsString()
  public resetToken?: string;
  
  @IsOptional()
  @IsDate()
  public resetTokenExpiry?: Date;
  
  constructor(user: TUserCreateDTO | undefined) {
    this.name = user?.name;
    this.lastName = user?.lastName;
    this.email = user?.email?.toLowerCase();
    this.username = user?.username?.toLowerCase();
    this.password = user?.password;
    this.verifyToken = user?.verifyToken;
    this.verified = user?.verified || false;
    this.resetToken = user?.resetToken;
    this.resetTokenExpiry = user?.resetTokenExpiry;
  }
}
