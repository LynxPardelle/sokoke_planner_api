import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { createMockUserRepository, createMockPasswordService } from '@src/test/test-utils';
import UserRepository from '@src/user/repositories/user.repository';
import { PasswordService } from '@src/shared/services/password.service';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockPasswordService: jest.Mocked<PasswordService>;

  beforeEach(async () => {
    mockUserRepository = createMockUserRepository();
    mockPasswordService = createMockPasswordService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
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
    it('should hash password and create user with verification token', async () => {
      const userData = { email: 'test@example.com', password: 'password123' };
      const hashedPassword = 'hashedPassword123';
      const verificationToken = 'verifyToken123';
      const expectedResponse = { status: 'success', data: { id: '1', ...userData } };

      mockPasswordService.hashPassword.mockResolvedValue(hashedPassword);
      mockPasswordService.generateVerificationToken.mockReturnValue(verificationToken);
      mockUserRepository.create.mockResolvedValue(expectedResponse as any);

      const result = await service.create(userData);

      expect(mockPasswordService.hashPassword).toHaveBeenCalledWith('password123');
      expect(mockPasswordService.generateVerificationToken).toHaveBeenCalled();
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword,
        verifyToken: verificationToken,
      });
      expect(result).toEqual(expectedResponse);    });
  });  describe('read operations', () => {
    it('should read a user by ID', async () => {
      const userId = 'user123';
      const userData = { _id: userId, email: 'test@test.com', name: 'John' };
      const expectedResponse = { 
        status: 'success' as const, 
        message: 'User retrieved successfully',
        data: userData 
      };

      mockUserRepository.read.mockResolvedValue(expectedResponse as any);

      const result = await service.read(userId);

      expect(mockUserRepository.read).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResponse);
    });

    it('should read all users', async () => {
      const usersData = [
        { _id: 'user1', email: 'test1@test.com', name: 'John' },
        { _id: 'user2', email: 'test2@test.com', name: 'Jane' },
      ];
      const expectedResponse = { 
        status: 'success' as const, 
        message: 'Users retrieved successfully',
        data: usersData 
      };

      mockUserRepository.readAll.mockResolvedValue(expectedResponse as any);

      const result = await service.readAll();

      expect(mockUserRepository.readAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('update operations', () => {
    it('should update a user', async () => {
      const updateData: any = {
        _id: 'user123',
        name: 'Updated Name',
        email: 'updated@test.com',
        lastName: 'Doe',
        username: 'updateduser',
        password: 'password123',
        verifyToken: 'token123',
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const expectedResponse = { 
        status: 'success' as const, 
        message: 'User updated successfully',
        data: updateData 
      };

      mockUserRepository.update.mockResolvedValue(expectedResponse as any);

      const result = await service.update(updateData);

      expect(mockUserRepository.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('delete operations', () => {
    it('should delete a user', async () => {
      const userId = 'user123';
      const deletedUser = { _id: userId, email: 'deleted@test.com', name: 'Deleted User' };
      const expectedResponse = { 
        status: 'success' as const, 
        message: 'User deleted successfully',
        data: deletedUser 
      };

      mockUserRepository.delete.mockResolvedValue(expectedResponse as any);

      const result = await service.delete(userId);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('password operations', () => {
    it('should verify password', async () => {
      mockPasswordService.verifyPassword.mockResolvedValue(true);

      const result = await service.verifyPassword('plain', 'hashed');

      expect(mockPasswordService.verifyPassword).toHaveBeenCalledWith('plain', 'hashed');
      expect(result).toBe(true);
    });

    it('should generate verification token', () => {
      const token = 'newToken123';
      mockPasswordService.generateVerificationToken.mockReturnValue(token);

      const result = service.generateNewVerificationToken();

      expect(mockPasswordService.generateVerificationToken).toHaveBeenCalled();
      expect(result).toBe(token);
    });

    it('should validate password strength', () => {
      const validation = { isValid: true, errors: [] };
      mockPasswordService.validatePasswordStrength.mockReturnValue(validation);

      const result = service.validatePasswordStrength('strongPassword123!');

      expect(mockPasswordService.validatePasswordStrength).toHaveBeenCalledWith('strongPassword123!');
      expect(result).toEqual(validation);
    });
  });
});
