// src/backend/infrastructure/graphql/inputs/prisma/CreateMealWithDishesInput.ts
import { InputType, Field } from "type-graphql";

@InputType()
class DishInput {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  name?: string;
}

@InputType()
export class CreateMealWithDishesInput {
  @Field()
  userId: number;

  @Field()
  mealDate: Date;

  @Field()
  category: string;

  @Field({ nullable: true })
  startTime?: string;

  @Field({ nullable: true })
  endTime?: string;

  @Field(() => [DishInput])
  dishes: DishInput[];
}
