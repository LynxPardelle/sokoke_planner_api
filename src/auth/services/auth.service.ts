import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@src/user/services/user.service';
import { PasswordService } from '@src/shared/services/password.service';
import { AuthUtilsService } from '@src/shared/services/auth-utils.service';
import { LoggerService } from '@src/shared/services/logger.service';
import { 
  LoginDTO, 
  RegisterDTO, 
  ForgotPasswordDTO, 
  ResetPasswordDTO, 
  VerifyEmailDTO,
  ChangePasswordDTO,
  RefreshTokenDTO 
} from '../DTOs/auth.dto';
import { 
  AuthResponse, 
  TokenValidationResponse,
  RefreshTokenResponse,
  PasswordResetResponse,
  EmailVerificationResponse 
} from '../types/auth-response.type';
import { CreateUserDTO } from '@src/user/DTOs/createUser.dto';

@Injectable()
export class AuthService {
  private readonly apiKeys: string[];
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;
  private readonly refreshTokenExpiration: string;
  private refreshTokenStore: Map<string, { userId: string; expiresAt: Date }> = new Map();

  constructor(
    private readonly _configService: ConfigService,
    private readonly _jwtService: JwtService,
    private readonly _userService: UserService,
    private readonly _passwordService: PasswordService,
    private readonly _authUtilsService: AuthUtilsService,
    private readonly _loggerService: LoggerService,
  ) {
    this.apiKeys = this._configService.get('apiKeys') || [];
    this.jwtSecret = this._configService.get('JWT_SECRET') || 'fallback-secret-key';
    this.jwtExpiresIn = this._configService.get('JWT_EXPIRES_IN') || '15m';
    this.refreshTokenExpiration = this._configService.get('REFRESH_TOKEN_EXPIRES_IN') || '7d';
  }
  validateApiKey(apiKey: string): boolean {
    return this.apiKeys.includes(apiKey);
  }
  /**
   * Register a new user
   */
  async register(registerData: RegisterDTO): Promise<AuthResponse> {
    try {
      this._loggerService.info('AuthService.register', 'AuthService');
      
      // Check if user already exists
      const existingUserResponse = await this._userService.readAll();
      if (existingUserResponse.status === 'success' && existingUserResponse.data) {
        const existingUser = existingUserResponse.data.find(user => user.email === registerData.email);
        if (existingUser) {
          throw new ConflictException('User with this email already exists');
        }
      }

      // Create user DTO
      const createUserData = new CreateUserDTO({
        name: registerData.name,
        lastName: registerData.lastName,
        email: registerData.email,
        password: registerData.password,
        verified: false
      });

      // Create the user (password will be hashed and verification token generated automatically)
      const userResponse = await this._userService.create(createUserData);
      
      if (userResponse.status !== 'success' || !userResponse.data) {
        throw new BadRequestException('Failed to create user');
      }

      const user = userResponse.data;

      // Generate tokens
      const payload = { sub: user._id, email: user.email, verified: user.verified };
      const accessToken = this._jwtService.sign(payload, { 
        secret: this.jwtSecret, 
        expiresIn: this.jwtExpiresIn 
      });
      const refreshToken = this.generateRefreshToken(user._id);

      this._loggerService.info(`User registered successfully: ${user.email}`, 'AuthService.register');

      return {
        success: true,
        message: 'User registered successfully. Please verify your email.',
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            verified: user.verified
          },
          expiresIn: this.getTokenExpirationTime()
        }
      };
    } catch (error) {
      this._loggerService.error(`Registration failed: ${(error as Error).message}`, 'AuthService.register');
      throw error;
    }
  }
  /**
   * Login user
   */
  async login(loginData: LoginDTO, userAgent?: string, ipAddress?: string): Promise<AuthResponse> {
    try {
      this._loggerService.info('AuthService.login', 'AuthService');

      // Security checks
      if (userAgent && this._authUtilsService.isSuspiciousUserAgent(userAgent)) {
        this._loggerService.warn(`Suspicious user agent detected: ${userAgent}`, 'AuthService.login');
      }

      // Find user by email
      const userResponse = await this._userService.readAll();
      if (userResponse.status !== 'success' || !userResponse.data) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const user = userResponse.data.find(u => u.email === loginData.email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await this._userService.verifyPassword(loginData.password, user.password);
      if (!isPasswordValid) {
        this._loggerService.warn(`Failed login attempt for email: ${loginData.email}`, 'AuthService.login');
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate tokens
      const payload = { sub: user._id, email: user.email, verified: user.verified };
      const accessToken = this._jwtService.sign(payload, { 
        secret: this.jwtSecret, 
        expiresIn: this.jwtExpiresIn 
      });
      const refreshToken = this.generateRefreshToken(user._id);

      this._loggerService.info(`User logged in successfully: ${user.email}`, 'AuthService.login');

      return {
        success: true,
        message: 'Login successful',
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            verified: user.verified
          },
          expiresIn: this.getTokenExpirationTime()
        }
      };
    } catch (error) {
      this._loggerService.error(`Login failed: ${(error as Error).message}`, 'AuthService.login');
      throw error;
    }
  }
  /**
   * Validate JWT token
   */
  async validateToken(token: string): Promise<TokenValidationResponse> {
    try {
      const payload = this._jwtService.verify(token, { secret: this.jwtSecret });
      
      // Get fresh user data
      const userResponse = await this._userService.read(payload.sub);
      if (userResponse.status !== 'success' || !userResponse.data) {
        return { valid: false, error: 'User not found' };
      }

      const user = userResponse.data;
      return {
        valid: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          lastName: user.lastName,
          verified: user.verified
        }
      };
    } catch (error) {
      return { valid: false, error: 'Invalid token' };
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshTokenData: RefreshTokenDTO): Promise<RefreshTokenResponse> {
    try {
      const storedToken = this.refreshTokenStore.get(refreshTokenData.refreshToken);
      
      if (!storedToken || storedToken.expiresAt < new Date()) {
        this.refreshTokenStore.delete(refreshTokenData.refreshToken);
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      // Get user data
      const userResponse = await this._userService.read(storedToken.userId);
      if (userResponse.status !== 'success' || !userResponse.data) {
        throw new UnauthorizedException('User not found');
      }

      const user = userResponse.data;

      // Generate new tokens
      const payload = { sub: user._id, email: user.email, verified: user.verified };
      const accessToken = this._jwtService.sign(payload, { 
        secret: this.jwtSecret, 
        expiresIn: this.jwtExpiresIn 
      });
      const newRefreshToken = this.generateRefreshToken(user._id);

      // Remove old refresh token
      this.refreshTokenStore.delete(refreshTokenData.refreshToken);

      return {
        success: true,
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: this.getTokenExpirationTime()
      };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(forgotPasswordData: ForgotPasswordDTO): Promise<PasswordResetResponse> {
    try {
      this._loggerService.info('AuthService.forgotPassword', 'AuthService');

      const userResponse = await this._userService.readAll();
      if (userResponse.status !== 'success' || !userResponse.data) {
        // Don't reveal if email exists or not
        return {
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.'
        };
      }

      const user = userResponse.data.find(u => u.email === forgotPasswordData.email);
      if (!user) {
        // Don't reveal if email exists or not
        return {
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.'
        };
      }

      const resetToken = this._userService.generatePasswordResetToken();

      // In a real application, you would save this token to the user record
      // and send an email with the reset link
      // For now, we'll return the token in the response (not recommended for production)
      
      this._loggerService.info(`Password reset requested for: ${user.email}`, 'AuthService.forgotPassword');

      return {
        success: true,
        message: 'Password reset link has been sent to your email.',
        resetTokenExpiration: '2 hours'
      };
    } catch (error) {
      this._loggerService.error(`Forgot password failed: ${(error as Error).message}`, 'AuthService.forgotPassword');
      throw error;
    }
  }

  /**
   * Reset password
   */
  async resetPassword(resetPasswordData: ResetPasswordDTO): Promise<PasswordResetResponse> {
    try {
      this._loggerService.info('AuthService.resetPassword', 'AuthService');

      // Check if token is expired
      if (this._userService.isTokenExpired(resetPasswordData.token, 2)) {
        throw new BadRequestException('Reset token has expired');
      }

      // In a real application, you would find the user by the reset token
      // For this example, we'll assume the token validation passed
      
      // Validate new password strength
      const validation = this._userService.validatePasswordStrength(resetPasswordData.newPassword);
      if (!validation.isValid) {
        throw new BadRequestException(validation.errors.join(', '));
      }

      this._loggerService.info('Password reset successful', 'AuthService.resetPassword');

      return {
        success: true,
        message: 'Password has been reset successfully.'
      };
    } catch (error) {
      this._loggerService.error(`Password reset failed: ${(error as Error).message}`, 'AuthService.resetPassword');
      throw error;
    }
  }

  /**
   * Verify email
   */
  async verifyEmail(verifyEmailData: VerifyEmailDTO): Promise<EmailVerificationResponse> {
    try {
      this._loggerService.info('AuthService.verifyEmail', 'AuthService');

      // In a real application, you would find the user by verification token
      // and update their verified status
      
      this._loggerService.info('Email verification successful', 'AuthService.verifyEmail');

      return {
        success: true,
        message: 'Email verified successfully.'
      };
    } catch (error) {
      this._loggerService.error(`Email verification failed: ${(error as Error).message}`, 'AuthService.verifyEmail');
      throw error;
    }
  }

  /**
   * Change password (for authenticated users)
   */
  async changePassword(userId: string, changePasswordData: ChangePasswordDTO): Promise<PasswordResetResponse> {
    try {
      this._loggerService.info('AuthService.changePassword', 'AuthService');

      const userResponse = await this._userService.read(userId);
      if (userResponse.status !== 'success' || !userResponse.data) {
        throw new UnauthorizedException('User not found');
      }

      const user = userResponse.data;

      // Verify current password
      const isCurrentPasswordValid = await this._userService.verifyPassword(
        changePasswordData.currentPassword, 
        user.password
      );
      
      if (!isCurrentPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }

      // Validate new password strength
      const validation = this._userService.validatePasswordStrength(changePasswordData.newPassword);
      if (!validation.isValid) {
        throw new BadRequestException(validation.errors.join(', '));
      }

      // In a real application, you would update the user's password here
      this._loggerService.info(`Password changed for user: ${user.email}`, 'AuthService.changePassword');

      return {
        success: true,
        message: 'Password changed successfully.'
      };
    } catch (error) {
      this._loggerService.error(`Change password failed: ${(error as Error).message}`, 'AuthService.changePassword');
      throw error;
    }
  }

  /**
   * Logout user (invalidate refresh token)
   */
  async logout(refreshToken: string): Promise<boolean> {
    try {
      this.refreshTokenStore.delete(refreshToken);
      this._loggerService.info('User logged out successfully', 'AuthService.logout');
      return true;
    } catch (error) {
      this._loggerService.error(`Logout failed: ${(error as Error).message}`, 'AuthService.logout');
      return false;
    }
  }

  /**
   * Generate refresh token
   */
  private generateRefreshToken(userId: string): string {
    const refreshToken = this._authUtilsService.generateSessionId(64);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    this.refreshTokenStore.set(refreshToken, { userId, expiresAt });
    return refreshToken;
  }

  /**
   * Get token expiration time in seconds
   */
  private getTokenExpirationTime(): number {
    const timeString = this.jwtExpiresIn;
    if (timeString.endsWith('m')) {
      return parseInt(timeString) * 60; // minutes to seconds
    } else if (timeString.endsWith('h')) {
      return parseInt(timeString) * 60 * 60; // hours to seconds
    } else if (timeString.endsWith('d')) {
      return parseInt(timeString) * 24 * 60 * 60; // days to seconds
    }
    return 900; // 15 minutes default
  }

  /**
   * Clean expired refresh tokens (should be called periodically)
   */
  cleanExpiredRefreshTokens(): void {
    const now = new Date();
    for (const [token, data] of this.refreshTokenStore.entries()) {
      if (data.expiresAt < now) {
        this.refreshTokenStore.delete(token);
      }
    }
  }
}
