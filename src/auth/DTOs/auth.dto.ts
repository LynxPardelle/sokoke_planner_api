import { IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsStrongPassword, IsValidEmailWithInternationalChars, IsValidName } from '@src/shared/decorators/password-validation.decorator';

export class LoginDTO {
  @IsValidEmailWithInternationalChars()
  @Transform(({ value }) => value?.toLowerCase())
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class RegisterDTO {
  @IsValidEmailWithInternationalChars()
  @Transform(({ value }) => value?.toLowerCase())
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsValidName()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsValidName()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;
}

export class ForgotPasswordDTO {
  @IsValidEmailWithInternationalChars()
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
