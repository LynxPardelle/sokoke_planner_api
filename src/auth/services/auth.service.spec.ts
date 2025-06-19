import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@src/user/services/user.service';
import { PasswordService } from '@src/shared/services/password.service';
import { AuthUtilsService } from '@src/shared/services/auth-utils.service';
import { LoggerService } from '@src/shared/services/logger.service';
import { EmailService } from '@src/shared/services/email.service';
import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from '../DTOs/auth.dto';

describe('AuthService', () => {
  let service: AuthService;
  let configService: ConfigService;
  let jwtService: JwtService;
  let userService: UserService;
  let passwordService: PasswordService;
  let authUtilsService: AuthUtilsService;
  let loggerService: LoggerService;
  let emailService: EmailService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        'apiKeys': ['test-api-key'],
        'JWT_SECRET': 'test-secret',
        'JWT_EXPIRES_IN': '15m',
        'REFRESH_TOKEN_EXPIRES_IN': '7d',
        'frontendUrl': 'http://localhost:3001',
      };
      return config[key];
    }),
  };
  const mockJwtService = {
    sign: jest.fn(() => 'mock-jwt-token'),
    verify: jest.fn(() => ({ id: 1, email: 'test@test.com' })),
    decode: jest.fn(() => ({ id: 1, email: 'test@test.com' })),
  };  const mockUserService = {
    create: jest.fn(),
    readAll: jest.fn(),
    readOne: jest.fn(),
    read: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOneByEmail: jest.fn(),
    verifyPassword: jest.fn(),
    validatePasswordResetToken: jest.fn(),
    generateNewVerificationToken: jest.fn(),
    validatePasswordStrength: jest.fn(),
    generatePasswordResetToken: jest.fn(() => 'reset-token-123'),
    savePasswordResetToken: jest.fn(),
  };

  const mockPasswordService = {
    hashPassword: jest.fn(() => 'hashed-password'),
    comparePassword: jest.fn(() => true),
    generateRandomPassword: jest.fn(() => 'random-password'),
    validatePassword: jest.fn(() => true),
  };  const mockAuthUtilsService = {
    generateAuthTokens: jest.fn(),
    validateToken: jest.fn(),
    refreshToken: jest.fn(),
    generateSessionId: jest.fn(() => 'mock-session-id-12345'),
    isSuspiciousUserAgent: jest.fn(() => false),
  };

  const mockLoggerService = {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    http: jest.fn(),
    fatal: jest.fn(),
  };
  const mockEmailService = {
    sendEmail: jest.fn(),
    sendWelcomeEmail: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    sendProjectNotification: jest.fn(),
    sendTaskNotification: jest.fn(),
    sendPasswordChangedNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
        {
          provide: AuthUtilsService,
          useValue: mockAuthUtilsService,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
    passwordService = module.get<PasswordService>(PasswordService);
    authUtilsService = module.get<AuthUtilsService>(AuthUtilsService);
    loggerService = module.get<LoggerService>(LoggerService);
    emailService = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateApiKey', () => {
    it('should return true for valid API key', () => {
      const result = service.validateApiKey('test-api-key');
      expect(result).toBe(true);
    });

    it('should return false for invalid API key', () => {
      const result = service.validateApiKey('invalid-key');
      expect(result).toBe(false);
    });
  });

  describe('register', () => {
    const registerData: RegisterDTO = {
      name: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      password: 'password123',
    };

    it('should successfully register a new user', async () => {
      const mockUser = {
        id: 1,
        name: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        verifyToken: 'verify-token',
      };

      mockUserService.readAll.mockResolvedValue({
        status: 'success',
        data: [],
      });
      mockUserService.create.mockResolvedValue({
        status: 'success',
        data: mockUser,
      });

      const result = await service.register(registerData);

      expect(userService.readAll).toHaveBeenCalled();
      expect(userService.create).toHaveBeenCalled();
      expect(emailService.sendWelcomeEmail).toHaveBeenCalledWith(
        mockUser.email,
        `${mockUser.name} ${mockUser.lastName}`,
        expect.stringContaining(mockUser.verifyToken)
      );
      expect(loggerService.info).toHaveBeenCalledWith('AuthService.register', 'AuthService');
    });

    it('should throw ConflictException if user already exists', async () => {
      const existingUser = {
        id: 1,
        email: 'test@test.com',
      };

      mockUserService.readAll.mockResolvedValue({
        status: 'success',
        data: [existingUser],
      });

      await expect(service.register(registerData)).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if user creation fails', async () => {
      mockUserService.readAll.mockResolvedValue({
        status: 'success',
        data: [],
      });
      mockUserService.create.mockResolvedValue({
        status: 'error',
        data: null,
      });

      await expect(service.register(registerData)).rejects.toThrow(BadRequestException);
    });
  });
  // Add more test cases as needed
  describe('configuration', () => {
    it('should initialize with correct config values', () => {
      expect(configService.get).toHaveBeenCalledWith('apiKeys');
      expect(configService.get).toHaveBeenCalledWith('JWT_SECRET');
      expect(configService.get).toHaveBeenCalledWith('JWT_EXPIRES_IN');
      expect(configService.get).toHaveBeenCalledWith('REFRESH_TOKEN_EXPIRES_IN');
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'test@test.com',
      password: 'password123',
    };    it('should successfully login a user', async () => {
      const mockUser = {
        _id: 'user1',
        email: 'test@test.com',
        password: 'hashed-password',
        verified: true,
        name: 'Test',
        lastName: 'User',
      };

      mockUserService.readAll.mockResolvedValue({
        status: 'success',
        data: [mockUser],
      });
      mockUserService.verifyPassword.mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginData);

      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('accessToken');
      expect(result.data).toHaveProperty('user');
      expect(mockUserService.verifyPassword).toHaveBeenCalledWith(
        loginData.password,
        mockUser.password
      );
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockUserService.readAll.mockResolvedValue({
        status: 'success',
        data: [],
      });

      await expect(service.login(loginData)).rejects.toThrow();
    });    it('should allow login for unverified user but include verification status', async () => {
      const mockUser = {
        _id: 'user1',
        email: 'test@test.com',
        password: 'hashed-password',
        verified: false,
        name: 'Test',
        lastName: 'User',
      };

      mockUserService.readAll.mockResolvedValue({
        status: 'success',
        data: [mockUser],
      });
      mockUserService.verifyPassword.mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginData);

      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('accessToken');
      expect(result.data.user.verified).toBe(false);
    });
  });  describe('validateUser', () => {
    // Note: validateUser is a private method in AuthService, so we test it through login
    it('should validate credentials through login method', async () => {
      const loginData = {
        email: 'test@test.com',
        password: 'password123',
      };
      const mockUser = {
        _id: 'user1',
        email: 'test@test.com',
        password: 'hashed-password',
        verified: true,
      };

      mockUserService.readAll.mockResolvedValue({
        status: 'success',
        data: [mockUser],
      });
      mockUserService.verifyPassword.mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginData);

      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('accessToken');
      expect(mockUserService.verifyPassword).toHaveBeenCalledWith(
        loginData.password,
        mockUser.password
      );
    });
  });
  describe('verifyEmail', () => {
    it('should verify user email successfully', async () => {
      const verifyData = { token: 'verify-token' };

      const result = await service.verifyEmail(verifyData);

      expect(result).toHaveProperty('message');
      expect(result.success).toBe(true);
      expect(result.message).toBe('Email verified successfully.');
    });

    it('should verify email for any token (stub implementation)', async () => {
      const verifyData = { token: 'any-token' };

      const result = await service.verifyEmail(verifyData);

      expect(result).toHaveProperty('message');
      expect(result.success).toBe(true);
    });
  });
  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      const resetData = {
        token: 'reset-token',
        newPassword: 'newPassword123!',
      };
      const mockUser = {
        _id: 'user1',
        email: 'test@test.com',
        resetToken: 'reset-token',
        resetTokenExpiry: new Date(Date.now() + 3600000), // 1 hour from now
        name: 'Test',
        lastName: 'User',
      };

      mockUserService.validatePasswordResetToken.mockResolvedValue({
        valid: true,
        user: mockUser,
      });
      mockUserService.validatePasswordStrength.mockReturnValue({
        isValid: true,
        errors: [],
      });
      mockPasswordService.hashPassword.mockReturnValue('hashed-new-password');
      mockUserService.update.mockResolvedValue({
        status: 'success',
        data: { ...mockUser, password: 'hashed-new-password', resetToken: null },
      });

      const result = await service.resetPassword(resetData);

      expect(result).toHaveProperty('message');
      expect(mockPasswordService.hashPassword).toHaveBeenCalledWith(resetData.newPassword);
      expect(mockUserService.validatePasswordResetToken).toHaveBeenCalledWith(resetData.token);
    });

    it('should throw BadRequestException for invalid token', async () => {
      const resetData = {
        token: 'invalid-token',
        newPassword: 'newPassword123!',
      };
      
      mockUserService.validatePasswordResetToken.mockResolvedValue({
        valid: false,
        user: null,
      });

      await expect(service.resetPassword(resetData)).rejects.toThrow();
    });
  });  describe('forgotPassword', () => {    it('should send password reset email for valid user', async () => {
      const forgotPasswordData = { email: 'test@test.com' };
      const mockUser = {
        _id: 'user1',
        email: 'test@test.com',
        name: 'Test',
        lastName: 'User',
      };

      mockUserService.readAll.mockResolvedValue({
        status: 'success',
        data: [mockUser],
      });
      mockUserService.savePasswordResetToken.mockResolvedValue({
        status: 'success',
        data: mockUser,
      });

      const result = await service.forgotPassword(forgotPasswordData);

      expect(result).toHaveProperty('message');
      expect(result.success).toBe(true);
      expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalled();
    });

    it('should handle non-existent user gracefully', async () => {
      const forgotPasswordData = { email: 'nonexistent@test.com' };

      mockUserService.readAll.mockResolvedValue({
        status: 'success',
        data: [],
      });

      const result = await service.forgotPassword(forgotPasswordData);

      expect(result).toHaveProperty('message');
      expect(result.success).toBe(true);
    });
  });

  describe('validateToken', () => {
    it('should validate a valid JWT token', async () => {
      const token = 'valid-jwt-token';
      const mockPayload = { id: 1, email: 'test@test.com' };

      mockJwtService.verify.mockReturnValue(mockPayload);
      mockUserService.read.mockResolvedValue({
        status: 'success',
        data: {
          _id: 'user1',
          email: 'test@test.com',
          name: 'Test',
          lastName: 'User',
          verified: true,
        },
      });

      const result = await service.validateToken(token);

      expect(result).toHaveProperty('valid');
      expect(result.valid).toBe(true);
      expect(result.user).toBeDefined();
    });

    it('should handle invalid JWT token', async () => {
      const token = 'invalid-jwt-token';

      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = await service.validateToken(token);

      expect(result).toHaveProperty('valid');
      expect(result.valid).toBe(false);
    });
  });
  describe('refreshToken', () => {
    it('should reject invalid refresh token gracefully', async () => {
      const refreshData = { refreshToken: 'invalid-refresh-token' };

      const result = await service.refreshToken(refreshData);

      expect(result).toHaveProperty('success');
      expect(result.success).toBe(false);
      expect(result).toHaveProperty('error');
    });
  });
});
