// scripts/test-dish-simple.js
console.log('🧪 Testing Dish Repository (Simple Version)...');

async function test() {
  try {
    // 直接Prismaクライアントを使ってリポジトリのロジックをテスト
    const { prisma } = require('../lib/prisma');
    console.log('1. Testing count...');
    const count = await prisma.dish.count();
    console.log(`✅ Count: ${count}`);
    console.log('2. Testing findAll...');
    const dishes = await prisma.dish.findMany({
      orderBy: { id: 'asc' },
      take: 3
    });
    console.log(`✅ Found ${dishes.length} dishes`);
    console.log('3. Testing findById with ingredients...');
    if (dishes.length > 0) {
      const dishWithIngredients = await prisma.dish.findUnique({
        where: { id: dishes[0].id },
        include: {
          dishIngredients: {
            include: { ingredient: true }
          }
        }
      });
      console.log(`✅ Dish with ${dishWithIngredients.dishIngredients.length} ingredients`);
    }
    console.log('4. Testing findByName...');
    const searched = await prisma.dish.findMany({
      where: { name: { contains: 'test' } },
      take: 2
    });
    console.log(`✅ Search results: ${searched.length}`);
    console.log('🎉 All basic tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

test();
