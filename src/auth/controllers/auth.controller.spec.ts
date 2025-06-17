import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { LoggerService } from '@src/shared/services/logger.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    validateToken: jest.fn(),
    refreshToken: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    verifyEmail: jest.fn(),
    changePassword: jest.fn(),
    logout: jest.fn(),
  };

  const mockLoggerService = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerData = {
        name: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'SecurePassword123!',
      };

      const expectedResponse = {
        success: true,
        message: 'User registered successfully. Please verify your email.',
        data: {
          accessToken: 'fake-access-token',
          refreshToken: 'fake-refresh-token',
          user: {
            id: 'fake-user-id',
            email: 'john.doe@example.com',
            name: 'John',
            lastName: 'Doe',
            verified: false,
          },
          expiresIn: 900,
        },
      };

      mockAuthService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(registerData, 'user-agent', '127.0.0.1');

      expect(service.register).toHaveBeenCalledWith(registerData);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginData = {
        email: 'john.doe@example.com',
        password: 'SecurePassword123!',
      };

      const expectedResponse = {
        success: true,
        message: 'Login successful',
        data: {
          accessToken: 'fake-access-token',
          refreshToken: 'fake-refresh-token',
          user: {
            id: 'fake-user-id',
            email: 'john.doe@example.com',
            name: 'John',
            lastName: 'Doe',
            verified: true,
          },
          expiresIn: 900,
        },
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginData, 'user-agent', '127.0.0.1');

      expect(service.login).toHaveBeenCalledWith(loginData, 'user-agent', '127.0.0.1');
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('validateToken', () => {
    it('should validate a token', async () => {
      const tokenData = { token: 'fake-jwt-token' };
      const expectedResponse = {
        valid: true,
        user: {
          id: 'fake-user-id',
          email: 'john.doe@example.com',
          name: 'John',
          lastName: 'Doe',
          verified: true,
        },
      };

      mockAuthService.validateToken.mockResolvedValue(expectedResponse);

      const result = await controller.validateToken(tokenData);

      expect(service.validateToken).toHaveBeenCalledWith('fake-jwt-token');
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('healthCheck', () => {
    it('should return health status', () => {
      const result = controller.healthCheck();

      expect(result).toHaveProperty('status', 'OK');
      expect(result).toHaveProperty('service', 'Authentication Service');
      expect(result).toHaveProperty('timestamp');
    });
  });

  describe('getServiceInfo', () => {
    it('should return service information', () => {
      const result = controller.getServiceInfo();

      expect(result).toHaveProperty('service', 'Authentication Service');
      expect(result).toHaveProperty('version', '1.0.0');
      expect(result).toHaveProperty('endpoints');
      expect(result).toHaveProperty('features');
      expect(Array.isArray(result.endpoints)).toBe(true);
      expect(Array.isArray(result.features)).toBe(true);
    });
  });
});
