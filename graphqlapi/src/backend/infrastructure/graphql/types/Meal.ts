import { ObjectType, Field, ID } from "type-graphql";
import { Dish, DishWithIngredients } from "./Dish";

@ObjectType()
export class Meal {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  userId!: string;

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
  @Field(() => [MealDishWithDish])
  mealDishes!: MealDishWithDish[];

  @Field(() => [DishWithIngredients])
  dishes!: Dish[];
}

@ObjectType()
export class MealDishWithDish extends Meal {
  @Field()
  dish!: DishWithIngredients;
}
