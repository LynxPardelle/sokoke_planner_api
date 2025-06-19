import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken as getTypeOrmRepositoryToken } from '@nestjs/typeorm';
import { getModelToken as getMongooseModelToken } from '@nestjs/mongoose';
import { Repository } from 'typeorm';
import { Model } from 'mongoose';

// Mock classes
export class MockRepository<T = any> {
  find = jest.fn();
  findOne = jest.fn();
  findOneBy = jest.fn();
  save = jest.fn();
  update = jest.fn();
  delete = jest.fn();
  remove = jest.fn();
  create = jest.fn();
  findAndCount = jest.fn();
  count = jest.fn();
  createQueryBuilder = jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    getMany: jest.fn(),
    getManyAndCount: jest.fn(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
  }));
}

export class MockModel<T = any> {
  constructor(private data?: Partial<T>) {}
  
  static find = jest.fn();
  static findOne = jest.fn();
  static findOneAndUpdate = jest.fn();
  static findOneAndDelete = jest.fn();
  static findById = jest.fn();
  static findByIdAndUpdate = jest.fn();
  static findByIdAndDelete = jest.fn();
  static create = jest.fn();
  static insertMany = jest.fn();
  static deleteMany = jest.fn();
  static updateMany = jest.fn();
  static countDocuments = jest.fn();
  static aggregate = jest.fn();
  
  save = jest.fn();
  remove = jest.fn();
  updateOne = jest.fn();
  deleteOne = jest.fn();
  toObject = jest.fn(() => this.data);
  toJSON = jest.fn(() => this.data);
  populate = jest.fn().mockReturnThis();
  execPopulate = jest.fn();
}

export class MockLoggerService {
  debug = jest.fn();
  http = jest.fn();
  info = jest.fn();
  warn = jest.fn();
  error = jest.fn();
  fatal = jest.fn();
}

export class MockConfigService {
  get = jest.fn((key: string) => {
    const config = {
      'JWT_SECRET': 'test-secret',
      'JWT_EXPIRATION': '1h',
      'APP_NAME': 'Test App',
      'APP_URL': 'http://localhost:3000',
      'DATABASE_TYPE': 'sqlite',
      'EMAIL_HOST': 'localhost',
      'EMAIL_PORT': 587,
      'EMAIL_USER': 'test@test.com',
      'EMAIL_PASS': 'password',
      'EMAIL_FROM': 'noreply@test.com',
    };
    return config[key] || 'default-value';
  });
}

export class MockJwtService {
  sign = jest.fn(() => 'mock-jwt-token');
  verify = jest.fn(() => ({ id: 1, email: 'test@test.com' }));
  decode = jest.fn(() => ({ id: 1, email: 'test@test.com' }));
}

export class MockEmailService {
  sendEmail = jest.fn();
  sendWelcomeEmail = jest.fn();
  sendPasswordResetEmail = jest.fn();
  sendProjectNotification = jest.fn();
  sendTaskNotification = jest.fn();
  sendProjectAssignmentNotification = jest.fn();
}

export class MockPasswordService {
  hashPassword = jest.fn((password: string) => `hashed-${password}`);
  comparePassword = jest.fn(() => true);
  generateRandomPassword = jest.fn(() => 'random-password');
  validatePassword = jest.fn(() => true);
}

// Specific service and repository mocks
export const createMockUserRepository = () => ({
  create: jest.fn(),
  read: jest.fn(),
  readAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  search: jest.fn(),
});

export const createMockPasswordService = () => ({
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
  comparePassword: jest.fn(),
  generateVerificationToken: jest.fn(),
  generatePasswordResetToken: jest.fn(),
  generateTemporaryPassword: jest.fn(),
  isTokenExpired: jest.fn(),
  validatePasswordStrength: jest.fn(),
  generateRandomPassword: jest.fn(),
  validatePassword: jest.fn(),
});

export const createMockProjectRepository = () => ({
  create: jest.fn(),
  read: jest.fn(),
  readAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  search: jest.fn(),
});

export const createMockProjectCategoryRepository = () => ({
  create: jest.fn(),
  read: jest.fn(),
  readAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  search: jest.fn(),
});

