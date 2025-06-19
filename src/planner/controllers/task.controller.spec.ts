import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from '@src/planner/services/task.service';
import { LoggerService } from '@src/shared/services/logger.service';
import { MockLoggerService } from '@src/test/test-utils';

describe('TaskController', () => {
  let controller: TaskController;
  let mockTaskService: jest.Mocked<TaskService>;
  let mockLoggerService: MockLoggerService;

  beforeEach(async () => {
    mockTaskService = {
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
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
