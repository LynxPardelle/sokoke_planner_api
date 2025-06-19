import { Test, TestingModule } from '@nestjs/testing';
import { RequerimentService } from './requeriment.service';
import RequerimentRepository from '../repositories/requeriment.repository';
import { LoggerService } from '@src/shared/services/logger.service';
import { ProjectService } from './project.service';

describe('RequerimentService', () => {
  let service: RequerimentService;

  const mockRequerimentRepository = {
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequerimentService,
        {
          provide: RequerimentRepository,
          useValue: mockRequerimentRepository,
        },
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
        {
          provide: ProjectService,
          useValue: mockProjectService,
        },
      ],
    }).compile();

    service = module.get<RequerimentService>(RequerimentService);
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