export const createMockProjectSubCategoryRepository = () => ({
  create: jest.fn(),
  read: jest.fn(),
  readAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  search: jest.fn(),
});

export const createMockFeatureRepository = () => ({
  create: jest.fn(),
  read: jest.fn(),
  readAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  search: jest.fn(),
});

export const createMockRequerimentRepository = () => ({
  create: jest.fn(),
  read: jest.fn(),
  readAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  search: jest.fn(),
});

export const createMockTaskRepository = () => ({
  create: jest.fn(),
  read: jest.fn(),
  readAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  search: jest.fn(),
});

export const createMockStatusRepository = () => ({
  create: jest.fn(),
  read: jest.fn(),
  readAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  search: jest.fn(),
});

export class MockUserService {
  create = jest.fn();
  read = jest.fn();
  findAll = jest.fn();
  findOne = jest.fn();
  findOneByEmail = jest.fn();
  update = jest.fn();
  delete = jest.fn();
  search = jest.fn();
  readAll = jest.fn();
  verifyPassword = jest.fn();
  generateNewVerificationToken = jest.fn();
  validatePasswordStrength = jest.fn();
  validatePasswordResetToken = jest.fn();
}

export class MockAuthUtilsService {
  generateAuthTokens = jest.fn();
  validateToken = jest.fn();
  refreshToken = jest.fn();
  generateSessionId = jest.fn(() => 'mock-session-id-12345');
}

// Test module builders
export const createTestingModuleBuilder = () => Test.createTestingModule({});

export const createMockRepository = <T>(entity: any): MockRepository<T> => {
  return new MockRepository<T>();
};

export const createMockModel = <T>(data?: Partial<T>): any => {
  return MockModel;
};

// Common providers for testing
export const getCommonTestProviders = () => [
  {
    provide: 'LoggerService',
    useClass: MockLoggerService,
  },
  {
    provide: ConfigService,
    useClass: MockConfigService,
  },
  {
    provide: JwtService,
    useClass: MockJwtService,
  },
  {
    provide: 'EmailService',
    useClass: MockEmailService,
  },
  {
    provide: 'PasswordService',
    useClass: MockPasswordService,
  },
  {
    provide: 'UserService',
    useClass: MockUserService,
  },
  {
    provide: 'AuthUtilsService',
    useClass: MockAuthUtilsService,
  },
];

// Helper to get repository and model tokens
export const getTestRepositoryToken = (entity: any) => getTypeOrmRepositoryToken(entity);
export const getTestModelToken = (name: string) => getMongooseModelToken(name);

// Helper function to create mock data
export const createMockData = {
  user: (overrides?: any) => ({
    id: 1,
    email: 'test@test.com',
    username: 'testuser',
    name: 'Test User',
    password: 'hashed-password',
    emailVerified: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),
  
  project: (overrides?: any) => ({
    id: 1,
    name: 'Test Project',
    description: 'Test project description',
    userId: 1,
    categoryId: 1,
    subCategoryId: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),
  
  task: (overrides?: any) => ({
    id: 1,
    title: 'Test Task',
    description: 'Test task description',
    projectId: 1,
    userId: 1,
    statusId: 1,
    priority: 'medium',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),
  
  projectCategory: (overrides?: any) => ({
    id: 1,
    name: 'Test Category',
    description: 'Test category description',
    color: '#000000',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),
  
  status: (overrides?: any) => ({
    id: 1,
    name: 'In Progress',
    description: 'Task is in progress',
    color: '#FFA500',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),
};

// Helper to setup test environment
export const setupTestEnvironment = async (options: {
  controllers?: any[];
  providers?: any[];
  imports?: any[];
  repositories?: any[];
  models?: string[];
}) => {
  const { controllers = [], providers = [], imports = [], repositories = [], models = [] } = options;
    const testProviders = [
    ...providers,
    ...getCommonTestProviders(),
    // Add repository mocks
    ...repositories.map(repo => ({
      provide: getTestRepositoryToken(repo),
      useClass: MockRepository,
    })),
    // Add model mocks
    ...models.map(model => ({
      provide: getTestModelToken(model),
      useValue: MockModel,
    })),
  ];
  
  const module: TestingModule = await Test.createTestingModule({
    controllers,
    providers: testProviders,
    imports,
  }).compile();
  
  return module;
};
