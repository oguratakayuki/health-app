

# サービスをサービスインスタンス(context)から取得できるようにする
```
 // サービスインスタンスを作成
 const services = ServiceFactory.getServicesFromContext();
```

# adapterにcontextからserviceクラスを取得するメソッド追加

src/backend/application/services/adapters/index.ts
```
  static getServicesFromContext(context?: any) {
    return {
      calculateDailyNutritionUseCase:
        context?.calculateDailyNutritionUseCase ||
        this.createCalculateDailyNutritionUseCase(context),
    };


  static createCalculateDailyNutritionUseCase(
    context?: any,
  ): calculateDailyNutritionUseCase {
    if (context?.calculateDailyNutritionUseCase) {
      return context.calculateDailyNutritionUseCase;
    }
    return createCalculateDailyNutritionUseCase();
  }


```

# prismaAdapterにservice生成メソッド(DI)を追加
src/backend/application/services/adapters/PrismaAdapter.ts
```
export function createCalculateDailyNutritionUseCase(): CalculateDailyNutritionUseCase {
  const prisma = getPrismaClient();
  // Repository
  const mealRepository = new MealRepository(prisma);
  const ingredientNutrientRepository = new IngredientNutrientRepository(prisma);

  // QueryService
  const queryService = new DailyNutritionQueryService(
    mealRepository,
    ingredientNutrientRepository,
  );
```

# 実際に呼び出す
graphqlapi/src/backend/presentation/resolvers/NutrientResolver.ts
```
  @Query(() => String) // 最初は簡易でOK（あとでDTO化）
  async dailyNutrition(
    @Arg("date") date: string,
    @Ctx() ctx: GraphQLContext,
  ): Promise<string> {
    try {
      if (!ctx.calculateDailyNutritionUseCase) {
        throw new Error("UseCase is not available in context");
      }
      console.log(date);

      const result = ctx.calculateDailyNutritionUseCase.execute();

      return JSON.stringify(result); // 一旦これで動かす
    } catch (error) {
      console.error(`Error in dailyNutrition query: ${error}`);
      throw new Error("Failed to calculate daily nutrition");
    }
  }
}
```

# 備考 resolverは以下でcontextに紐づいている
src/backend/presentation/resolvers/index.ts
```
export const resolvers = [
  IngredientResolver,
  IngredientNutrientResolver,
  UserResolver,
  MeResolver,
  DishResolver,
  NutrientResolver,
  NutrientsIntakeStandardResolver,
] as const;
```
app/api/graphql/route.ts
```
async function getYoga() {
  if (!yogaInstance) {
    console.log("🔧 Initializing GraphQL Yoga with context support...");
    // GraphQLスキーマの構築
    const schema = await buildSchema({
      resolvers,
      validate: false,
    });

    yogaInstance = createYoga({
      schema,
      graphqlEndpoint: "/api/graphql",
```



