// scripts/test-dish-repository.ts
import { PrismaDishRepository } from '../src/repositories/prisma/DishRepository';

async function testDishRepository() {
  console.log('🧪 Testing PrismaDishRepository...');
  const repository = new PrismaDishRepository();
  try {
    // 1. カウントテスト
    const count = await repository.count();
    console.log(`✅ Count: ${count}`);
    // 2. 全件取得テスト
    const allDishes = await repository.findAll();
    console.log(`✅ Found ${allDishes.length} dishes`);
    if (allDishes.length > 0) {
      // 3. ID検索テスト
      const firstDish = await repository.findById(allDishes[0].id);
      console.log(`✅ Find by ID: ${firstDish ? 'Found' : 'Not found'}`);
      // 4. 材料込みで取得テスト
      const dishWithIngredients = await repository.findWithIngredients(allDishes[0].id);
      console.log(`✅ Dish with ingredients: ${dishWithIngredients?.dishIngredients.length || 0} ingredients`);
    }
    // 5. 名前検索テスト
    const searchedDishes = await repository.findByName('test');
    console.log(`✅ Search by name: ${searchedDishes.length} results`);
    console.log('🎉 All repository tests passed!');
  } catch (error: any) {
    console.error('❌ Repository test failed:', error.message);
  }
}

testDishRepository();
