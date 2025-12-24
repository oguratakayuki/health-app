import { IngredientService } from '../IngredientService';
import { IIngredientRepository } from '../../../domain/interfaces/IIngredientRepository';
import { CreateIngredientData } from '../../../domain/interfaces/IIngredientService';
import { Ingredient, IngredientWithRelations } from '../../../domain/types/Ingredient';
import { Nutrient } from '../../../domain/types/Nutrient';
import { Dish } from '../../../domain/types/Dish';
import { IngredientNutrient } from '../../../domain/types/IngredientNutrient';

// テスト用ヘルパー関数
function createMockIngredientRepository(): jest.Mocked<IIngredientRepository> {
  return {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByName: jest.fn(),
    count: jest.fn()
  };
}

// テストデータヘルパー関数
function createTestIngredient(overrides?: Partial<Ingredient>): Ingredient {
  return {
    id: '1', // string型のID
    name: 'Test Ingredient',
    remarks: 'Test remarks',
    originalName: 'テスト食材',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides
  };
}

function createTestIngredientWithRelations(
  overrides?: Partial<IngredientWithRelations>
): IngredientWithRelations {
  return {
    id: '1', // string型のID
    name: 'Test Ingredient',
    remarks: 'Test remarks',
    originalName: 'テスト食材',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    nutrients: [],
    dishes: [],
    ingredientNutrients: [],
    ...overrides
  };
}

