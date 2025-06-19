import { Test, TestingModule } from '@nestjs/testing';
import { StatusService } from './status.service';
import StatusRepository from '../repositories/status.repository';
import { LoggerService } from '@src/shared/services/logger.service';
import { ProjectService } from './project.service';
import { RequerimentService } from './requeriment.service';
import { TaskService } from './task.service';
import { FeatureService } from './feature.service';

describe('StatusService', () => {
  let service: StatusService;

  const mockStatusRepository = {
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

  const mockTaskService = {
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
        StatusService,
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
        {
          provide: StatusRepository,
          useValue: mockStatusRepository,
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
          provide: TaskService,
          useValue: mockTaskService,
        },
        {
          provide: FeatureService,
          useValue: mockFeatureService,
        },
      ],
    }).compile();

    service = module.get<StatusService>(StatusService);
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
