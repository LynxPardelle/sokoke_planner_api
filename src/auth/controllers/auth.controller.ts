import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Headers,
  Ip,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoggerService } from '@src/shared/services/logger.service';
import {
  LoginDTO,
  RegisterDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  VerifyEmailDTO,
  ChangePasswordDTO,
  RefreshTokenDTO,
} from '../DTOs/auth.dto';
import {
  AuthResponse,
  TokenValidationResponse,
  RefreshTokenResponse,
  PasswordResetResponse,
  EmailVerificationResponse,
  LogoutResponse,
} from '../types/auth-response.type';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    verified: boolean;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _loggerService: LoggerService,
  ) {}

  /**
   * Register a new user
   * POST /auth/register
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerData: RegisterDTO,
    @Headers('user-agent') userAgent: string,
    @Ip() ipAddress: string,
  ): Promise<AuthResponse> {
    try {
      this._loggerService.info('AuthController.register', 'AuthController');
      return await this._authService.register(registerData);
    } catch (error) {
      this._loggerService.error(`Registration failed: ${(error as Error).message}`, 'AuthController.register');
      throw error;
    }
  }

  /**
   * Login user
   * POST /auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginData: LoginDTO,
    @Headers('user-agent') userAgent: string,
    @Ip() ipAddress: string,
  ): Promise<AuthResponse> {
    try {
      this._loggerService.info('AuthController.login', 'AuthController');
      return await this._authService.login(loginData, userAgent, ipAddress);
    } catch (error) {
      this._loggerService.error(`Login failed: ${(error as Error).message}`, 'AuthController.login');
      throw error;
    }
  }

  /**
   * Refresh access token
   * POST /auth/refresh
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenData: RefreshTokenDTO): Promise<RefreshTokenResponse> {
    try {
      this._loggerService.info('AuthController.refreshToken', 'AuthController');
      return await this._authService.refreshToken(refreshTokenData);
    } catch (error) {
      this._loggerService.error(`Token refresh failed: ${(error as Error).message}`, 'AuthController.refreshToken');
      throw error;
    }
  }

  /**
   * Validate JWT token
   * POST /auth/validate
   */
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body() tokenData: { token: string }): Promise<TokenValidationResponse> {
    try {
      this._loggerService.info('AuthController.validateToken', 'AuthController');
      if (!tokenData.token) {
        throw new BadRequestException('Token is required');
      }
      return await this._authService.validateToken(tokenData.token);
    } catch (error) {
      this._loggerService.error(`Token validation failed: ${(error as Error).message}`, 'AuthController.validateToken');
      return { valid: false, error: 'Token validation failed' };
    }
  }

  /**
   * Request password reset
   * POST /auth/forgot-password
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordData: ForgotPasswordDTO): Promise<PasswordResetResponse> {
    try {
      this._loggerService.info('AuthController.forgotPassword', 'AuthController');
      return await this._authService.forgotPassword(forgotPasswordData);
    } catch (error) {
      this._loggerService.error(`Forgot password failed: ${(error as Error).message}`, 'AuthController.forgotPassword');
      throw error;
    }
  }

  /**
   * Reset password with token
   * POST /auth/reset-password
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordData: ResetPasswordDTO): Promise<PasswordResetResponse> {
    try {
      this._loggerService.info('AuthController.resetPassword', 'AuthController');
      return await this._authService.resetPassword(resetPasswordData);
    } catch (error) {
      this._loggerService.error(`Password reset failed: ${(error as Error).message}`, 'AuthController.resetPassword');
      throw error;
    }
  }

  /**
   * Verify email address
   * POST /auth/verify-email
   */
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyEmailData: VerifyEmailDTO): Promise<EmailVerificationResponse> {
    try {
      this._loggerService.info('AuthController.verifyEmail', 'AuthController');
      return await this._authService.verifyEmail(verifyEmailData);
    } catch (error) {
      this._loggerService.error(`Email verification failed: ${(error as Error).message}`, 'AuthController.verifyEmail');
      throw error;
    }
  }

  /**
   * Change password (for authenticated users)
   * POST /auth/change-password
   * Requires valid JWT token in Authorization header
   */
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body() changePasswordData: ChangePasswordDTO,
    @Headers('authorization') authHeader: string,
  ): Promise<PasswordResetResponse> {
    try {
      this._loggerService.info('AuthController.changePassword', 'AuthController');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new BadRequestException('Valid authorization token required');
      }

      const token = authHeader.substring(7);
      const tokenValidation = await this._authService.validateToken(token);
      
      if (!tokenValidation.valid || !tokenValidation.user) {
        throw new BadRequestException('Invalid or expired token');
      }

      return await this._authService.changePassword(tokenValidation.user.id, changePasswordData);
    } catch (error) {
      this._loggerService.error(`Change password failed: ${(error as Error).message}`, 'AuthController.changePassword');
      throw error;
    }
  }

  /**
   * Logout user
   * POST /auth/logout
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() logoutData: { refreshToken: string }): Promise<LogoutResponse> {
    try {
      this._loggerService.info('AuthController.logout', 'AuthController');
      
      if (!logoutData.refreshToken) {
        throw new BadRequestException('Refresh token is required');
      }

      const success = await this._authService.logout(logoutData.refreshToken);
      
      return {
        success,
        message: success ? 'Logged out successfully' : 'Logout failed'
      };
    } catch (error) {
      this._loggerService.error(`Logout failed: ${(error as Error).message}`, 'AuthController.logout');
      return {
        success: false,
        message: 'Logout failed'
      };
    }
  }

  /**
   * Get current user info (requires valid token)
   * GET /auth/me
   */
  @Get('me')
  async getCurrentUser(@Headers('authorization') authHeader: string): Promise<TokenValidationResponse> {
    try {
      this._loggerService.info('AuthController.getCurrentUser', 'AuthController');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { valid: false, error: 'Authorization token required' };
      }

      const token = authHeader.substring(7);
      return await this._authService.validateToken(token);
    } catch (error) {
      this._loggerService.error(`Get current user failed: ${(error as Error).message}`, 'AuthController.getCurrentUser');
      return { valid: false, error: 'Failed to get user information' };
    }
  }

  /**
   * Health check endpoint
   * GET /auth/health
   */
  @Get('health')
  @HttpCode(HttpStatus.OK)
  healthCheck(): { status: string; timestamp: string; service: string } {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Authentication Service'
    };
  }

  /**
   * Get authentication service information
   * GET /auth/info
   */
  @Get('info')
  @HttpCode(HttpStatus.OK)
  getServiceInfo(): {
    service: string;
    version: string;
    endpoints: string[];
    features: string[];
  } {
    return {
      service: 'Authentication Service',
      version: '1.0.0',
      endpoints: [
        'POST /auth/register',
        'POST /auth/login',
        'POST /auth/refresh',
        'POST /auth/validate',
        'POST /auth/forgot-password',
        'POST /auth/reset-password',
        'POST /auth/verify-email',
        'POST /auth/change-password',
        'POST /auth/logout',
        'GET /auth/me',
        'GET /auth/health',
        'GET /auth/info'
      ],
      features: [
        'User Registration',
        'User Authentication',
        'JWT Token Management',
        'Password Reset',
        'Email Verification',
        'Password Change',
        'Token Refresh',
        'User Session Management'
      ]
    };
  }
}
