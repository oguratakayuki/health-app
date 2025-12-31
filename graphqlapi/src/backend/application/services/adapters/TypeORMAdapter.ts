import { DishService } from '../DishService';
// import { TypeORMDishRepository } from '../../repositories/typeorm/DishRepository';

/**
 * TypeORM用のサービスアダプター（将来実装）
 */
export function createTypeORMDishService(): DishService {
  // 将来的にTypeORMリポジトリを実装したらここで使用
  // const repository = new TypeORMDishRepository();
  // return new DishService(repository);
  throw new Error('TypeORM adapter not implemented yet');
}