describe('IngredientService', () => {
  let ingredientService: IngredientService;
  let mockRepo: jest.Mocked<IIngredientRepository>;

  beforeEach(() => {
    mockRepo = createMockIngredientRepository();
    ingredientService = new IngredientService(mockRepo);
  });

  describe('getAllIngredients', () => {
    it('should return all ingredients with relations', async () => {
      // 準備
      const mockIngredients: IngredientWithRelations[] = [
        createTestIngredientWithRelations({
          id: '1',
          name: 'Chicken',
          remarks: 'Fresh chicken',
          originalName: '鶏肉',
          nutrients: [
            {
              id: '101',
              name: 'Protein',
              parentId: null,
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            }
          ],
          dishes: [
            {
              id: '201',
              name: 'Chicken Curry',
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01')
            }
          ],
          ingredientNutrients: [
            {
              id: BigInt(301),
              ingredientId: BigInt(1),
              nutrientId: BigInt(1),
              contentQuantity: 25,
              contentUnit: 'g',
              contentUnitPer: 100,
              contentUnitPerUnit: 'g',
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01')
            }
          ]
        })
      ];

      mockRepo.findAll.mockResolvedValue(mockIngredients);

      // 実行
      const result = await ingredientService.getAllIngredients();

      // 検証
      expect(result).toEqual(mockIngredients);
      expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no ingredients exist', async () => {
      // 準備
      mockRepo.findAll.mockResolvedValue([]);

      // 実行
      const result = await ingredientService.getAllIngredients();

      // 検証
      expect(result).toEqual([]);
      expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw error when repository fails', async () => {
      // 準備
      const error = new Error('Database connection failed');
      mockRepo.findAll.mockRejectedValue(error);

      // 実行 & 検証
      await expect(ingredientService.getAllIngredients()).rejects.toThrow(
        'Database connection failed'
      );
    });
  });

  describe('getIngredientById', () => {
    it('should return ingredient when found', async () => {
      // 準備
      const mockIngredient = createTestIngredientWithRelations({
        id: '1',
        name: 'Chicken'
      });

      mockRepo.findById.mockResolvedValue(mockIngredient);

      // 実行
      const result = await ingredientService.getIngredientById(BigInt(1));

      // 検証
      expect(result).toEqual(mockIngredient);
      expect(mockRepo.findById).toHaveBeenCalledWith(BigInt(1));
    });

    it('should return null when ingredient not found', async () => {
      // 準備
      mockRepo.findById.mockResolvedValue(null);

      // 実行
      const result = await ingredientService.getIngredientById(BigInt(999));

      // 検証
      expect(result).toBeNull();
      expect(mockRepo.findById).toHaveBeenCalledWith(BigInt(999));
    });
  });

  describe('createIngredient', () => {
    it('should create ingredient successfully', async () => {
      // 準備
      const createData: CreateIngredientData = {
        name: 'Beef',
        remarks: 'Japanese beef',
        originalName: '牛肉'
      };

      const createdIngredient = createTestIngredient({
        id: '2',
        name: 'Beef',
        remarks: 'Japanese beef',
        originalName: '牛肉'
      });

      mockRepo.create.mockResolvedValue(createdIngredient);

      // 実行
      const result = await ingredientService.createIngredient(createData);

      // 検証
      expect(result).toEqual(createdIngredient);
      expect(mockRepo.create).toHaveBeenCalledWith({
        name: 'Beef',
        remarks: 'Japanese beef',
        originalName: '牛肉'
      });
    });

    it('should create ingredient with null values for optional fields', async () => {
      // 準備
      const createData: CreateIngredientData = {
        name: 'Fish'
        // remarksとoriginalNameはundefined
      };

      const createdIngredient = createTestIngredient({
        id: '3',
        name: 'Fish',
        remarks: null,
        originalName: null
      });

      mockRepo.create.mockResolvedValue(createdIngredient);

      // 実行
      const result = await ingredientService.createIngredient(createData);

      // 検証
      expect(result).toEqual(createdIngredient);
      expect(mockRepo.create).toHaveBeenCalledWith({
        name: 'Fish',
        remarks: null,
        originalName: null
      });
    });

    it('should handle empty strings by converting to null', async () => {
      // 準備
      const createData: CreateIngredientData = {
        name: 'Pork',
        remarks: '', // 空文字
        originalName: '' // 空文字
      };

      const createdIngredient = createTestIngredient({
        id: '4',
        name: 'Pork',
        remarks: null,
        originalName: null
      });

      mockRepo.create.mockResolvedValue(createdIngredient);

      // 実行
      const result = await ingredientService.createIngredient(createData);

      // 検証
      expect(result).toEqual(createdIngredient);
      expect(mockRepo.create).toHaveBeenCalledWith({
        name: 'Pork',
        remarks: null,
        originalName: null
      });
    });

    it('should throw error when name is empty', async () => {
      // 準備
      const createData: CreateIngredientData = {
        name: '',
        remarks: 'Test remarks'
      };

      // 実行 & 検証
      await expect(ingredientService.createIngredient(createData))
        .rejects.toThrow('Ingredient name is required');
      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it('should throw error when name is only whitespace', async () => {
      // 準備
      const createData: CreateIngredientData = {
        name: '   ',
        remarks: 'Test remarks'
      };

      await expect(ingredientService.createIngredient(createData))
        .rejects.toThrow('Ingredient name is required');
      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    // it('should throw error when name exceeds length limit', async () => {
    //   const longName = 'a'.repeat(101);
    //   const createData: CreateIngredientData = {
    //     name: longName,
    //     remarks: 'Test remarks'
    //   };

    //   await expect(ingredientService.createIngredient(createData))
    //     .rejects.toThrow('Ingredient name cannot exceed 100 characters');
    //   expect(mockRepo.create).not.toHaveBeenCalled();
    // });
  });

  describe('updateIngredient', () => {
    const existingIngredient = createTestIngredient({
      id: '1',
      name: 'Old Ingredient',
      remarks: 'Old remarks',
      originalName: '古い食材'
    });

    beforeEach(() => {
      // 各テスト前にリポジトリの状態を模擬
      mockRepo.findById.mockResolvedValue(createTestIngredientWithRelations(existingIngredient));
    });

    it('should update ingredient successfully', async () => {
      // 準備
      const updateData: Partial<Ingredient> = {
        name: 'Updated Ingredient',
        remarks: 'Updated remarks'
      };

      const updatedIngredient = {
        ...existingIngredient,
        name: 'Updated Ingredient',
        remarks: 'Updated remarks',
        updatedAt: new Date('2024-01-02')
      };

      mockRepo.update.mockResolvedValue(updatedIngredient);

      // 実行
      const result = await ingredientService.updateIngredient(BigInt(1), updateData);

      // 検証
      expect(result).toEqual(updatedIngredient);
      expect(mockRepo.update).toHaveBeenCalledWith(BigInt(1), updateData);
    });

    it('should handle partial updates', async () => {
      // 準備
      const updateData: Partial<Ingredient> = {
        name: 'Partially Updated'
        // remarksとoriginalNameは更新しない
      };

      const updatedIngredient = {
        ...existingIngredient,
        name: 'Partially Updated',
        updatedAt: new Date('2024-01-02')
      };

      mockRepo.update.mockResolvedValue(updatedIngredient);

      // 実行
      const result = await ingredientService.updateIngredient(BigInt(1), updateData);

      // 検証
      expect(result).toEqual(updatedIngredient);
      expect(mockRepo.update).toHaveBeenCalledWith(BigInt(1), updateData);
    });

    it('should throw error when new name is empty', async () => {
      // 準備
      const updateData: Partial<Ingredient> = {
        name: ''
      };

      // 実行 & 検証
      await expect(ingredientService.updateIngredient(BigInt(1), updateData))
        .rejects.toThrow('Ingredient name cannot be empty');
      expect(mockRepo.update).not.toHaveBeenCalled();
    });

    it('should trim whitespace from name', async () => {
      // 準備
      const updateData: Partial<Ingredient> = {
        name: '  New Ingredient  ',
        remarks: '  Updated remarks  '
      };

      const updatedIngredient = {
        ...existingIngredient,
        name: 'New Ingredient',
        remarks: 'Updated remarks',
        updatedAt: new Date('2024-01-02')
      };

      mockRepo.update.mockResolvedValue(updatedIngredient);

      // 実行
      const result = await ingredientService.updateIngredient(BigInt(1), updateData);

      // 検証
      expect(result.name).toBe('New Ingredient');
      expect(result.remarks).toBe('Updated remarks');
      expect(mockRepo.update).toHaveBeenCalledWith(BigInt(1), {
        name: 'New Ingredient',
        remarks: 'Updated remarks'
      });
    });
  });

  describe('deleteIngredient', () => {
    it('should delete ingredient successfully', async () => {
      // 準備
      mockRepo.delete.mockResolvedValue();

      // 実行
      await ingredientService.deleteIngredient(BigInt(1));

      // 検証
      expect(mockRepo.delete).toHaveBeenCalledWith(BigInt(1));
    });

    it('should throw error when deletion fails', async () => {
      // 準備
      const error = new Error('Deletion failed');
      mockRepo.delete.mockRejectedValue(error);

      // 実行 & 検証
      await expect(ingredientService.deleteIngredient(BigInt(1))).rejects.toThrow(
        'Deletion failed'
      );
      expect(mockRepo.delete).toHaveBeenCalledWith(BigInt(1));
    });
  });
});
