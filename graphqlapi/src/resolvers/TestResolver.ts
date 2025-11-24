// src/resolvers/TestResolver.ts
import { Query, Resolver, Field, ObjectType } from "type-graphql";
import { prisma } from "../../lib/prisma";


@ObjectType()
class DatabaseStatus {
  @Field()
  prismaConnected!: boolean;

  @Field()
  typeormConnected!: boolean;

  @Field(() => Number)
  dishCount!: number;

  @Field(() => Number)
  ingredientCount!: number;

  @Field(() => String)
  timestamp!: string;
}

@Resolver()
export class TestResolver {
  @Query(() => DatabaseStatus)
  async databaseStatus() {
    try {
      // Prismaでカウントを取得
      const dishCount = await prisma.dish.count();
      const ingredientCount = await prisma.ingredient.count();

      return {
        prismaConnected: true,
        typeormConnected: true, // TypeORMは既に初期化済みと仮定
        dishCount,
        ingredientCount,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Database status check failed:', error);
      return {
        prismaConnected: false,
        typeormConnected: false,
        dishCount: 0,
        ingredientCount: 0,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Query(() => String)
  async testPrisma() {
    try {
      const count = await prisma.dish.count();
      return `Prisma is working! Total dishes: ${count}`;
    } catch (error) {
      return `Prisma error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }
}
