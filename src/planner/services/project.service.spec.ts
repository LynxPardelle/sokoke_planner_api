import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ProjectService } from './project.service';
import { 
  createMockProjectRepository,
  createMockProjectCategoryRepository,
  createMockProjectSubCategoryRepository,
  MockLoggerService,
  MockEmailService,
  MockUserService,
  MockConfigService
} from '@src/test/test-utils';
import ProjectRepository from '@src/planner/repositories/project.repository';
import ProjectCategoryRepository from '@src/planner/repositories/projectCategory.repository';
import ProjectSubCategoryRepository from '@src/planner/repositories/projectSubCategory.repository';
import { LoggerService } from '@src/shared/services/logger.service';
import { EmailService } from '@src/shared/services/email.service';
import { UserService } from '@src/user/services/user.service';

describe('ProjectService', () => {
  let service: ProjectService;
  let mockProjectRepository: any;  let mockProjectCategoryRepository: any;
  let mockProjectSubCategoryRepository: any;
  let mockLoggerService: MockLoggerService;
  let mockEmailService: MockEmailService;
  let mockUserService: MockUserService;
  let mockConfigService: MockConfigService;

  beforeEach(async () => {    mockProjectRepository = createMockProjectRepository();
    mockProjectCategoryRepository = createMockProjectCategoryRepository();
    mockProjectSubCategoryRepository = createMockProjectSubCategoryRepository();
    mockLoggerService = new MockLoggerService();
    mockEmailService = new MockEmailService();
    mockUserService = new MockUserService();
    mockConfigService = new MockConfigService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: ProjectRepository,
          useValue: mockProjectRepository,
        },
        {
          provide: ProjectCategoryRepository,
          useValue: mockProjectCategoryRepository,
        },
        {
          provide: ProjectSubCategoryRepository,
          useValue: mockProjectSubCategoryRepository,
        },        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return author information', () => {
    const authorInfo = service.author();
    expect(authorInfo).toEqual({
      author: 'Lynx Pardelle',
      site: 'https://lynxpardelle.com',
      github: 'https://github.com/LynxPardelle',
    });
  });
  describe('create', () => {
    it('should create a project successfully', async () => {
      const createData: any = {
        name: 'Test Project',
        description: 'A test project',
        category: 'cat1',
        subCategory: 'subcat1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        owners: [],
        features: [],
        requeriments: [],
        approximateTimeProjection: 100,
        priority: 'medium',
        status: 'active',
        tags: [],
        archived: false,
        permissions: [],
        color: '#ffffff',
        backgroundColor: '#000000',
        primaryTextColor: '#000000',
        secondaryTextColor: '#666666',
      };

      const expectedResult = {
        status: 'success' as const,
        message: 'Project created successfully',
        data: {
          _id: 'project1',
          name: 'Test Project',
          description: 'A test project',
        },
      };

      mockProjectRepository.create.mockResolvedValue(expectedResult);

      const result = await service.create(createData);

      expect(mockProjectRepository.create).toHaveBeenCalledWith(createData);
      expect(result).toEqual(expectedResult);
      expect(mockLoggerService.info).toHaveBeenCalledWith(
        `Creating project: ${JSON.stringify(createData)}`,
        'ProjectService.create',
      );
    });

    it('should send email notifications when project is created with owners', async () => {
      const createData: any = {
        name: 'Test Project',
        description: 'A test project',
        owners: ['user1', 'user2'],
        category: 'cat1',
        subCategory: 'subcat1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        features: [],
        requeriments: [],
        approximateTimeProjection: 100,
        priority: 'medium',
        status: 'active',
        tags: [],
        archived: false,
        permissions: [],
        color: '#ffffff',
        backgroundColor: '#000000',
        primaryTextColor: '#000000',
        secondaryTextColor: '#666666',
      };

      const createdProject = {
        _id: 'project1',
        name: 'Test Project',
        description: 'A test project',
      };

      const mockResult = {
        status: 'success' as const,
        message: 'Project created successfully',
        data: createdProject,
      };

      const mockUser = {
        _id: 'user1',
        email: 'user1@test.com',
        name: 'John',
        lastName: 'Doe',
      };

      mockProjectRepository.create.mockResolvedValue(mockResult);
      mockUserService.read.mockResolvedValue({
        status: 'success',
        data: mockUser,
      });
      mockConfigService.get.mockReturnValue('http://localhost:3001');

      await service.create(createData);

      expect(mockUserService.read).toHaveBeenCalledWith('user1');
      expect(mockEmailService.sendProjectAssignmentNotification).toHaveBeenCalled();
    });

    it('should handle email notification errors gracefully', async () => {
      const createData: any = {
        name: 'Test Project',
        owners: ['user1'],
        description: 'A test project',
        category: 'cat1',
        subCategory: 'subcat1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        features: [],
        requeriments: [],
        approximateTimeProjection: 100,
        priority: 'medium',
        status: 'active',
        tags: [],
        archived: false,
        permissions: [],
        color: '#ffffff',
        backgroundColor: '#000000',
        primaryTextColor: '#000000',
        secondaryTextColor: '#666666',
      };

      const mockResult = {
        status: 'success' as const,
        data: { _id: 'project1', name: 'Test Project' },
      };

      mockProjectRepository.create.mockResolvedValue(mockResult);
      mockUserService.read.mockRejectedValue(new Error('User not found'));

      await service.create(createData);

      expect(mockLoggerService.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to send project assignment notification'),
        'ProjectService.notifyProjectAssignment',
      );
    });
  });

  describe('read', () => {
    it('should retrieve a project by ID', async () => {
      const projectId = 'project1';
      const expectedResult = {
        status: 'success' as const,
        data: {
          _id: 'project1',
          name: 'Test Project',
        },
      };

      mockProjectRepository.read.mockResolvedValue(expectedResult);

      const result = await service.read(projectId);

      expect(mockProjectRepository.read).toHaveBeenCalledWith(projectId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('readAll', () => {
    it('should retrieve all projects', async () => {
      const expectedResult = {
        status: 'success' as const,
        data: [
          { _id: 'project1', name: 'Project 1' },
          { _id: 'project2', name: 'Project 2' },
        ],
      };

      mockProjectRepository.readAll.mockResolvedValue(expectedResult);

      const result = await service.readAll();

      expect(mockProjectRepository.readAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });
  describe('update', () => {
    it('should update a project successfully', async () => {
      const updateData: any = {
        _id: 'project1',
        name: 'Updated Project',
        description: 'Updated description',
      };

      const expectedResult = {
        status: 'success' as const,
        data: {
          _id: 'project1',
          name: 'Updated Project',
          description: 'Updated description',
        },
      };

      // Mock the read call that happens in update method
      mockProjectRepository.read.mockResolvedValue({
        status: 'success',
        data: { _id: 'project1', owners: [] },
      });
      mockProjectRepository.update.mockResolvedValue(expectedResult);

      const result = await service.update(updateData);

      expect(mockProjectRepository.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('delete', () => {
    it('should delete a project successfully', async () => {
      const projectId = 'project1';
      const expectedResult = {
        status: 'success' as const,
        message: 'Project deleted successfully',
      };

      mockProjectRepository.delete.mockResolvedValue(expectedResult);

      const result = await service.delete(projectId);

      expect(mockProjectRepository.delete).toHaveBeenCalledWith(projectId);
      expect(result).toEqual(expectedResult);
    });
  });  describe('readAll', () => {
    it('should retrieve all projects with search parameters', async () => {
      const searchParams = {
        search: {
          query: 'test',
          fields: ['name' as const, 'description' as const],
        },
        filters: { category: 'web' },
      };

      const expectedResult = {
        status: 'success' as const,
        data: [
          { _id: 'project1', name: 'Test Project' },
        ],
      };

      mockProjectRepository.readAll.mockResolvedValue(expectedResult);

      const result = await service.readAll(searchParams);

      expect(mockProjectRepository.readAll).toHaveBeenCalledWith(searchParams);
      expect(result).toEqual(expectedResult);
    });

    it('should retrieve all projects without search parameters', async () => {
      const expectedResult = {
        status: 'success' as const,
        data: [
          { _id: 'project1', name: 'Project 1' },
          { _id: 'project2', name: 'Project 2' },
        ],
      };

      mockProjectRepository.readAll.mockResolvedValue(expectedResult);

      const result = await service.readAll();

      expect(mockProjectRepository.readAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(expectedResult);
    });
  });
});
