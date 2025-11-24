const fetch = require('node-fetch');

const GRAPHQL_URL = 'http://localhost:3000/api/graphql';

async function graphqlQuery(query, variables = {}) {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables
    })
  });

  const result = await response.json();
  return result;
}

async function testPrismaDishResolver() {
  console.log('🧪 Testing Prisma Dish Resolver...\n');

  try {
    // 1. 料理一覧の取得テスト
    console.log('1. Testing dishes query...');
    const dishesResult = await graphqlQuery(`
      query {
        dishes {
          id
          name
          createdAt
          updatedAt
        }
      }
    `);
    if (dishesResult.errors) {
      console.error('❌ Dishes query failed:', dishesResult.errors[0].message);
    } else {
      console.log(`✅ Found ${dishesResult.data.dishes.length} dishes`);
    }

    // 2. 料理数取得テスト
    console.log('\n2. Testing dishes count...');
    const countResult = await graphqlQuery(`
      query {
        dishesCount
      }
    `);
    if (countResult.errors) {
      console.error('❌ Dishes count failed:', countResult.errors[0].message);
    } else {
      console.log(`✅ Dishes count: ${countResult.data.dishesCount}`);
    }

    // 3. 材料込みの料理一覧テスト
    console.log('\n3. Testing dishes with ingredients...');
    const dishesWithIngredientsResult = await graphqlQuery(`
      query {
        dishesWithIngredients {
          id
          name
          dishIngredients {
            id
            contentQuantity
            contentUnit
            ingredient {
              id
              name
            }
          }
        }
      }
    `);
    if (dishesWithIngredientsResult.errors) {
      console.error('❌ Dishes with ingredients failed:', dishesWithIngredientsResult.errors[0].message);
    } else {
      const dishes = dishesWithIngredientsResult.data.dishesWithIngredients;
      console.log(`✅ Found ${dishes.length} dishes with ingredients`);
      if (dishes.length > 0) {
        const ingredientsCount = dishes[0].dishIngredients.length;
        console.log(`   First dish has ${ingredientsCount} ingredients`);
      }
    }

    // 4. 検索テスト
    console.log('\n4. Testing search...');
    const searchResult = await graphqlQuery(`
      query SearchDishes($name: String) {
        searchDishes(name: $name) {
          dishes {
            id
            name
          }
          total
        }
      }
    `, { name: '' });
    if (searchResult.errors) {
      console.error('❌ Search failed:', searchResult.errors[0].message);
    } else {
      console.log(`✅ Search results: ${searchResult.data.searchDishes.dishes.length} dishes`);
    }

    console.log('\n🎉 All Prisma Dish Resolver tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPrismaDishResolver();
