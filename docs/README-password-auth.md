# Password and Authentication Utilities

This document describes the password management and authentication utilities available in the shared module.

## Overview

The shared module now includes comprehensive password and authentication utilities that provide:
- Secure password hashing and verification
- Password strength validation
- Verification token generation
- Username validation
- Email validation
- Security utilities
- Custom validation decorators

## Services

### PasswordService

Located at: `src/shared/services/password.service.ts`

#### Methods

- `hashPassword(password: string)`: Hash a plain text password using bcrypt
- `verifyPassword(password: string, hash: string)`: Verify a password against its hash
- `generateVerificationToken(length?: number)`: Generate a secure verification token
- `generatePasswordResetToken(length?: number)`: Generate a password reset token with timestamp
- `validatePasswordStrength(password: string)`: Validate password strength with detailed errors
- `isTokenExpired(token: string, expirationHours?: number)`: Check if a token is expired
- `generateTemporaryPassword(length?: number)`: Generate a secure temporary password

#### Password Strength Requirements

- Minimum 8 characters
- Maximum 128 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number
- At least one special character
- Not a common password

### AuthUtilsService

Located at: `src/shared/services/auth-utils.service.ts`

#### Methods

- `isEmailDomainAllowed(email: string, allowedDomains?: string[])`: Check if email domain is allowed
- `validateUsernameFormat(username: string)`: Validate username format
- `generateUsernameSuggestions(email: string, name?: string)`: Generate username suggestions
- `sanitizeInput(input: string)`: Sanitize user input
- `generateSessionId(length?: number)`: Generate secure session ID
- `isSuspiciousUserAgent(userAgent: string)`: Check for suspicious user agents
- `isActionAllowed(...)`: Rate limiting helper

#### Username Validation Rules

- 3-30 characters long
- Only letters, numbers, underscores, and hyphens
- Cannot start or end with underscore or hyphen
- Cannot be a reserved word (admin, root, etc.)

## Custom Validation Decorators

Located at: `src/shared/decorators/password-validation.decorator.ts`

### @IsStrongPassword()

Validates password strength according to the requirements above.

```typescript
@IsStrongPassword()
password: string;
```

### @IsValidUsername()

Validates username format according to the rules above.

```typescript
@IsValidUsername()
username: string;
```

## Updated CreateUserDTO

The `CreateUserDTO` now includes comprehensive validation:

```typescript
export class CreateUserDTO {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase())
  email: string;

  @IsOptional()
  @IsString()
  @IsValidUsername()
  @Transform(({ value }) => value?.toLowerCase())
  username: string;

  @IsOptional()
  @IsString()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsString()
  verifyToken: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === true || value === 'true')
  verified: boolean;
}
```

## UserService Updates

The `UserService` now automatically:

1. **Hash passwords** when creating users
2. **Generate verification tokens** if not provided
3. **Provide password-related utility methods**

### New Methods

- `verifyPassword(plainPassword: string, hashedPassword: string)`: Verify user password
- `generateNewVerificationToken()`: Generate new verification token
- `generatePasswordResetToken()`: Generate password reset token
- `isTokenExpired(token: string, expirationHours?: number)`: Check token expiration
- `validatePasswordStrength(password: string)`: Validate password strength
- `generateTemporaryPassword()`: Generate temporary password

## Usage Examples

### Creating a User

```typescript
// The controller automatically validates the DTO
@Post('')
async create(@Body() data: CreateUserDTO) {
  // Password will be hashed and verification token generated automatically
  return await this._userService.create(data);
}
```

### Validating Password on Login

```typescript
async login(email: string, password: string) {
  const user = await this.findUserByEmail(email);
  const isValid = await this._userService.verifyPassword(password, user.password);
  
  if (!isValid) {
    throw new UnauthorizedException('Invalid credentials');
  }
  
  return { success: true };
}
```

### Password Reset Flow

```typescript
async requestPasswordReset(email: string) {
  const resetToken = this._userService.generatePasswordResetToken();
  
  // Save token to user record and send email
  await this.saveResetToken(email, resetToken);
  await this.sendResetEmail(email, resetToken);
  
  return { message: 'Reset email sent' };
}

async resetPassword(token: string, newPassword: string) {
  if (this._userService.isTokenExpired(token, 2)) { // 2 hours
    throw new BadRequestException('Reset token expired');
  }
  
  // Validate new password strength
  const validation = this._userService.validatePasswordStrength(newPassword);
  if (!validation.isValid) {
    throw new BadRequestException(validation.errors.join(', '));
  }
  
  // Hash and save new password
  const hashedPassword = await this._passwordService.hashPassword(newPassword);
  await this.updateUserPassword(token, hashedPassword);
  
  return { message: 'Password updated successfully' };
}
```

## Security Features

### Rate Limiting

```typescript
const attempts = new Map();
const key = `${ipAddress}:login`;
const isAllowed = this._authUtils.isActionAllowed(key, 5, 15 * 60 * 1000, attempts);

if (!isAllowed) {
  throw new TooManyRequestsException('Too many attempts');
}
```

### Input Sanitization

```typescript
const sanitizedInput = this._authUtils.sanitizeInput(userInput);
```

### Suspicious Activity Detection

```typescript
if (this._authUtils.isSuspiciousUserAgent(req.headers['user-agent'])) {
  // Log suspicious activity
  this._logger.warn('Suspicious user agent detected');
}
```

## Dependencies

The following packages were added:
- `bcrypt`: For password hashing
- `@types/bcrypt`: TypeScript definitions for bcrypt

## Configuration

The password service uses the following defaults:
- Salt rounds: 12 (for bcrypt)
- Token length: 32 bytes (64 hex characters)
- Password reset token expiration: 24 hours
- Temporary password length: 12 characters

These can be customized by modifying the service or injecting configuration values.

## Error Handling

All services provide detailed error messages and validation results. The validation decorators automatically integrate with NestJS's global validation pipe to provide consistent error responses.

## Security Best Practices

1. **Always hash passwords** before storing in database
2. **Use verification tokens** for email verification
3. **Implement rate limiting** for authentication endpoints
4. **Validate input** using the provided decorators
5. **Check for suspicious activity** using the auth utils
6. **Use secure session IDs** for session management
7. **Implement proper token expiration** for reset flows
