import { Test, TestingModule } from '@nestjs/testing';
import { ProjectCategoryService } from './projectCategory.service';
import ProjectCategoryRepository from '../repositories/projectCategory.repository';
import { LoggerService } from '@src/shared/services/logger.service';

describe('ProjectCategoryService', () => {
  let service: ProjectCategoryService;

  const mockProjectCategoryRepository = {
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectCategoryService,
        {
          provide: ProjectCategoryRepository,
          useValue: mockProjectCategoryRepository,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    service = module.get<ProjectCategoryService>(ProjectCategoryService);
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
