import { Test, TestingModule } from '@nestjs/testing';
import { ProjectSubCategoryController } from './projectSubCategory.controller';
import { ProjectSubCategoryService } from '@src/planner/services/projectSubCategory.service';
import { LoggerService } from '@src/shared/services/logger.service';
import { MockLoggerService } from '@src/test/test-utils';

describe('ProjectSubCategoryController', () => {
  let controller: ProjectSubCategoryController;
  let mockProjectSubCategoryService: jest.Mocked<ProjectSubCategoryService>;
  let mockLoggerService: MockLoggerService;

  beforeEach(async () => {
    mockProjectSubCategoryService = {
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
      controllers: [ProjectSubCategoryController],
      providers: [
        {
          provide: ProjectSubCategoryService,
          useValue: mockProjectSubCategoryService,
        },        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    controller = module.get<ProjectSubCategoryController>(
      ProjectSubCategoryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
