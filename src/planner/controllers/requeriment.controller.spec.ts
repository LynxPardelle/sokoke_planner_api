import { Test, TestingModule } from '@nestjs/testing';
import { RequerimentController } from './requeriment.controller';
import { RequerimentService } from '@src/planner/services/requeriment.service';
import { LoggerService } from '@src/shared/services/logger.service';
import { MockLoggerService } from '@src/test/test-utils';

describe('RequerimentController', () => {
  let controller: RequerimentController;
  let mockRequerimentService: jest.Mocked<RequerimentService>;
  let mockLoggerService: MockLoggerService;

  beforeEach(async () => {
    mockRequerimentService = {
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
      controllers: [RequerimentController],
      providers: [
        {
          provide: RequerimentService,
          useValue: mockRequerimentService,
        },        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    controller = module.get<RequerimentController>(RequerimentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
