import { ObjectType, Field, ID } from 'type-graphql';
import { Ingredient } from './Ingredient';

@ObjectType()
export class DishIngredient {
  @Field(() => ID)
  id!: string;

  @Field(() => Number)
  contentQuantity!: number;

  @Field()
  contentUnit!: string;

  @Field(() => Ingredient)
  ingredient?: Ingredient;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
