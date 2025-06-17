/**
 * Password and Authentication Utilities Usage Examples
 * 
 * This file demonstrates how to use the password and authentication utilities
 * created in the shared folder for user management.
 */

import { PasswordService } from '@src/shared/services/password.service';
import { AuthUtilsService } from '@src/shared/services/auth-utils.service';

// Example usage in a service or controller

export class ExampleUsage {
  constructor(
    private passwordService: PasswordService,
    private authUtilsService: AuthUtilsService,
  ) {}

  /**
   * Example: Creating a new user with password hashing
   */
  async createUserExample() {
    const plainPassword = 'MySecurePassword123!';

    // 1. Validate password strength
    const validation = this.passwordService.validatePasswordStrength(plainPassword);
    if (!validation.isValid) {
      throw new Error(`Password validation failed: ${validation.errors.join(', ')}`);
    }

    // 2. Hash the password
    const hashedPassword = await this.passwordService.hashPassword(plainPassword);

    // 3. Generate verification token
    const verificationToken = this.passwordService.generateVerificationToken();

    // User data ready for database storage
    const userData = {
      email: 'user@example.com',
      password: hashedPassword, // Store this in database
      verifyToken: verificationToken,
      verified: false,
    };

    return userData;
  }

  /**
   * Example: User login verification
   */
  async loginExample(email: string, password: string, hashedPasswordFromDB: string) {
    // Verify the password
    const isPasswordValid = await this.passwordService.verifyPassword(password, hashedPasswordFromDB);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    return { success: true, message: 'Login successful' };
  }

  /**
   * Example: Password reset flow
   */
  async passwordResetExample(email: string) {
    // Generate reset token
    const resetToken = this.passwordService.generatePasswordResetToken();
    
    // Check if token is expired (example check after some time)
    const isExpired = this.passwordService.isTokenExpired(resetToken, 2); // 2 hours expiration
    
    if (isExpired) {
      throw new Error('Reset token has expired');
    }

    return { resetToken, expiresIn: '2 hours' };
  }

  /**
   * Example: Username validation and suggestions
   */
  async usernameValidationExample(email: string, name?: string) {
    const desiredUsername = 'admin'; // This should fail validation

    // Validate username format
    const validation = this.authUtilsService.validateUsernameFormat(desiredUsername);
    
    if (!validation.isValid) {
      // Generate suggestions if validation fails
      const suggestions = this.authUtilsService.generateUsernameSuggestions(email, name);
      
      return {
        isValid: false,
        errors: validation.errors,
        suggestions: suggestions.slice(0, 5) // Return top 5 suggestions
      };
    }

    return { isValid: true, username: desiredUsername };
  }

  /**
   * Example: Email domain validation
   */
  emailDomainValidationExample(email: string) {
    // Allow only specific domains (optional)
    const allowedDomains = ['company.com', 'partner.org'];
    
    const isAllowed = this.authUtilsService.isEmailDomainAllowed(email, allowedDomains);
    
    if (!isAllowed) {
      throw new Error('Email domain is not allowed');
    }

    return { success: true };
  }

  /**
   * Example: Security checks
   */
  securityChecksExample(userAgent: string, ipAddress: string) {
    // Check suspicious user agent
    const isSuspicious = this.authUtilsService.isSuspiciousUserAgent(userAgent);
    
    if (isSuspicious) {
      console.warn(`Suspicious user agent detected: ${userAgent}`);
    }

    // Rate limiting example
    const attempts = new Map();
    const key = `${ipAddress}:login`;
    const isAllowed = this.authUtilsService.isActionAllowed(key, 5, 15 * 60 * 1000, attempts); // 5 attempts per 15 minutes
    
    if (!isAllowed) {
      throw new Error('Too many login attempts. Please try again later.');
    }

    return { securityPassed: true };
  }

  /**
   * Example: Input sanitization
   */
  inputSanitizationExample(userInput: string) {
    const sanitizedInput = this.authUtilsService.sanitizeInput(userInput);
    
    return {
      original: userInput,
      sanitized: sanitizedInput
    };
  }

  /**
   * Example: Generate temporary password for password reset
   */
  generateTemporaryPasswordExample() {
    const tempPassword = this.passwordService.generateTemporaryPassword(12);
    
    // This would typically be sent via email and user forced to change on first login
    return {
      temporaryPassword: tempPassword,
      instructions: 'Please log in with this temporary password and change it immediately.'
    };
  }
}

/**
 * DTO Validation Examples
 * 
 * The CreateUserDTO now automatically validates:
 * - Email format and converts to lowercase
 * - Username format (alphanumeric, underscores, hyphens only, no reserved words)
 * - Password strength (8+ chars, uppercase, lowercase, number, special char)
 * - Name and lastName length constraints
 * - Boolean transformation for verified field
 * 
 * When creating a user, the validation happens automatically via the global ValidationPipe.
 */

// Example request body that would pass validation:
const validUserData = {
  name: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com', // Will be converted to lowercase
  username: 'johndoe123', // Will be converted to lowercase and validated
  password: 'MySecurePass123!', // Must meet strength requirements
  verified: false // Optional, defaults to false
};

// Example request body that would fail validation:
const invalidUserData = {
  name: 'J', // Too short
  lastName: '', // Too short if provided
  email: 'invalid-email', // Invalid email format
  username: 'admin', // Reserved username
  password: '123', // Too weak
  verified: 'yes' // Will be converted to boolean true
};

export { validUserData, invalidUserData };
