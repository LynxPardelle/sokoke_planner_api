import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from '../services/app.service';
import { LoggerService } from '@src/shared/services/logger.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let loggerService: LoggerService;

  const mockLoggerService = {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    http: jest.fn(),
    fatal: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
    loggerService = app.get<LoggerService>(LoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const result = appController.getHello();
      expect(result).toBe('Hello World from NestJS, this API was created by Lynx Pardelle!');
    });
  });

  describe('author', () => {
    it('should return author information', () => {
      const result = appController.author();
      expect(result).toEqual({
        author: 'Lynx Pardelle',
        site: 'https://lynxpardelle.com',
        github: 'https://github.com/LynxPardelle',
      });
      expect(loggerService.info).toHaveBeenCalledWith('LogController.author');
    });
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });
});
