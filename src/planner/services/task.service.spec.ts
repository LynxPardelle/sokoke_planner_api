import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import TaskRepository from '../repositories/task.repository';
import { LoggerService } from '@src/shared/services/logger.service';
import { EmailService } from '@src/shared/services/email.service';
import { UserService } from '@src/user/services/user.service';
import { ProjectService } from './project.service';
import { RequerimentService } from './requeriment.service';
import { FeatureService } from './feature.service';

describe('TaskService', () => {
  let service: TaskService;

  const mockTaskRepository = {
    create: jest.fn(),
    readAll: jest.fn(),
    read: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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
  };

  const mockUserService = {
    create: jest.fn(),
    readAll: jest.fn(),
    read: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOneByEmail: jest.fn(),
  };

  const mockProjectService = {
    create: jest.fn(),
    readAll: jest.fn(),
    read: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    author: jest.fn(),
  };

  const mockRequerimentService = {
    create: jest.fn(),
    readAll: jest.fn(),
    read: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    author: jest.fn(),
  };

  const mockFeatureService = {
    create: jest.fn(),
    readAll: jest.fn(),
    read: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    author: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: TaskRepository,
          useValue: mockTaskRepository,
        },
        {
          provide: ProjectService,
          useValue: mockProjectService,
        },
        {
          provide: RequerimentService,
          useValue: mockRequerimentService,
        },
        {
          provide: FeatureService,
          useValue: mockFeatureService,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('author', () => {
    it('should return author information', () => {
      const result = service.author();
      expect(result).toEqual({
        author: 'Lynx Pardelle',
        site: 'https://lynxpardelle.com',
        github: 'https://github.com/LynxPardelle',
      });
    });
  });
});
