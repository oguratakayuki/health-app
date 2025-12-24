import { ObjectType, Field, ID } from 'type-graphql';
import { DishIngredient } from './DishIngredient';

@ObjectType()
export class Dish {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class DishWithIngredients extends Dish {
  @Field(() => [DishIngredient])
  dishIngredients!: DishIngredient[];
}
