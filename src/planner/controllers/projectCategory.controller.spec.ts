import { Test, TestingModule } from '@nestjs/testing';
import { ProjectCategoryController } from './projectCategory.controller';
import { ProjectCategoryService } from '@src/planner/services/projectCategory.service';
import { LoggerService } from '@src/shared/services/logger.service';
import { MockLoggerService } from '@src/test/test-utils';

describe('ProjectCategoryController', () => {
  let controller: ProjectCategoryController;
  let mockProjectCategoryService: jest.Mocked<ProjectCategoryService>;
  let mockLoggerService: MockLoggerService;

  beforeEach(async () => {
    mockProjectCategoryService = {
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
      controllers: [ProjectCategoryController],
      providers: [
        {
          provide: ProjectCategoryService,
          useValue: mockProjectCategoryService,
        },        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    controller = module.get<ProjectCategoryController>(
      ProjectCategoryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
