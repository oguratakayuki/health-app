import { IDishService } from '../shared/interfaces/IDishService';
import { 
  Dish, 
  DishWithIngredients, 
  CreateDishInput, 
  UpdateDishInput 
} from '../shared/types/Dish';
import { IDishRepository } from '../shared/interfaces/IDishRepository';

export class DishService implements IDishService {
  constructor(private dishRepository: IDishRepository) {}
  /**
   * IDで料理を取得（材料情報込み）
   */
  async getDish(id: string): Promise<DishWithIngredients | null> {
    try {
      return await this.dishRepository.findById(id);
    } catch (error) {
      console.error('DishService.getDish error:', error);
      throw new Error(`Failed to get dish: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 全ての料理を取得（簡易情報）
   */
  async getAllDishes(): Promise<Dish[]> {
    try {
      return await this.dishRepository.findAll();
    } catch (error) {
      console.error('DishService.getAllDishes error:', error);
      throw new Error(`Failed to get dishes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 全ての料理を取得（材料情報込み）
   */
  async getDishesWithIngredients(): Promise<DishWithIngredients[]> {
    try {
      return await this.dishRepository.findAllWithIngredients();
    } catch (error) {
      console.error('DishService.getDishesWithIngredients error:', error);
      throw new Error(`Failed to get dishes with ingredients: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 料理を作成
   */
  async createDish(input: CreateDishInput): Promise<Dish> {
    try {
      // バリデーション
      if (!input.name || input.name.trim().length === 0) {
        throw new Error('Dish name is required');
      }

      return await this.dishRepository.create(input);
    } catch (error) {
      console.error('DishService.createDish error:', error);
      throw new Error(`Failed to create dish: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 料理を更新
   */
  async updateDish(id: string, input: UpdateDishInput): Promise<Dish> {
    try {
      // バリデーション
      if (input.name && input.name.trim().length === 0) {
        throw new Error('Dish name cannot be empty');
      }

      const existingDish = await this.dishRepository.findById(id);
      if (!existingDish) {
        throw new Error(`Dish with id ${id} not found`);
      }

      return await this.dishRepository.update(id, input);
    } catch (error) {
      console.error('DishService.updateDish error:', error);
      throw new Error(`Failed to update dish: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 料理を削除
   */
  async deleteDish(id: string): Promise<boolean> {
    try {
      const existingDish = await this.dishRepository.findById(id);
      if (!existingDish) {
        throw new Error(`Dish with id ${id} not found`);
      }

      return await this.dishRepository.delete(id);
    } catch (error) {
      console.error('DishService.deleteDish error:', error);
      throw new Error(`Failed to delete dish: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 名前で料理を検索
   */
  async searchDishesByName(name: string): Promise<Dish[]> {
    try {
      if (!name || name.trim().length === 0) {
        return await this.dishRepository.findAll();
      }

      return await this.dishRepository.findByName(name);
    } catch (error) {
      console.error('DishService.searchDishesByName error:', error);
      throw new Error(`Failed to search dishes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 料理の総数を取得
   */
  async getDishesCount(): Promise<number> {
    try {
      return await this.dishRepository.count();
    } catch (error) {
      console.error('DishService.getDishesCount error:', error);
      throw new Error(`Failed to get dishes count: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
