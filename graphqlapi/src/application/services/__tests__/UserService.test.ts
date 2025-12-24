import { UserService } from '../UserService';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { User, CreateUserInput } from '../../../domain/types/User';

// モックリポジトリの作成
const createMockUserRepository = (): jest.Mocked<IUserRepository> => ({
  findByEmail: jest.fn(),
  findByCognitoSub: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  save: jest.fn(),
});

// テストヘルパー
const createTestUser = (overrides?: Partial<User>): User => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  cognitoSub: "",
  isAdmin: false,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

describe('UserService', () => {
  let userService: UserService;
  let mockRepo: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockRepo = createMockUserRepository();
    userService = new UserService(mockRepo);
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const userData: CreateUserInput = {
        email: 'test@example.com',
        name: 'Test User',
        cognitoSub: "",
      };
      const createdUser = createTestUser(userData);
      mockRepo.create.mockResolvedValue(createdUser);

      const result = await userService.createUser('test@example.com', 'Test User');

      expect(result).toEqual(createdUser);
      expect(mockRepo.create).toHaveBeenCalledWith(userData);
    });

    it('should create user with null cognitoSub', async () => {
      const userData: CreateUserInput = {
        email: 'test@example.com',
        name: 'Test User',
        cognitoSub: "",
      };
      const createdUser = createTestUser(userData);
      mockRepo.create.mockResolvedValue(createdUser);

      const result = await userService.createUser('test@example.com', 'Test User');

      expect(result.cognitoSub).toEqual("");
      expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        cognitoSub: ""
      }));
    });
  });

  describe('updateCognitoSub', () => {
    it('should update cognito sub when user exists and cognitoSub is null', async () => {
      const existingUser = createTestUser({ 
        id: '1', 
        email: 'test@example.com',
        cognitoSub: ""
      });
      const updatedUser = { 
        ...existingUser, 
        cognitoSub: 'new-sub-123' 
      };

      mockRepo.findByEmail.mockResolvedValue(existingUser);
      mockRepo.update.mockResolvedValue(updatedUser);

      const result = await userService.updateCognitoSub('test@example.com', 'new-sub-123');

      expect(result).toEqual(updatedUser);
      expect(mockRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockRepo.update).toHaveBeenCalledWith('1', { 
        cognitoSub: 'new-sub-123' 
      });
    });

    it('should not update when cognito sub already exists', async () => {
      const existingUser = createTestUser({ 
        id: '1', 
        email: 'test@example.com',
        cognitoSub: 'existing-sub' 
      });

      mockRepo.findByEmail.mockResolvedValue(existingUser);

      const result = await userService.updateCognitoSub('test@example.com', 'new-sub-123');

      expect(result).toEqual(existingUser);
      expect(mockRepo.update).not.toHaveBeenCalled();
    });

    it('should return null when user not found', async () => {
      mockRepo.findByEmail.mockResolvedValue(null);

      const result = await userService.updateCognitoSub('notfound@example.com', 'new-sub-123');

      expect(result).toBeNull();
      expect(mockRepo.update).not.toHaveBeenCalled();
    });
  });

  describe('syncUserByCognitoSub', () => {
    it('should create new user when not found by cognito sub', async () => {
      mockRepo.findByCognitoSub.mockResolvedValue(null);
      const newUser = createTestUser({
        id: '2',
        email: 'new@example.com',
        name: 'New User',
        cognitoSub: 'cognito-sub-123'
      });
      mockRepo.create.mockResolvedValue(newUser);

      const result = await userService.syncUserByCognitoSub(
        'cognito-sub-123',
        'new@example.com',
        'New User'
      );

      expect(result).toEqual(newUser);
      expect(mockRepo.findByCognitoSub).toHaveBeenCalledWith('cognito-sub-123');
      expect(mockRepo.create).toHaveBeenCalledWith({
        email: 'new@example.com',
        name: 'New User',
        cognitoSub: 'cognito-sub-123'
      });
    });

    it('should update user name when found by cognito sub', async () => {
      const existingUser = createTestUser({
        id: '1',
        email: 'existing@example.com',
        name: 'Old Name',
        cognitoSub: 'cognito-sub-123'
      });
      const updatedUser = { ...existingUser, name: 'New Name' };

      mockRepo.findByCognitoSub.mockResolvedValue(existingUser);
      mockRepo.update.mockResolvedValue(updatedUser);

      const result = await userService.syncUserByCognitoSub(
        'cognito-sub-123',
        'existing@example.com',
        'New Name'
      );

      expect(result).toEqual(updatedUser);
      expect(mockRepo.findByCognitoSub).toHaveBeenCalledWith('cognito-sub-123');
      expect(mockRepo.update).toHaveBeenCalledWith('1', { name: 'New Name' });
    });
  });

  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      const user = createTestUser({ email: 'test@example.com' });
      mockRepo.findByEmail.mockResolvedValue(user);

      const result = await userService.findByEmail('test@example.com');

      expect(result).toEqual(user);
      expect(mockRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should return null when user not found', async () => {
      mockRepo.findByEmail.mockResolvedValue(null);

      const result = await userService.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });
});
