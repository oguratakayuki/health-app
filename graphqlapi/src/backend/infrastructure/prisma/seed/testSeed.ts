// src/backend/infrastructure/prisma/seed/testSeed.ts
import { PrismaClient } from "@prisma/client";

export async function seedTestIngredients(prisma: PrismaClient) {
  const now = new Date();

  // nutrients
  const nutrients = [
    { name: "エネルギー" },
    { name: "たんぱく質" },
    { name: "脂質" },
    { name: "炭水化物" },
    { name: "食物繊維" },
    { name: "ビタミンA" },
    { name: "ビタミンC" },
    { name: "ビタミンD" },
    { name: "カルシウム" },
    { name: "鉄" },
    { name: "亜鉛" },
    { name: "カリウム" },
  ];

  const nutrientMap = new Map<string, bigint>();

  for (const n of nutrients) {
    const nutrient = await prisma.nutrient.upsert({
      where: { name: n.name },
      update: {},
      create: {
        name: n.name,
        parentId: null,
        createdAt: now,
        updatedAt: now,
      },
    });
    nutrientMap.set(n.name, nutrient.id);
  }

  // ingredients
  const ingredients = [
    { name: "豚肉", originalName: "豚ロース" },
    { name: "じゃがいも", originalName: "男爵" },
    { name: "にんじん", originalName: "にんじん" },
    { name: "中華麺", originalName: "蒸し麺" },
    { name: "キャベツ", originalName: "キャベツ" },
    { name: "白米", originalName: "精白米（めし）" },
    { name: "植物油", originalName: "サラダ油" },
    { name: "ソース", originalName: "濃厚ソース" },
  ];

  const ingredientMap = new Map<string, bigint>();

  for (const i of ingredients) {
    const ingredient = await prisma.ingredient.upsert({
      where: { name: i.name },
      update: {},
      create: {
        name: i.name,
        originalName: i.originalName,
        createdAt: now,
        updatedAt: now,
      },
    });
    ingredientMap.set(i.name, ingredient.id);
  }

  // ingredient_nutrients
  const ingredientNutrients = [
    { ingredient: "豚肉", nutrient: "エネルギー", quantity: 263, unit: "kcal" },
    { ingredient: "豚肉", nutrient: "たんぱく質", quantity: 19, unit: "g" },
    { ingredient: "豚肉", nutrient: "脂質", quantity: 19, unit: "g" },
    {
      ingredient: "じゃがいも",
      nutrient: "エネルギー",
      quantity: 76,
      unit: "kcal",
    },
    {
      ingredient: "じゃがいも",
      nutrient: "たんぱく質",
      quantity: 1,
      unit: "g",
    },
    { ingredient: "じゃがいも", nutrient: "炭水化物", quantity: 17, unit: "g" },
    {
      ingredient: "にんじん",
      nutrient: "エネルギー",
      quantity: 37,
      unit: "kcal",
    },
    { ingredient: "にんじん", nutrient: "炭水化物", quantity: 9, unit: "g" },
    {
      ingredient: "にんじん",
      nutrient: "ビタミンA",
      quantity: 720,
      unit: "μg",
    },
    { ingredient: "白米", nutrient: "エネルギー", quantity: 168, unit: "kcal" },
    { ingredient: "白米", nutrient: "炭水化物", quantity: 37, unit: "g" },
    {
      ingredient: "植物油",
      nutrient: "エネルギー",
      quantity: 921,
      unit: "kcal",
    },
    { ingredient: "植物油", nutrient: "脂質", quantity: 100, unit: "g" },
    {
      ingredient: "中華麺",
      nutrient: "エネルギー",
      quantity: 281,
      unit: "kcal",
    },
    { ingredient: "中華麺", nutrient: "炭水化物", quantity: 56, unit: "g" },
    {
      ingredient: "キャベツ",
      nutrient: "エネルギー",
      quantity: 23,
      unit: "kcal",
    },
    { ingredient: "キャベツ", nutrient: "炭水化物", quantity: 5, unit: "g" },
    { ingredient: "キャベツ", nutrient: "ビタミンC", quantity: 41, unit: "mg" },
    {
      ingredient: "ソース",
      nutrient: "エネルギー",
      quantity: 139,
      unit: "kcal",
    },
    { ingredient: "ソース", nutrient: "炭水化物", quantity: 34, unit: "g" },
  ];

  for (const n of ingredientNutrients) {
    await prisma.ingredientNutrient.upsert({
      where: {
        ingredientId_nutrientId: {
          ingredientId: ingredientMap.get(n.ingredient)!,
          nutrientId: nutrientMap.get(n.nutrient)!,
        },
      },
      update: {},
      create: {
        ingredientId: ingredientMap.get(n.ingredient)!,
        nutrientId: nutrientMap.get(n.nutrient)!,
        contentQuantity: n.quantity,
        contentUnit: n.unit,
        contentUnitPer: 100,
        contentUnitPerUnit: "g",
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  // ========== 追加: dishes と dish_ingredients ==========
  // dishes
  const dishes = [{ name: "カレーライス" }, { name: "焼きそば" }];

  const dishMap = new Map<string, bigint>();

  for (const d of dishes) {
    const dish = await prisma.dish.upsert({
      where: { name: d.name },
      update: {},
      create: {
        name: d.name,
        createdAt: now,
        updatedAt: now,
      },
    });
    dishMap.set(d.name, dish.id);
  }

  // dish_ingredients (カレーライスの材料)
  const curryIngredients = [
    { dish: "カレーライス", ingredient: "豚肉", quantity: 50, unit: "g" },
    {
      dish: "カレーライス",
      ingredient: "じゃがいも",
      quantity: 100,
      unit: "g",
    },
    { dish: "カレーライス", ingredient: "にんじん", quantity: 30, unit: "g" },
    { dish: "カレーライス", ingredient: "白米", quantity: 200, unit: "g" },
    { dish: "カレーライス", ingredient: "植物油", quantity: 5, unit: "g" },
  ];

  // dish_ingredients (焼きそばの材料)
  const yakisobaIngredients = [
    { dish: "焼きそば", ingredient: "中華麺", quantity: 150, unit: "g" },
    { dish: "焼きそば", ingredient: "豚肉", quantity: 30, unit: "g" },
    { dish: "焼きそば", ingredient: "キャベツ", quantity: 50, unit: "g" },
    { dish: "焼きそば", ingredient: "植物油", quantity: 10, unit: "g" },
    { dish: "焼きそば", ingredient: "ソース", quantity: 30, unit: "g" },
  ];

  // 全dish_ingredientsを結合
  const allDishIngredients = [...curryIngredients, ...yakisobaIngredients];

  for (const di of allDishIngredients) {
    await prisma.dishIngredient.upsert({
      where: {
        dishId_ingredientId: {
          dishId: dishMap.get(di.dish)!,
          ingredientId: ingredientMap.get(di.ingredient)!,
        },
      },
      update: {},
      create: {
        dishId: dishMap.get(di.dish)!,
        ingredientId: ingredientMap.get(di.ingredient)!,
        contentQuantity: di.quantity,
        contentUnit: di.unit,
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  // ========== 追加: meals と meal_dishes ==========
  // テスト用にユーザー1の食事データも作成
  // まずテストユーザーを作成（既存ユーザーがいればスキップ）
  const testUser = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "テストユーザー",
      email: "test@example.com",
      createdAt: now,
      updatedAt: now,
    },
  });

  // 2026-01-17の食事データを作成
  const testMealDate = new Date("2026-01-17T12:00:00Z");
  const meal = await prisma.meal.upsert({
    where: {
      userId_mealDate_category: {
        // categoryを使用
        userId: 1n,
        mealDate: testMealDate,
        category: "lunch", // mealTypeの代わりにcategory
      },
    },
    update: {},
    create: {
      userId: 1n,
      mealDate: testMealDate,
      category: "lunch", // mealTypeの代わりにcategory
      createdAt: now,
      updatedAt: now,
    },
  });

  // meal_dishes: カレーライスと焼きそばの両方を追加
  await prisma.mealDish.upsert({
    where: {
      mealId_dishId: {
        mealId: meal.id,
        dishId: dishMap.get("カレーライス")!,
      },
    },
    update: {},
    create: {
      mealId: meal.id,
      dishId: dishMap.get("カレーライス")!,
      createdAt: now,
      updatedAt: now,
    },
  });

  await prisma.mealDish.upsert({
    where: {
      mealId_dishId: {
        mealId: meal.id,
        dishId: dishMap.get("焼きそば")!,
      },
    },
    update: {},
    create: {
      mealId: meal.id,
      dishId: dishMap.get("焼きそば")!,
      createdAt: now,
      updatedAt: now,
    },
  });

  console.log("Seed data created successfully!");
  console.log(`- ${nutrients.length} nutrients`);
  console.log(`- ${ingredients.length} ingredients`);
  console.log(`- ${ingredientNutrients.length} ingredient_nutrients`);
  console.log(`- ${dishes.length} dishes`);
  console.log(`- ${allDishIngredients.length} dish_ingredients`);
  console.log(`- 1 test user (id: 1)`);
  console.log(`- 1 meal for 2026-01-17`);
  console.log(`- 2 meal_dishes (カレーライス and 焼きそば)`);
}

/**
 * テスト後クリーンアップ
 * FK順序を守ることが重要
 */
export async function cleanupTestIngredients(prisma: PrismaClient) {
  // FK制約の順序に注意
  await prisma.mealDish.deleteMany();
  await prisma.meal.deleteMany();
  await prisma.dishIngredient.deleteMany();
  await prisma.dish.deleteMany();
  await prisma.ingredientNutrient.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.nutrient.deleteMany();
  // テストユーザーは残しておく（他のテストで使用される可能性があるため）
  // await prisma.user.deleteMany({ where: { id: 1 } });
}

// 単体実行用
if (require.main === module) {
  const prisma = new PrismaClient();
  seedTestIngredients(prisma)
    .then(async () => {
      console.log("Seeding completed.");
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error("Seeding failed:", e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
