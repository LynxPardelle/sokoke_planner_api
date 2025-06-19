import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '@src/user/services/user.service';
import { LoggerService } from '@src/shared/services/logger.service';
import { MockLoggerService } from '@src/test/test-utils';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: jest.Mocked<UserService>;
  let mockLoggerService: MockLoggerService;

  beforeEach(async () => {
    mockUserService = {
      create: jest.fn(),
      read: jest.fn(),
      readAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      search: jest.fn(),
      author: jest.fn(() => ({
        author: 'Lynx Pardelle',
        site: 'https://lynxpardelle.com',
        github: 'https://github.com/LynxPardelle',
      })),
    } as any;

    mockLoggerService = new MockLoggerService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
