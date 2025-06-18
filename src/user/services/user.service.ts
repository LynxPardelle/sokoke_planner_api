import { Injectable } from '@nestjs/common';
/* Repositories */
import UserRepository from '@src/user/repositories/user.repository';
/* Services */
import { PasswordService } from '@src/shared/services/password.service';
/* Types */
import { TUser } from '@src/user/types/user.type';
import { getResponseData, isSuccessResponse, TRepositoryResponse } from '@src/shared/types/repositoryResponse.type';
import { TSearch } from '@src/shared/types/search.type';
/* DTOs */
import { CreateUserDTO } from '@src/user/DTOs/createUser.dto';
import { UpdateUserDTO } from '@src/user/DTOs/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    private _userRepository: UserRepository,
    private _passwordService: PasswordService,
  ) { }
  author(): { [key: string]: string } {
    return {
      author: 'Lynx Pardelle',
      site: 'https://lynxpardelle.com',
      github: 'https://github.com/LynxPardelle',
    };
  }
  /* Create */
  async create(data: CreateUserDTO): Promise<TRepositoryResponse<TUser>> {
    // Hash password if provided
    if (data.password) {
      const hashedPassword = await this._passwordService.hashPassword(data.password);
      data.password = hashedPassword;
    }

    // Generate verification token if not provided
    if (!data.verifyToken) {
      const verificationToken = this._passwordService.generateVerificationToken();
      data.verifyToken = verificationToken;
    }

    return await this._userRepository.create(data);
  }

  /* Read */
  async read(id: string): Promise<TRepositoryResponse<TUser>> {
    return await this._userRepository.read(id);
  }
  async readAll(args?: TSearch<TUser>): Promise<TRepositoryResponse<TUser[]>> {
    return await this._userRepository.readAll(args);
  }

  /* Update */
  async update(data: UpdateUserDTO): Promise<TRepositoryResponse<TUser>> {
    return await this._userRepository.update(data);
  }
  /* Delete */
  async delete(id: string): Promise<TRepositoryResponse<TUser>> {
    return await this._userRepository.delete(id);
  }

  /* Password Operations */

  /**
   * Verify user password
   */
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await this._passwordService.verifyPassword(plainPassword, hashedPassword);
  }

  /**
   * Generate a new verification token for a user
   */
  generateNewVerificationToken(): string {
    return this._passwordService.generateVerificationToken();
  }

  /**
   * Generate a password reset token
   */
  generatePasswordResetToken(): string {
    return this._passwordService.generatePasswordResetToken();
  }

  /**
   * Check if a token is expired
   */
  isTokenExpired(token: string, expirationHours: number = 24): boolean {
    return this._passwordService.isTokenExpired(token, expirationHours);
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
    return this._passwordService.validatePasswordStrength(password);
  }

  /**
   * Generate a temporary password
   */
  generateTemporaryPassword(): string {
    return this._passwordService.generateTemporaryPassword();
  }

  /**
   * Save password reset token for a user
   */  async savePasswordResetToken(email: string, resetToken: string): Promise<boolean> {
    try {
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 24); // 24 hours expiry

      const usersWithEmail: TRepositoryResponse<TUser[]> = await this._userRepository.readAll({
        filters: { email },
        pagination: {
          page: 1,
          limit: 1
        }
      });
      const user: TUser | undefined = isSuccessResponse(usersWithEmail) ? getResponseData(usersWithEmail)[0] : undefined;

      if (!user) {
        console.error(`User with email ${email} not found`);
        return false;
      }
      const updateResult = await this._userRepository.update({
        ...user,
        resetToken,
        resetTokenExpiry: expiryDate,
        updatedAt: new Date()
      });

      return updateResult.status === 'success';
    } catch (error) {
      console.error(
        `Failed to save reset token for ${email}: ${(error as Error).message}`
      );
      return false;
    }
  }

  /**
   * Validate password reset token
   */
  async validatePasswordResetToken(token: string): Promise<{ valid: boolean; user?: TUser }> {
    try {
      const usersWithToken: TRepositoryResponse<TUser[]> = await this._userRepository.readAll({
        filters: { resetToken: token },
        pagination: {
          page: 1,
          limit: 1
        }
      });
      const user: TUser | undefined = isSuccessResponse(usersWithToken) ? getResponseData(usersWithToken)[0] : undefined;

      // Check if token has expired
      if (!user?.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
        return { valid: false };
      }

      return { valid: true, user };
    } catch (error) {
      console.error(
        `Failed to validate reset token: ${(error as Error).message}`
      );
      return { valid: false };
    }
  }

  /**
   * Clear password reset token
   */
  async clearPasswordResetToken(email: string): Promise<boolean> {
    try {
      const usersWithEmail: TRepositoryResponse<TUser[]> = await this._userRepository.readAll({
        filters: { email },
        pagination: {
          page: 1,
          limit: 1
        }
      });
      const user: TUser | undefined = isSuccessResponse(usersWithEmail) ? getResponseData(usersWithEmail)[0] : undefined;

      if (!user) {
        console.error(`User with email ${email} not found`);
        return false;
      }
      const updateResult = await this._userRepository.update({
        ...user,
        resetToken: '',
        resetTokenExpiry: null,
        updatedAt: new Date()
      });

      return updateResult.status === 'success';
    } catch (error) {
      console.error(
        `Failed to clear reset token for ${email}: ${(error as Error).message}`
      );
      return false;
    }
  }
}
