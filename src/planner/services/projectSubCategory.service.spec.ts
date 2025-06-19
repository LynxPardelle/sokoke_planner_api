import { Test, TestingModule } from '@nestjs/testing';
import { ProjectSubCategoryService } from './projectSubCategory.service';
import ProjectSubCategoryRepository from '../repositories/projectSubCategory.repository';
import { LoggerService } from '@src/shared/services/logger.service';
import { ProjectCategoryService } from './projectCategory.service';

describe('ProjectSubCategoryService', () => {
  let service: ProjectSubCategoryService;

  const mockProjectSubCategoryRepository = {
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

  const mockProjectCategoryService = {
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
        ProjectSubCategoryService,
        {
          provide: ProjectSubCategoryRepository,
          useValue: mockProjectSubCategoryRepository,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
        {
          provide: ProjectCategoryService,
          useValue: mockProjectCategoryService,
        },
      ],
    }).compile();

    service = module.get<ProjectSubCategoryService>(ProjectSubCategoryService);
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
