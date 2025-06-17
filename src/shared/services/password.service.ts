import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class PasswordService {
  private readonly saltRounds = 12;

  /**
   * Hash a plain text password
   * @param password - Plain text password
   * @returns Hashed password
   */
  async hashPassword(password: string): Promise<string> {
    if (!password) {
      throw new Error('Password is required');
    }
    return await bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Verify a password against its hash
   * @param password - Plain text password
   * @param hash - Hashed password
   * @returns True if password matches hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    if (!password || !hash) {
      return false;
    }
    return await bcrypt.compare(password, hash);
  }

  /**
   * Generate a secure verification token
   * @param length - Token length (default: 32)
   * @returns Secure random token
   */
  generateVerificationToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate a secure password reset token
   * @param length - Token length (default: 32)
   * @returns Secure random token with timestamp
   */
  generatePasswordResetToken(length: number = 32): string {
    const token = crypto.randomBytes(length).toString('hex');
    const timestamp = Date.now().toString(36);
    return `${token}.${timestamp}`;
  }

  /**
   * Validate password strength
   * @param password - Password to validate
   * @returns Validation result with errors if any
   */
  validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!password) {
      errors.push('Password is required');
      return { isValid: false, errors };
    }

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (password.length > 128) {
      errors.push('Password must be less than 128 characters long');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common passwords
    const commonPasswords = [
      'password', 'password123', '123456', '123456789', 'qwerty',
      'abc123', 'password1', 'admin', 'letmein', 'welcome'
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Password is too common, please choose a more secure password');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if verification token is expired
   * @param token - Token to check
   * @param expirationHours - Hours until expiration (default: 24)
   * @returns True if token is expired
   */
  isTokenExpired(token: string, expirationHours: number = 24): boolean {
    if (!token || !token.includes('.')) {
      return true;
    }

    try {
      const [, timestampPart] = token.split('.');
      const timestamp = parseInt(timestampPart, 36);
      const expirationTime = timestamp + (expirationHours * 60 * 60 * 1000);
      return Date.now() > expirationTime;
    } catch {
      return true;
    }
  }

  /**
   * Generate a temporary password
   * @param length - Password length (default: 12)
   * @returns Secure temporary password
   */
  generateTemporaryPassword(length: number = 12): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one character from each required type
    password += this.getRandomChar('abcdefghijklmnopqrstuvwxyz'); // lowercase
    password += this.getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ'); // uppercase
    password += this.getRandomChar('0123456789'); // number
    password += this.getRandomChar('!@#$%^&*'); // special char
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += this.getRandomChar(charset);
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Get a random character from a charset
   * @param charset - Character set to choose from
   * @returns Random character
   */
  private getRandomChar(charset: string): string {
    return charset.charAt(Math.floor(Math.random() * charset.length));
  }
}
