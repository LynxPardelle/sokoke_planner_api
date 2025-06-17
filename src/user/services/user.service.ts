import { Injectable } from '@nestjs/common';
/* Repositories */
import UserRepository from '@src/user/repositories/user.repository';
/* Services */
import { PasswordService } from '@src/shared/services/password.service';
/* Types */
import { TUser } from '@src/user/types/user.type';
import { TUserRepository } from '@src/user/types/repositoryUser.type';
import { TRepositoryResponse } from '@src/shared/types/repositoryResponse.type';
import { TSearch } from '@src/shared/types/search.type';
/* DTOs */
import { CreateUserDTO } from '@src/user/DTOs/createUser.dto';
import { UpdateUserDTO } from '@src/user/DTOs/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    private _userRepository: UserRepository,
    private _passwordService: PasswordService,
  ) {}
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
      data.setHashedPassword(hashedPassword);
    }

    // Generate verification token if not provided
    if (!data.verifyToken) {
      const verificationToken = this._passwordService.generateVerificationToken();
      data.setVerificationToken(verificationToken);
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
}
