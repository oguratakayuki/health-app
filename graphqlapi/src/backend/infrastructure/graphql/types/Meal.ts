import { ObjectType, Field, ID } from "type-graphql";
import { Dish } from "./Dish";

@ObjectType()
export class Meal {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  userId!: number;

  @Field()
  mealDate!: Date;

  @Field()
  startTime!: string;

  @Field()
  endTime!: string;

  @Field()
  category!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class MealWithDishes extends Meal {
  @Field(() => [Dish], { nullable: true })
  dishes!: Dish[];
}
