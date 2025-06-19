import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ProjectService } from '@src/planner/services/project.service';
import { LoggerService } from '@src/shared/services/logger.service';
import { MockLoggerService } from '@src/test/test-utils';

describe('ProjectController', () => {
  let controller: ProjectController;
  let mockProjectService: jest.Mocked<ProjectService>;
  let mockLoggerService: MockLoggerService;

  beforeEach(async () => {
    mockProjectService = {
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
      controllers: [ProjectController],
      providers: [
        {
          provide: ProjectService,
          useValue: mockProjectService,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
