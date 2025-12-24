import { NutrientService } from '../NutrientService';
import { INutrientRepository } from '../../../domain/interfaces/INutrientRepository';
import { Nutrient, CreateNutrientInput, UpdateNutrientInput } from '../../../domain/types/Nutrient';

// モックリポジトリの作成
const createMockNutrientRepository = (): jest.Mocked<INutrientRepository> => ({
  findById: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findByName: jest.fn(),
  count: jest.fn(),
  findByParentId: jest.fn()
});

// テストヘルパー
const createTestNutrient = (overrides?: Partial<Nutrient>): Nutrient => ({
  id: '1',
  name: 'Test Nutrient',
  parentId: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides
});

describe('NutrientService', () => {
  let nutrientService: NutrientService;
  let mockRepo: jest.Mocked<INutrientRepository>;

  beforeEach(() => {
    mockRepo = createMockNutrientRepository();
    nutrientService = new NutrientService(mockRepo);
    jest.clearAllMocks();
  });

  describe('getNutrient', () => {
    it('should return nutrient when found', async () => {
      const mockNutrient = createTestNutrient({ id: '1', name: 'Protein' });
      mockRepo.findById.mockResolvedValue(mockNutrient);

      const result = await nutrientService.getNutrient('1');

      expect(result).toEqual(mockNutrient);
      expect(mockRepo.findById).toHaveBeenCalledWith('1');
    });

    it('should return null when nutrient not found', async () => {
      mockRepo.findById.mockResolvedValue(null);

      const result = await nutrientService.getNutrient('999');

      expect(result).toBeNull();
      expect(mockRepo.findById).toHaveBeenCalledWith('999');
    });
  });

  describe('getAllNutrients', () => {
    it('should return all nutrients', async () => {
      const mockNutrients = [
        createTestNutrient({ id: '1', name: 'Protein' }),
        createTestNutrient({ id: '2', name: 'Carbohydrate' })
      ];
      mockRepo.findAll.mockResolvedValue(mockNutrients);

      const result = await nutrientService.getAllNutrients();

      expect(result).toEqual(mockNutrients);
      expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('createNutrient', () => {
    it('should create nutrient successfully', async () => {
      const createInput: CreateNutrientInput = { name: 'New Nutrient' };
      const createdNutrient = createTestNutrient({ id: '2', name: 'New Nutrient' });
      mockRepo.create.mockResolvedValue(createdNutrient);

      const result = await nutrientService.createNutrient(createInput);

      expect(result).toEqual(createdNutrient);
      expect(mockRepo.create).toHaveBeenCalledWith(createInput);
    });

    it('should throw error when name is empty', async () => {
      const createInput: CreateNutrientInput = { name: '' };

      await expect(nutrientService.createNutrient(createInput))
        .rejects.toThrow('Nutrient name is required');
      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it('should throw error when name is only whitespace', async () => {
      const createInput: CreateNutrientInput = { name: '   ' };

      await expect(nutrientService.createNutrient(createInput))
        .rejects.toThrow('Nutrient name is required');
      expect(mockRepo.create).not.toHaveBeenCalled();
    });
  });

  describe('updateNutrient', () => {
    const existingNutrient = createTestNutrient({ id: '1', name: 'Old Nutrient' });

    beforeEach(() => {
      mockRepo.findById.mockResolvedValue(existingNutrient);
    });

    it('should update nutrient successfully', async () => {
      const updateInput: UpdateNutrientInput = { name: 'Updated Nutrient' };
      const updatedNutrient = { ...existingNutrient, name: 'Updated Nutrient' };
      mockRepo.update.mockResolvedValue(updatedNutrient);

      const result = await nutrientService.updateNutrient('1', updateInput);

      expect(result).toEqual(updatedNutrient);
      expect(mockRepo.update).toHaveBeenCalledWith('1', updateInput);
    });

    it('should throw error when nutrient not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      const updateInput: UpdateNutrientInput = { name: 'Updated Nutrient' };

      await expect(nutrientService.updateNutrient('999', updateInput))
        .rejects.toThrow('Nutrient with id 999 not found');
      expect(mockRepo.update).not.toHaveBeenCalled();
    });

    // it('should throw error when new name is empty', async () => {
    //   const updateInput: UpdateNutrientInput = { name: '' };

    //   await expect(nutrientService.updateNutrient('1', updateInput))
    //     .rejects.toThrow('Nutrient name cannot be empty');
    //   expect(mockRepo.update).not.toHaveBeenCalled();
    // });
  });

  describe('deleteNutrient', () => {
    const existingNutrient = createTestNutrient({ id: '1', name: 'Nutrient to delete' });

    it('should delete nutrient successfully', async () => {
      mockRepo.findById.mockResolvedValue(existingNutrient);
      mockRepo.delete.mockResolvedValue(true);

      const result = await nutrientService.deleteNutrient('1');

      expect(result).toBe(true);
      expect(mockRepo.findById).toHaveBeenCalledWith('1');
      expect(mockRepo.delete).toHaveBeenCalledWith('1');
    });

    it('should throw error when nutrient not found', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(nutrientService.deleteNutrient('999'))
        .rejects.toThrow('Nutrient with id 999 not found');
      expect(mockRepo.delete).not.toHaveBeenCalled();
    });
  });

  describe('searchNutrientsByName', () => {
    it('should search nutrients by name', async () => {
      const mockNutrients = [
        createTestNutrient({ id: '1', name: 'Vitamin A' }),
        createTestNutrient({ id: '2', name: 'Vitamin B' })
      ];
      mockRepo.findByName.mockResolvedValue(mockNutrients);

      const result = await nutrientService.searchNutrientsByName('Vitamin');

      expect(result).toEqual(mockNutrients);
      expect(mockRepo.findByName).toHaveBeenCalledWith('Vitamin');
    });

    it('should return all nutrients when search term is empty', async () => {
      const mockNutrients = [
        createTestNutrient({ id: '1', name: 'Nutrient 1' }),
        createTestNutrient({ id: '2', name: 'Nutrient 2' })
      ];
      mockRepo.findAll.mockResolvedValue(mockNutrients);

      const result = await nutrientService.searchNutrientsByName('');

      expect(result).toEqual(mockNutrients);
      expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
      expect(mockRepo.findByName).not.toHaveBeenCalled();
    });
  });

  describe('getNutrientsByParent', () => {
    it('should return nutrients by parent ID', async () => {
      const mockNutrients = [
        createTestNutrient({ id: '2', name: 'Child Nutrient 1', parentId: '1' }),
        createTestNutrient({ id: '3', name: 'Child Nutrient 2', parentId: '1' })
      ];
      mockRepo.findByParentId.mockResolvedValue(mockNutrients);

      const result = await nutrientService.getNutrientsByParent('1');

      expect(result).toEqual(mockNutrients);
      expect(mockRepo.findByParentId).toHaveBeenCalledWith('1');
    });
  });

  describe('getNutrientsCount', () => {
    it('should return nutrient count', async () => {
      mockRepo.count.mockResolvedValue(5);

      const result = await nutrientService.getNutrientsCount();

      expect(result).toBe(5);
      expect(mockRepo.count).toHaveBeenCalledTimes(1);
    });
  });
});
