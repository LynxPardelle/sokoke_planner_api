import { IsBoolean, IsOptional, IsString, IsEmail, MinLength, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { TUserCreateDTO } from '../types/user.type';
import { IsStrongPassword, IsValidUsername } from '@src/shared/decorators/password-validation.decorator';
export class CreateUserDTO implements TUserCreateDTO {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Name must be less than 50 characters long' })
  public name: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name must be less than 50 characters long' })
  public lastName: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
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
  public verified: boolean;  constructor(user: TUserCreateDTO | undefined) {
    this.name = user?.name;
    this.lastName = user?.lastName;
    this.email = user?.email?.toLowerCase();
    this.username = user?.username?.toLowerCase();
    this.password = user?.password;
    this.verifyToken = user?.verifyToken;
    this.verified = user?.verified || false;
  }

  /**
   * Set the verification token (to be called by the service)
   */
  setVerificationToken(token: string): void {
    this.verifyToken = token;
  }

  /**
   * Set the hashed password (to be called by the service)
   */
  setHashedPassword(hashedPassword: string): void {
    this.password = hashedPassword;
  }
}
