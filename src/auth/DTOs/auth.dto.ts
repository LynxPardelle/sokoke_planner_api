import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsStrongPassword } from '@src/shared/decorators/password-validation.decorator';

export class LoginDTO {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase())
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class RegisterDTO {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase())
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;
}

export class ForgotPasswordDTO {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase())
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}

export class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty({ message: 'Reset token is required' })
  token: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty({ message: 'New password is required' })
  newPassword: string;
}

export class VerifyEmailDTO {
  @IsString()
  @IsNotEmpty({ message: 'Verification token is required' })
  token: string;
}

export class ChangePasswordDTO {
  @IsString()
  @IsNotEmpty({ message: 'Current password is required' })
  currentPassword: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty({ message: 'New password is required' })
  newPassword: string;
}

export class RefreshTokenDTO {
  @IsString()
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken: string;
}
