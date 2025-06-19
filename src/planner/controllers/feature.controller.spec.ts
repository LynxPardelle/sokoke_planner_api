import { Test, TestingModule } from '@nestjs/testing';
import { FeatureController } from './feature.controller';
import { FeatureService } from '@src/planner/services/feature.service';
import { LoggerService } from '@src/shared/services/logger.service';
import { MockLoggerService } from '@src/test/test-utils';

describe('FeatureController', () => {
  let controller: FeatureController;
  let mockFeatureService: jest.Mocked<FeatureService>;
  let mockLoggerService: MockLoggerService;

  beforeEach(async () => {
    mockFeatureService = {
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
      controllers: [FeatureController],
      providers: [
        {
          provide: FeatureService,
          useValue: mockFeatureService,
        },        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    controller = module.get<FeatureController>(FeatureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
