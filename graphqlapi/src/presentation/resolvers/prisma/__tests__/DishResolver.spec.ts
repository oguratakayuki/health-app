// src/presentation/resolvers/prisma/__tests__/DishResolver.spec.ts
import 'reflect-metadata'; // これを追加
import { PrismaDishResolver } from '../DishResolver';
import type { GraphQLContext } from '@/application/types/context';
import type { PrismaDish } from '@/graphql/types/prisma/PrismaDish';

describe('PrismaDishResolver', () => {
  let resolver: PrismaDishResolver;
  // 必要なメソッドのみをモック化し、型アサーションを使用
  const mockDishService = {
    getDish: jest.fn(),
    getAllDishes: jest.fn(),
    getDishesWithIngredients: jest.fn(),
    getDishesCount: jest.fn(),
    createDish: jest.fn(),
    updateDish: jest.fn(),
    deleteDish: jest.fn(),
  } as any; // as any で型チェックを回避
  const mockContext: GraphQLContext = {
    dishService: mockDishService,
  };
  beforeEach(() => {
    resolver = new PrismaDishResolver();
    jest.clearAllMocks();
  });
  describe('dish query', () => {
    it('should get dishService from context and call getDish', async () => {
      // 1. テストデータの準備
      const dishId = 'test-dish-1';
      const mockDish: PrismaDish = {
        id: dishId,
        name: 'Test Dish',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // 2. モックの設定
      mockDishService.getDish.mockResolvedValue(mockDish);
      // 3. テスト実行
      const result = await resolver.dish(dishId, mockContext);
      // 4. 検証
      expect(mockDishService.getDish).toHaveBeenCalledWith(dishId);
      expect(result).toEqual(mockDish);
    });
  });
});

